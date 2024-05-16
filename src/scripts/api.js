const express = require('express');
const router = express.Router();
const db = require('./db'); // Importa tu módulo de conexión a la base de datos

// Obtener todos los prompts en un idioma específico
router.get('/prompts/:gameId/:language', (req, res) => {
    const {gameId, language} = req.params;
    console.log('ID JUEGO EN CONSULTA: ', gameId);

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

// Obtener una respuesta de seguridad para un prompt específico
router.get('/safety-answer/:promptId/:language', (req, res) => {
    const {promptId, language} = req.params;
    const query = 'SELECT id_answer, id_prompt, text FROM safety_answers WHERE id_prompt = ? AND idioma = ?';
    db.query(query, [promptId, language], (error, answers) => {
        if (error) {
            console.error(error);
            res.status(500).json({error: 'Error al obtener la respuesta de seguridad'});
            return;
        }
        res.json(answers);
    });
});

router.post('/answer', (req, res) => {
    const {promptId, answer, playerId, round, lobbyCode} = req.body;

    // TODO Hacer consulta a BBDD para obtener ID sala usando lobbyCode

    db.query('INSERT INTO answers (prompt_id, text, player_id, round) VALUES (?, ?)', [promptId, answer, playerId, round], (error) => {
        if (error) {
            console.error(error);
            res.status(500).json({error: 'Error al registrar la respuesta de seguridad'});
            return;
        }
        res.sendStatus(200);
    });
});

router.post('/safety-answer', (req, res) => {
    const {promptId, playerId, round, lobbyCode} = req.body;

    db.query('SELECT id_sala FROM salas WHERE codigo_sala = ?', [lobbyCode], (error, result) => {


        if (error) {
            console.error(error);
            res.status(500).json({error: 'Error al obtener el id de la sala'});
            return;
        }

        db.query('SELECT * FROM safety_answers WHERE prompt_id = ?', [promptId], (error, answers) => {
            if (error) {
                console.error(error);
                res.status(500).json({error: 'Error al obtener las respuestas de emergencia'});
                return;
            }
            // TODO Hacer consulta a BBDD para obtener ID sala usando lobbyCode


            const answer = answers[Math.floor(Math.random() * answers.length)];

            db.query('INSERT INTO answers (prompt_id, text, player_id, round) VALUES (?, ?)', [promptId, answer, playerId, round], (error) => {
                if (error) {
                    console.error(error);
                    res.status(500).json({error: 'Error al registrar la respuesta de emergencia'});
                    return;
                }
                res.sendStatus(200);
            });
        });
    });


});


module.exports = router;
