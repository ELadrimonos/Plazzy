const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: "*", // Permitir solicitudes desde localhost:3000
        methods: ["GET", "POST"]
    }
});
const apiRoutes = require('./api');

app.use(express.json());
app.use('/api', apiRoutes);

// Enum de pantallas de juego
const GameScreens = Object.freeze({
    LOBBY: 'lobby',
    START: 'start',
    ANSWER: 'respondiendo',
    VOTING: 'jugando',
    SCOREBOARD: 'puntuaje',
    FINAL_SCREEN: 'fin',
});



const lobbies = [];


http.listen(8080, () => console.log("LISTENING ON 8080"));


io.on('connection', (socket) => {
    // console.log('Usuario conectado:', socket.id);

// Unirse a sala
    socket.on('joinGame', (nombreJug, lobbyCode) => {
        const lobby = getLobby(lobbyCode);

        if (lobby && lobby.players.length < 8) {
            socket.join(lobbyCode);

            let player = {id: socket.id, name: nombreJug};
            lobby.players.push(player);
            socket.emit('joinGame', lobby);
            socket.emit('shareGameMode', lobby.game);
            socket.emit('sharePlayer', player);
            socket.emit('updatePlayers', lobby.players);
            io.to(lobbyCode).emit('updatePlayers', lobby.players);
        } else {
            socket.emit('joinError', 'No se puede unir a la sala');
        }
    });

// Crear sala
    socket.on('create', (nombreHost, juego) => {
        const newLobby = {id: generateUUID(), code: generateRandomCode(), players: [], game: juego, data: [], round: 1, promptsOrder: []};
        lobbies.push(newLobby);

        // Aqui es donde realmente se conecta al lobby
        socket.join(newLobby.code);

        let player = {id: socket.id, name: nombreHost, score: 0};
        newLobby.players.push(player);
        socket.emit('lobbyCreated', newLobby);
        socket.emit('joinGame', newLobby);
        socket.emit('sharePlayer', player);
        socket.emit('updatePlayers', newLobby.players);
        io.to(newLobby.code).emit('updatePlayers', newLobby.players);
    });

    // Manejar la desconexión
    socket.on('disconnect', () => {
        const lobby = lobbies.find((l) => l.players.some((p) => p.id === socket.id));

        if (lobby) {

            if (lobby.players[0].id === socket.id) {
                io.to(lobby.code).emit('joinError', 'El host se ha desconectado de la sala');

                closeLobby(lobby.code);
            }

            let disconnectedPlayer = lobby.players.find(p => p.id === socket.id);
            let disconPlayerId = lobby.players.indexOf(disconnectedPlayer)

            lobby.players = lobby.players.filter((p) => p.id !== socket.id);

            socket.leave(lobby.code);
            io.to(lobby.code).emit('disconnectPlayer', disconPlayerId, lobby.players);
            io.to(lobby.code).emit('updatePlayers', lobby.players);
        }


        // console.log('Usuario desconectado:', socket.id);
    });

    socket.on('playerAnswer', (lobbyCode, playerID, answer) => {
        const lobby = getLobby(lobbyCode);
        if (lobby) {
            const playerData = lobby.data.find((d) => d.playerId === playerID);
            if (playerData) {
                playerData.answers.push(answer);
                comprobarNumeroDeRespuestas(lobbyCode);
            } else {
                console.error('No se encontraron datos del jugador con ID:', playerID);
            }
        } else {
            console.error('No se encontró la sala con el código:', lobbyCode);
        }
    });


    socket.on('startGame', (lobbyCode) => {
        const lobby = getLobby(lobbyCode);
        if (lobby) {
            io.to(lobbyCode).emit('cambiarEscena', GameScreens.START);
            generatePromptsForPlayers(lobbyCode);
        }

    });

    socket.on('newRound', (lobbyCode) => {
        const lobby = getLobby(lobbyCode);
        if (lobby) {
            io.to(lobbyCode).emit('cambiarEscena', GameScreens.ANSWER);
            generatePromptsForPlayers(lobbyCode);

        }
    });

    socket.on('playerRanOutOfTimeToAnswer', (lobbyCode, playerID) => {
        const lobby = getLobby(lobbyCode);
        if (lobby) {
            const playerData = lobby.data.find((d) => d.playerId === playerID);
            if (playerData) {
                const totalPlayerAnswers = playerData.answers.length;
                for (let i = 0; i < totalPlayerAnswers; i++) {
                    playerUseSafetyAnswer(lobbyCode, playerID);
                }
            } else {
                console.error('No se encontraron datos del jugador con ID:', playerID);
            }
        }
    });

    socket.on('loadNextVotingData', (lobbyCode) => {
        const lobby = getLobby(lobbyCode);
        if (lobby) {

            socket.emit('getVotingData', lobby.data.prompts);
        }
    });

    socket.on('playerUseSafetyAnswer', (lobbyCode, playerID) => {
        playerUseSafetyAnswer(lobbyCode, playerID);
        comprobarNumeroDeRespuestas(lobbyCode);
    });

    socket.on('playerVote', (lobbyCode, playerName) => {
        const lobby = getLobby(lobbyCode);
        if (lobby) {
            const player = lobby.players.find((p) => p.name === playerName);
            if (player) {
                player.score += 100 * lobby.round;
            }
        }
    });

    socket.on('getPlayerPrompts', (lobbyCode, playerID) => {
        const lobby = getLobby(lobbyCode);
        if (lobby) {
            const playerPrompts = lobby.data.find((data) => data.playerId === playerID).prompts;
            socket.emit('getPrompts', playerPrompts);
        }
    });

    socket.on('startAnswering', (lobbyCode) => {
        const lobby = getLobby(lobbyCode);
        if (lobby) {
            io.to(lobbyCode).emit('cambiarEscena', GameScreens.ANSWER);
        }
    });

    socket.on('startVoting', (lobbyCode) => {
        const lobby = getLobby(lobbyCode);
        if (lobby) {
            associateAnswersToUniquePrompt(lobby);
            console.log(lobby)
            io.to(lobbyCode).emit('cambiarEscena', GameScreens.VOTING);
        }
    });

    socket.on('startResults', (lobbyCode) => {
        const lobby = getLobby(lobbyCode);
        if (lobby) {
            io.to(lobbyCode).emit('cambiarEscena', GameScreens.SCOREBOARD);
        }
    });

    socket.on('startEndGame', (lobbyCode) => {
        const lobby = getLobby(lobbyCode);
        if (lobby) {
            io.to(lobbyCode).emit('cambiarEscena', GameScreens.FINAL_SCREEN);
            const ganador = devolverJugadoresPorPuntuacion(lobby.players)[0];
            const indexGanador = lobby.players.findIndex((p) => p.id === ganador.id);
            console.log('GANADOR: ', indexGanador);
            io.to(lobbyCode).emit('getWinner', indexGanador);
        }
    });


    socket.on('startLobby', (lobbyCode) => {
        const lobby = getLobby(lobbyCode);
        if (lobby) {
            //TODO: Guardar todos los datos en la BBDD y cambiar id de este lobby
            lobby.id = generateUUID();
            lobby.round = 1;
            clearLobbyData(lobby);
            io.to(lobbyCode).emit('cambiarEscena', GameScreens.LOBBY);
        }
    });

});

