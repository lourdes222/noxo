const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'noxo_db'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        return;
    }
    console.log('Conectado exitosamente a la base de datos de XAMPP (`noxo_db`)!');
});

app.get('/', (req, res) => {
    res.send('Servidor backend de Noxo funcionando correctamente.');
});

app.post('/api/votar', (req, res) => {
    const { profileId, pollId, optionId } = req.body;
    console.log("Voto recibido -> profileId:", profileId, "pollId:", pollId, "optionId:", optionId);
    db.query('DELETE FROM room_participants WHERE user_id = ?', [profileId], (errCleanRoom)=>{
        if(errCleanRoom) console.log("Error al limpiar salas anteriores.", errCleanRoom.message);
        
    const sqlBorrarViejo = 'DELETE FROM poll_votes WHERE user_id = ? AND poll_id = ?';
    db.query(sqlBorrarViejo, [profileId, pollId], (errDel) => {
        if (errDel) return res.status(500).json({ error: errDel.message });

        const sqlBuscarMatch = 'SELECT * FROM poll_votes WHERE poll_id = ? AND option_id = ? AND user_id != ? LIMIT 1';
        db.query(sqlBuscarMatch, [pollId, optionId, profileId], (errMatch, results) => {
            if (errMatch) return res.status(500).json({ error: errMatch.message });

            if (results.length > 0) {
                const matchUser = results[0];

                db.query('DELETE FROM poll_votes WHERE id = ?', [matchUser.id], (errDelMatch) => {
                    if (errDelMatch) return res.status(500).json({ error: errDelMatch.message });

                    const sqlCrearSala = 'INSERT INTO rooms (name) VALUES (?)';
                    db.query(sqlCrearSala, [`Debate Anónimo`], (errRoom, resultRoom) => {
                        if (errRoom) return res.status(500).json({ error: errRoom.message });

                        const roomId = resultRoom.insertId;
                        const sqlParticipantes = 'INSERT INTO room_participants (room_id, user_id) VALUES (?, ?), (?, ?)';
                        db.query(sqlParticipantes, [roomId, profileId, roomId, matchUser.user_id], (errPart) => {
                            if (errPart) return res.status(500).json({ error: errPart.message });

                            return res.json({ match: true, roomId: roomId });
                        });
                    });
                });
            } else {
                const sqlGuardarVoto = 'INSERT INTO poll_votes (user_id, poll_id, option_id) VALUES (?, ?, ?)';
                db.query(sqlGuardarVoto, [profileId, pollId, optionId], (errIns) => {
                    if (errIns) return res.status(500).json({ error: errIns.message });
                    return res.json({ match: false, message: 'Esperando oponente real...' });
                });
            }
        });
    });
});});
app.get('/api/verificar-sala', (req, res) => {
    const { profileId } = req.query;
    const sql = `
        SELECT rp.room_id as roomId 
        FROM room_participants rp 
        JOIN rooms r ON rp.room_id = r.id 
        WHERE rp.user_id = ? 
        ORDER BY r.id DESC LIMIT 1
    `;
    db.query(sql, [profileId], (err, results) => {
        if (err) {
            console.error("Error en verificar-sala:", err.message);
            return res.status(500).json({ error: err.message });
        }

        if (results.length > 0) {
            return res.json({ roomFound: true, roomId: results[0].roomId });
        } else {
            return res.json({ roomFound: false });
        }
    });
});
app.post('/api/mensajes', (req, res) => {
    const { roomId, senderId, message } = req.body;
    const sql = 'INSERT INTO messages (room_id, sender_profile_id, content) VALUES (?, ?, ?)';
    db.query(sql, [roomId, senderId, message], (err, result) => {
        if (err) {
            console.log("Error al insertar mensaje:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, messageId: result.insertId });
    });
});
app.get('/api/mensajes/:roomId', (req, res) => {
    const { roomId } = req.params;
    const sql = `
    SELECT m.id, room_id, m.sender_profile_id, m.content AS texto, m.created_at, c.alias AS remitente
    FROM messages m
    LEFT JOIN chat_profiles c ON m.sender_profile_id = c.user_id
    WHERE room_id = ?
    ORDER BY m.created_at ASC
    `;
    db.query(sql, [roomId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
app.post('/api/salir-sala', (req, res)=>{
    const {profileId, roomId}=req.body;
    const sqlBorrarMensajes = 'DELETE FROM messages WHERE room_id = ?';
    db.query(sqlBorrarMensajes, [roomId], (errMsj)=>{
        if(errMsj)console.log("Error al borrar mensajes:", errMsj.message);
  
    const sqlBorrarParticipante = 'DELETE FROM room_participants WHERE room_id = ? AND user_id = ?';
    db.query(sqlBorrarParticipante, [roomId, profileId],(errPart)=>{
        if(errPart)return res.status(500).json({error: errPart.message});
        res.json({success: true, message: 'Has salido de la sala.'});
    });
  });
});
app.post('/api/polls', (req, res)=>{
    const { profileId, question, options, category } = req.body;
    const categoriaFinal = category || 'general';
    if(!question || !options || options.length < 2){
        return res.status(400).json({error: 'Pregunta y al menos dos opciones son requeridas.'});
    }
    const sqlPoll = 'INSERT INTO polls (creator_profile_id, question, category) VALUES (?, ?, ?)';
    db.query(sqlPoll, [profileId, question, categoriaFinal], (err, result)=>{
        if(err)return res.status(500).json({error:err.message});
        const pollId = result.insertId;
        const sqlOptions = 'INSERT INTO poll_options (poll_id, option_text) VALUES ?';
        const optionsData = options.map(opt=>[pollId, opt]);
        db.query(sqlOptions, [optionsData], (errOpt)=>{
            if(errOpt)return res.status(500).json({error:errOpt.message});
            res.json({success: true, message: 'Encuesta creada con éxito.', pollId});
        });
    });
});
app.get('/api/polls', (req, res)=>{
    const sql = `SELECT p.id, p.question, p.category, c.alias AS creator_alias, p.created_at
    FROM polls p
    JOIN chat_profiles c ON p.creator_profile_id = c.user_id
    ORDER BY p.created_at DESC
    `;
    db.query(sql, (err, polls)=>{
        if(err)return res.status(500).json({error:err.message});
        res.json(polls);
    })  
});
app.post('/api/usuarios', (req, res) => {
    const { email, password, alias } = req.body;
    const sqlBuscar = 'SELECT u.id, c.id AS profileId, c.alias FROM users u LEFT JOIN chat_profiles c ON u.id = c.user_id WHERE u.email = ?';

    db.query(sqlBuscar, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            const usuarioExistente = results[0];
            return res.json({ 
                message: '¡Inicio de sesión exitoso!', 
                alias: usuarioExistente.alias || `Noxo_${Math.floor(Math.random() * 9000) + 1000}`,
                profileId: usuarioExistente.profileId 
            });
        }
        const sqlUser = 'INSERT INTO users (email, password_hash) VALUES (?,?)';
        db.query(sqlUser, [email, password], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            const newUserId = result.insertId;
            const sqlProfile = 'INSERT INTO chat_profiles (user_id, alias) VALUES (?,?)';
            db.query(sqlProfile, [newUserId, alias], (errProfile, profileResult) => { 
                if (errProfile) return res.status(500).json({ error: errProfile.message });
                
                res.json({ 
                    message: '¡Usuario registrado con éxito!', 
                    alias: alias,
                    profileId: profileResult.insertId 
                });
            });
        });
    });
});
app.get('/api/poll-details/:pollId', (req, res) => {
    const { pollId } = req.params;
    const commentsQuery = 'SELECT * FROM poll_comments WHERE poll_id = ? ORDER BY created_at DESC';
    const likesQuery = 'SELECT COUNT(*) AS totalLikes FROM poll_likes WHERE poll_id = ?';

    db.query(commentsQuery, [pollId], (err, comments) => {
        if(err) return res.status(500).json({ error: err.message });
        db.query(likesQuery, [pollId], (err, likeResult) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
                comments,
                totalLikes: likeResult[0] ? likeResult[0].totalLikes : 0
            });
        });
    });
});

