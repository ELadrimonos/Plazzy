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

    // Unirse a una sala
    socket.on('join', (nombreJug, lobbyCode) => {

        // db.query('SELECT * FROM Sala WHERE codigo_sala = ?', [lobbyCode], (error, results) => {
        //     if (error) {
        //         console.error(error);
        //         return;
        //     }
        //
        //     const lobby = results[0];
        //
        //     // Realiza acciones necesarias con la información de la sala y los jugadores
        //     io.to(lobbyCode).emit('updatePlayers', lobby.players);
        // });

        const lobby = lobbies.find((l) => l.code === lobbyCode);

        if (lobby && lobby.players.length < 8) {
            socket.join(lobbyCode);
            socket.emit('join', lobbyCode);
            lobby.players.push({ id: socket.id, name: nombreJug});
            io.to(lobbyCode).emit('updatePlayers', lobby.players);
        } else {
            socket.emit('joinError', 'No se puede unir a la sala');
        }
    });

    // Crear una nueva sala
    socket.on('create', (nombreHost, juego) => {

        // Creamos un nuevo lobby y lo agregamos a la lista de lobbies del servidor
        const newLobby = { code: generateRandomCode(), players: [], game: juego };
        lobbies.push(newLobby);

        // El socket (cliente) se conecta
        socket.join(newLobby.code);

        // Metemos un nuevo jugador al lobby con el id del socket y el nombre del creador de la partida
        newLobby.players.push({ id: socket.id, name: nombreHost});

        // Emitimos el evento de lobby creado a los jugadores (solo 1 en teoria)
        socket.emit('lobbyCreated');
        socket.emit('join', newLobby.code);
        io.to(newLobby.code).emit('updatePlayers', newLobby.players);
    });

    // Manejar la desconexión
    socket.on('disconnect', () => {
        const lobby = lobbies.find((l) => l.players.some((p) => p.id === socket.id));

        if (lobby) {

            if (lobby.players[0].id === socket.id){
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
