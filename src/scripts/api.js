const express = require('express');
const router = express.Router();
const db = require('./db'); // Importa tu módulo de conexión a la base de datos

// Obtener todos los prompts en un idioma específico
router.get('/prompts/:gameId/:language', (req, res) => {
    const {gameId, language} = req.params;

    const query = 'SELECT id_prompt, text FROM prompts WHERE id_juego = ? AND idioma = ?';
    db.query(query, [gameId, language], (err, results, fields) => {
        if (err) {
            console.error('Error al obtener los prompts:', err);
            res.status(500).json({error: 'Error al obtener los prompts'});
            return;
        }

        if (results.length === 0) {
            res.status(404).json({error: 'No se encontraron prompts'});
            return;
        }

        // Enviar los datos como respuesta JSON
        res.json(results);
    });
});

router.get('/prompts/get/:language/:promptText', (req, res) => {
    const {language, promptText} = req.params;
    const query = 'SELECT id_prompt, text FROM prompts WHERE idioma = ? AND text = ?';
    db.query(query, [language, promptText], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({error: 'Error al obtener el prompt'});
            return;
        }
        if (results.length === 0) {
            res.status(404).json({error: 'No se encontró el prompt'});
            return;
        }
        res.json(results);
    });
});

// Obtener una respuesta de emergencia para un prompt específico
router.get('/safety-answers/:promptId/:language', (req, res) => {
    const {promptId, language} = req.params;
    const query = 'SELECT id_answer, id_prompt, text FROM respuestas_emergencia WHERE id_prompt = ? AND idioma = ?';
    db.query(query, [promptId, language], (error, answers) => {
        if (error) {
            console.error(error);
            res.status(500).json({error: 'Error al obtener la respuesta de seguridad'});
            return;
        }
        res.json(answers);
    });
});

router.post('/send-answer', (req, res) => {
    const {promptId, answer, playerId, round, lobbyCode} = req.body;


    db.query('SELECT id_sala FROM salas WHERE codigo_sala = ?', [lobbyCode], (error, result) => {
        if (error) {
            console.error(error);
            res.status(500).json({error: 'Error al obtener el id de la sala'});
            return;
        }

        if (result.length === 0) {
            // No se encontró ninguna sala con el código dado
            res.status(404).json({ error: 'No se encontró ninguna sala con el código proporcionado' });
            return;
        }

        const idSala = result[0].id_sala;
        console.log('ENVIAR RESPUESTA idSAla: ', idSala);

        db.query('INSERT INTO respuestas (id_prompt, texto, id_jugador, ronda, id_sala) VALUES (?, ?, ?, ?, ?)', [promptId, answer, playerId, round, idSala], (error) => {
            if (error) {
                console.error(error);
                res.status(500).json({error: 'Error al registrar la respuesta de seguridad'});
                return;
            }
            res.sendStatus(200);
        });
    });
});

router.post('/answers/create', (req, res) => {
    const {lobbyId, answerText, playerId, promptId, ronda} = req.body;
    db.query('SELECT * FROM salas  WHERE id_sala = ?', [lobbyId], (error) => {
        if (error) {
            console.error(error);
            res.status(500).json({error: 'Error al obtener el id de la sala'});
            return;
        }

        db.query('INSERT INTO respuestas (id_prompt, texto, id_jugador, ronda, id_sala) VALUES (?, ?, ?, ?, ?)', [promptId, answerText, playerId, ronda, lobbyId], (error) => {
            if (error) {
                console.error(error);
                res.status(500).json({error: 'Error al registrar la respuesta'});
                return;
            }
            res.sendStatus(200);
        });

    })
});

router.post('/players/create', (req, res) => {
    const {lobbyId, id, name, score} = req.body;

    db.query('SELECT * FROM salas  WHERE id_sala = ?', [lobbyId], (error) => {
        if (error) {
            console.error(error);
            res.status(500).json({error: 'Error al obtener el id de la sala'});
            return;
        }

        db.query('INSERT INTO jugadores (id_jugador, id_sala, nombre_jugador, puntuacion) VALUES (?, ?, ?, ?)', [id, lobbyId, name, score], (error) => {
            if (error) {
                console.error(error);
                res.status(500).json({error: 'Error al registrar el jugador'});
                return;
            }
            res.sendStatus(200);
        });
    })
});

router.post('/players/update-score', (req, res) => {
    const { lobbyId, playerId, score } = req.body;

    db.query('SELECT * FROM salas WHERE id_sala = ?', [lobbyId], (error, results) => {
        if (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al obtener el id de la sala' });
            return;
        }

        if (results.length === 0) {
            res.status(404).json({ error: 'Sala no encontrada' });
            return;
        }

        db.query('UPDATE jugadores SET puntuacion = ? WHERE id_jugador = ? AND id_sala = ?', [score, playerId, lobbyId], (error) => {
            if (error) {
                console.error(error);
                res.status(500).json({ error: 'Error al actualizar la puntuacion del jugador' });
                return;
            }
            res.sendStatus(200);
        });
    });
});


// Este bloque servirá para poder crear respuestas por defecto personalizadas
router.post('/safety-answers/create', (req, res) => {
    const {answerId, promptId, text, language} = req.body;


    db.query('SELECT * FROM prompts WHERE id_prompt = ?', [promptId], (error) => {
        if (error) {
            console.error(error);
            res.status(500).json({error: 'Error al encontrar el prompt'});
            return;
        }


        db.query('INSERT INTO respuestas_emergencia (id_answer,id_prompt, text, idioma) VALUES (?, ?, ?, ?)', [answerId,promptId, text, language], (error) => {
            if (error) {
                console.error(error);
                res.status(500).json({error: 'Error al registrar la respuesta de emergencia'});
                return;
            }
            res.sendStatus(200);
        });
    });
});

// Aquí podemos crear nuevos prompts para un juego
router.post('/prompts/create', (req, res) => {
    const {promptId, gameId, text, language} = req.body;
    db.query('INSERT INTO prompts (id_prompt, id_juego, text, idioma) VALUES (?, ?, ?, ?)', [promptId, gameId, text, language], (error) => {
        if (error) {
            console.error(error);
            res.status(500).json({error: 'Error al registrar el prompt'});
            return;
        }
        res.sendStatus(200);
    });
});

router.post('/lobby/create', (req, res) => {
    const { id, code, game } = req.body;
    db.query('INSERT INTO salas (id_sala, id_modoJuego, codigo_sala) VALUES (?, ?, ?)', [id, game, code], (error) => {
        if (error) {
            console.error('Error al registrar la sala:', error);
            res.status(500).json({ error: 'Error al registrar la sala' });
            return;
        }
        res.status(200).json({ message: 'Sala creada exitosamente' });
    });
});

module.exports = router;