app.post('/api/poll-comments', (req, res) => {
    const { pollId, profileId, commentText } = req.body;
    console.log("Comentario recibido -> pollId:", pollId, "profileId:", profileId, "texto:", commentText);

    if (!profileId) {
        return res.status(400).json({ error: 'Falta el profileId del usuario.' });
    }

    const query = 'INSERT INTO poll_comments (poll_id, profile_id, comment_text) VALUES (?, ?, ?)';
    db.query(query, [pollId, profileId, commentText], (err, result) => {
        if(err) return res.status(500).json({ error: err.message });
        res.json({ success: true, message: 'Comentario agregado con éxito' });
    });
});

app.post('/api/poll-like', (req, res) => {
    const { pollId, profileId } = req.body;
    console.log("Like recibido -> pollId:", pollId, "profileId:", profileId);

    if (!profileId) {
        return res.status(400).json({ error: 'Falta el profileId del usuario.' });
    }

    const checkQuery = 'SELECT * FROM poll_likes WHERE poll_id = ? AND profile_id = ?';
    db.query(checkQuery, [pollId, profileId], (err, results) => {
        if(err) return res.status(500).json({ error: err.message });
        if(results.length > 0) {
            const deleteQuery = 'DELETE FROM poll_likes WHERE poll_id = ? AND profile_id = ?';
            db.query(deleteQuery, [pollId, profileId], (err) => {
                if(err) return res.status(500).json({ error: err.message });
                res.json({ liked: false, message: 'Like removido' });
            });
        } else {
            const insertQuery = 'INSERT INTO poll_likes (poll_id, profile_id) VALUES (?, ?)';
            db.query(insertQuery, [pollId, profileId], (err) => {
                if(err) return res.status(500).json({ error: err.message });
                res.json({ liked: true, message: 'Like agregado' });
            });
        }
    });
});
app.get('/api/user-likes/:profileId', (req, res) => {
    const { profileId } = req.params;
    const query = `
        SELECT p.* 
        FROM poll_likes l 
        JOIN polls p ON l.poll_id = p.id 
        WHERE l.profile_id = ?
    `;
    db.query(query, [profileId], (err, results) => {
        if (err) {
            console.error("Error en /api/user-likes:", err);
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});
app.get('/api/user-comments-polls/:profileId', (req, res) => {
    const { profileId } = req.params;
    const query = `
        SELECT DISTINCT p.* 
        FROM poll_comments c 
        JOIN polls p ON c.poll_id = p.id 
        WHERE c.profile_id = ?
        ORDER BY c.created_at DESC
    `;
    db.query(query, [profileId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});