const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

// Enum de pantallas de juego
const GameScreens = Object.freeze({
    LOBBY: 'lobby',
    START: 'start',
    ANSWER: 'respondiendo',
    VOTING: 'jugando',
    SCOREBOARD: 'puntuaje',
    FINAL_SCREEN: 'fin',
});

// const mysql = require('mysql');
// const db = mysql.createConnection({
//     host: '192.168.18.33',
//     user: 'root',
//     password: 'root',
//     database: 'jackbox'
// });


const lobbies = [];


http.listen(8080, () => console.log("LISTENING ON 8080"));

io.on('connection', (socket) => {
    // console.log('Usuario conectado:', socket.id);

// Unirse a sala
    socket.on('joinGame', (nombreJug, lobbyCode) => {
        const lobby = lobbies.find((l) => l.code === lobbyCode);

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
        const newLobby = {code: generateRandomCode(), players: [], game: juego, data: []};
        lobbies.push(newLobby);

        // Aqui es donde realmente se conecta al lobby
        socket.join(newLobby.code);

        let player = {id: socket.id, name: nombreHost};
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

    socket.on('startGame', (lobbyCode) => {
        const lobby = lobbies.find((l) => l.code === lobbyCode);
        if (lobby) {
            io.to(lobbyCode).emit('cambiarEscena', GameScreens.START);
            generatePromptsForPlayers(lobbyCode);
            console.log(lobbies);
        }

    });

    socket.on('newRound', (lobbyCode) => {
        const lobby = lobbies.find((l) => l.code === lobbyCode);
        if (lobby) {
            io.to(lobbyCode).emit('cambiarEscena', GameScreens.ANSWER);
            generatePromptsForPlayers(lobbyCode);
            console.log(lobbies.data);

        }
    });

    socket.on('getPlayerPrompts', (gameCode, playerID) => {
        const lobby = lobbies.find((l) => l.code === gameCode);
        if (lobby) {
            const playerPrompts = lobby.data.find((data) => data.playerId === playerID).prompts;
            socket.emit('getPrompts', playerPrompts);
        }
    });

    socket.on('startAnswering', (lobbyCode) => {
        const lobby = lobbies.find((l) => l.code === lobbyCode);
        if (lobby) {
            io.to(lobbyCode).emit('cambiarEscena', GameScreens.ANSWER);
        }
    });

    socket.on('startVoting', (lobbyCode) => {
        const lobby = lobbies.find((l) => l.code === lobbyCode);
        if (lobby) {
            io.to(lobbyCode).emit('cambiarEscena', GameScreens.VOTING);
        }
    });

    socket.on('startResults', (lobbyCode) => {
        const lobby = lobbies.find((l) => l.code === lobbyCode);
        if (lobby) {
            io.to(lobbyCode).emit('cambiarEscena', GameScreens.SCOREBOARD);
        }
    });

    socket.on('startEndGame', (lobbyCode) => {
        const lobby = lobbies.find((l) => l.code === lobbyCode);
        if (lobby) {
            io.to(lobbyCode).emit('cambiarEscena', GameScreens.FINAL_SCREEN);
        }
    });

});

const closeLobby = (lobbyCode) => {
    const lobby = lobbies.find((l) => l.code === lobbyCode);
    if (lobby) {
        io.to(lobby.code).emit('closeLobby');
    }

    const room = io.sockets.adapter.rooms.get(lobbyCode);


     if (room) {
            // Eliminar la sala de la lista de lobbies
            const index = lobbies.findIndex(lobby => lobby.code === lobbyCode);
            if (index !== -1) {
                lobbies.splice(index, 1);
                console.log("Sala cerrada:", lobbyCode);
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


const fs = require('fs');
const path = require('path');

function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function generatePromptsForPlayers(lobbyCode, language = 'es') {
    const lobby = lobbies.find((l) => l.code === lobbyCode);
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

        console.log(lobby.players);

        lobby.players.forEach(playerRef => {

            const dataArray = {playerId: playerRef.id, prompts: [], answers: []};

            for (let i = 0; i < 2; i++) {
                const randIndex = randInt(0, selectedPrompts.length - 1);
                dataArray.prompts.push(promptsData[selectedPrompts[randIndex]]);
                selectedPrompts.splice(randIndex, 1);
            }
            lobby.data.push(dataArray);

        });
    } else console.error('No se encontro la sala: ' +  lobbyCode);
}