const closeLobby = (lobbyCode) => {
    const lobby = getLobby(lobbyCode);
    if (lobby) {
        io.to(lobby.code).emit('closeLobby');
    }

    const room = io.sockets.adapter.rooms.get(lobbyCode);


    if (room) {
        // Eliminar la sala de la lista de lobbies
        const index = lobbies.findIndex(lobby => lobby.code === lobbyCode);
        if (index !== -1) {
            lobbies.splice(index, 1);
            console.warn("Sala cerrada:", lobbyCode);
        } else {
            console.error("No se encontró la sala para cerrar:", lobbyCode);
        }
    } else {
        console.error("La sala no existe:", lobbyCode);
    }

}

function generateRandomCode() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}

const crypto = require("crypto");

function generateUUID() {
    return crypto.randomUUID();
}

const getLobby = (lobbyCode) => lobbies.find((l) => l.code === lobbyCode);

const fs = require('fs');
const path = require('path');

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generatePromptsForPlayers(lobbyCode, language = 'es') {
    const lobby = getLobby(lobbyCode);
    if (lobby) {
        const absolutePath = path.resolve(__dirname, './Quiplash_Prompts.json');
        const jsonData = fs.readFileSync(absolutePath, 'utf8');
        const parsedJsonData = JSON.parse(jsonData);
        const promptsData = parsedJsonData[language]["prompts"];

        const lobbySize = lobby.players.length;
        let selectedPrompts = [];
        for (let i = 0; i < lobbySize; i++) {
            let randIndex = randInt(0, 7);
            while (selectedPrompts.includes(randIndex)) {
                randIndex = randInt(0, 7);
            }
            selectedPrompts.push(randIndex);
        }

        selectedPrompts = [...selectedPrompts, ...selectedPrompts];

        lobby.players.forEach(playerRef => {

            const dataArray = {playerId: playerRef.id, prompts: [], answers: []};

            for (let i = 0; i < 2; i++) {
                let randIndex = randInt(0, selectedPrompts.length - 1);
                while (dataArray.prompts.includes(promptsData[selectedPrompts[randIndex]])) {
                    randIndex = randInt(0, 7);
                }
                dataArray.prompts.push(promptsData[selectedPrompts[randIndex]]);
                selectedPrompts.splice(randIndex, 1);
            }
            lobby.data.push(dataArray);

        });
    } else console.error('No se encontro la sala: ' + lobbyCode);
}

