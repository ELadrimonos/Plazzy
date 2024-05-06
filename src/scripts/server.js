const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
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
            socket.emit('joinGame', lobby);
            socket.emit('shareGameMode', lobby.game)
            lobby.players.push({id: socket.id, name: nombreJug});
            console.log(lobby);

            io.to(lobbyCode).emit('updatePlayers', lobby.players);
        } else {
            socket.emit('joinError', 'No se puede unir a la sala');
        }
    });

// Crear sala
    socket.on('create', (nombreHost, juego) => {
        const newLobby = {code: generateRandomCode(), players: [], game: juego};
        lobbies.push(newLobby);
        newLobby.players.push({id: socket.id, name: nombreHost});
        console.log(newLobby);
        socket.emit('lobbyCreated', newLobby);
        socket.emit('joinGame', newLobby);
        io.to(newLobby.code).emit('updatePlayers', newLobby.players);
    });
    // Manejar la desconexión
    socket.on('disconnect', () => {
        const lobby = lobbies.find((l) => l.players.some((p) => p.id === socket.id));

        if (lobby) {

            if (lobby.players[0].id === socket.id) {
                io.to(lobby.code).emit('joinError', 'El host se ha desconectado de la sala');
            }

            let disconnectedPlayer = lobby.players.find(p => p.id === socket.id);
            let disconPlayerId = lobby.players.indexOf(disconnectedPlayer)

            lobby.players = lobby.players.filter((p) => p.id !== socket.id);

            io.to(lobby.code).emit('disconnectPlayer', disconPlayerId, lobby.players);
        }


        // console.log('Usuario desconectado:', socket.id);
    });
});

function generateRandomCode() {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}
