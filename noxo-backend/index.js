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
});
app.get('/api/verificar-sala', (req, res) => {
    const { profileId } = req.query;
    const sql = `
        rp.room_id as roomId 
        FROM room_participants rp 
        JOIN rooms r ON rp.room_id = r.id 
        WHERE rp.user_id = ? 
        ORDER BY r.id DESC LIMIT 1
    `;
    db.query('SELECT room_id FROM room_participants WHERE user_id = ? ORDER BY room_id DESC LIMIT 1', [profileId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });

        if (results.length > 0) {
            return res.json({ roomFound: true, roomId: results[0].room_id });
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
    const sql = 'SELECT id, room_id, sender_profile_id, content, created_at FROM messages WHERE room_id = ? ORDER BY created_at ASC';
    db.query(sql, [roomId], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});
app.post('/api/usuarios', (req, res) => {
    const { email, password, alias } = req.body;
    const sqlBuscar = 'SELECT u.id, c.alias FROM users u LEFT JOIN chat_profiles c ON u.id = c.user_id WHERE u.email = ?';

    db.query(sqlBuscar, [email], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length > 0) {
            const usuarioExistente = results[0];
            return res.json({ 
                message: '¡Inicio de sesión exitoso!', 
                alias: usuarioExistente.alias || `Noxo_${Math.floor(Math.random() * 9000) + 1000}` 
            });
        }
        const sqlUser = 'INSERT INTO users (email, password_hash) VALUES (?,?)';
        db.query(sqlUser, [email, password], (err, result) => {
            if (err) return res.status(500).json({ error: err.message });

            const newUserId = result.insertId;
            const sqlProfile = 'INSERT INTO chat_profiles (user_id, alias) VALUES (?,?)';

            db.query(sqlProfile, [newUserId, alias], (errProfile) => {
                if (errProfile) return res.status(500).json({ error: errProfile.message });
                res.json({ message: '¡Usuario registrado con éxito!', alias: alias });
            });
        });
    });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en http://10.0.9.244:${PORT}`);
});