function getPromptID(prompt, language = 'es') {
    const absolutePath = path.resolve(__dirname, './Quiplash_Prompts.json');
    const jsonData = fs.readFileSync(absolutePath, 'utf8');
    const parsedJsonData = JSON.parse(jsonData);
    const prompts = parsedJsonData[language]["prompts"];

    return Object.values(prompts).find((value) => value === prompt) ?? -1;
}

function clearLobbyData(lobby) {
    //TODO: Guardar en la base de datos
    lobby.data = [];
}

function devolverJugadoresPorPuntuacion(jugadores) {
    return jugadores.slice().sort((a, b) => b.score - a.score);
}


function getSafetyAnswer(id, language = 'ES') {
    const absolutePath = path.resolve(__dirname, './Quiplash_Prompts.json');
    const jsonData = fs.readFileSync(absolutePath, 'utf8');
    const parsedJsonData = JSON.parse(jsonData);
    id = id.toString();

    // Verificar si el idioma y el id existen en el objeto JSON
    if (parsedJsonData[language] && parsedJsonData[language]["safety_answer"] && parsedJsonData[language]["safety_answer"][id]) {
        const safetyAnswers = parsedJsonData[language]["safety_answer"][id];

        const randomAnswer = Math.floor(Math.random() * 2).toString();

        // Verificar si el objeto safetyAnswers[id.toString()] existe y si randomAnswer está presente
        if (safetyAnswers && safetyAnswers[randomAnswer]) {
            return safetyAnswers[randomAnswer];
        } else {
            return "Respuesta aleatoria no encontrada para el ID dado";
        }
    } else {
        return "ID no encontrado en safetyAnswers";
    }
}


function playerUseSafetyAnswer(lobbyCode, playerID) {
    const lobby = getLobby(lobbyCode);
    if (lobby) {
        const playerData = lobby.data.find((d) => d.playerId === playerID);
        if (playerData) {
            const totalPlayerAnswers = playerData.answers.length;
            const playerPrompt = playerData.prompts[totalPlayerAnswers];
            const promptID = getPromptID(playerPrompt);
            if (promptID === -1) {
                return;
            }
            playerData.answers.push(getSafetyAnswer(promptID));
            console.log(lobby.data)
        } else {
            console.error('No se encontraron datos del jugador con ID:', playerID);
        }
    }
}

function comprobarNumeroDeRespuestas(lobbyCode) {
    const lobby = getLobby(lobbyCode);
    let count = 0;
    lobby.data.forEach((d) => {
        if (d.answers.length === 2) count++;
    });
    if (count === lobby.data.length) {
        io.to(lobbyCode).emit('cambiarEscena', GameScreens.VOTING);
    }
}

function getPromptsUnicos(lobby) {
    const prompts = lobby.data.prompts.slice();
    const promptsUnicos = [];
    prompts.forEach((prompt) => {
        if (!promptsUnicos.includes(prompt)) {
            promptsUnicos.push(prompt);
        }
    });
    return promptsUnicos;
}

function getAnswersDePrompts(lobby, prompt) {
    const answers = lobby.data.answers.slice();
    const answersDePrompts = [];
    answers.forEach((answer) => {
        if (answer === prompt) {
            answersDePrompts.push(answer);
        }
        if (answersDePrompts.length > 2) {
            console.error('EXISTEN MÁS DE 2 RESPUESTAS DE UN MISMO PROMPT: ' + prompt + '\n LOBBY: ' + lobby);
        }
    });
    return answersDePrompts;
}

function associateAnswersToUniquePrompt(lobby) {
    lobby.data.forEach((data) => {
        const promptsUnicos = getPromptsUnicos(lobby);
        const answersDePrompts = [];
        promptsUnicos.forEach((prompt) => {
            answersDePrompts.push(getAnswersDePrompts(lobby, prompt));
        });
        data.answers = answersDePrompts;
    });
    console.log('Datos individualizados: ', lobby.data);
}