const express = require('express');
const router = express.Router();
const db = require('./db'); // Importa tu módulo de conexión a la base de datos

// Obtener todos los prompts en un idioma específico
router.get('/prompts/:language', async (req, res) => {
    const {gameId, language} = req.body;

    try {
        const prompts = await db.query('SELECT * FROM prompts WHERE id_juego = ? AND language = ?', [gameId, language]);
        res.json(prompts);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al obtener los prompts'});
    }
});

// Obtener una respuesta de seguridad para un prompt específico
router.get('/safety-answer/:promptId', async (req, res) => {
    const promptId = req.params.promptId;
    try {
        const answers = await db.query('SELECT * FROM safety_answers WHERE prompt_id = ?', [promptId]);
        res.json(answers);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al obtener la respuesta de seguridad'});
    }
});

router.post('/answer', async (req, res) => {
    const {promptId, answer} = req.body;
    try {
        await db.query('INSERT INTO answers (prompt_id, text) VALUES (?, ?)', [promptId, answer]);
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al registrar la respuesta de seguridad'});
    }
});

router.post('/safety-answer', async (req, res) => {
    const promptId = req.params.promptId;

    try {
        const answers = await db.query('SELECT * FROM safety_answers WHERE prompt_id = ?', [promptId]);

        const answer = answers[Math.floor(Math.random() * answers.length)];

        try {
            await db.query('INSERT INTO answers (prompt_id, text) VALUES (?, ?)', [promptId, answer]);
            res.sendStatus(200);
        } catch (error) {
            console.error(error);
            res.status(500).json({error: 'Error al registrar la respuesta de seguridad'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Error al obtener los prompts'});
    }
});

module.exports = router;
