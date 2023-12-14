const http = require('http').createServer();

const io = require('socket.io')(http, {
    cors: {
        origin: "*"
    }
});

const mysql = require('mysql');
const db = mysql.createConnection({
    host: '192.168.18.33',
    user: 'root',
    password: 'root',
    database: 'jackbox'
});

io.on('connection', (socket) => {
    console.log("CONEXION")
});

const lobbies = [];


http.listen(8080, () => console.log("LISTENING ON 8080"));

io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Unirse a una sala
    socket.on('join', (nombreJug, lobbyCode) => {

        db.query('SELECT * FROM Sala WHERE codigo_sala = ?', [lobbyCode], (error, results) => {
            if (error) {
                console.error(error);
                return;
            }

            const lobby = results[0];

            // Realiza acciones necesarias con la información de la sala y los jugadores
            io.to(lobbyCode).emit('updatePlayers', lobby.players);
        });

        // const lobby = lobbies.find((l) => l.code === lobbyCode);
        // console.log(lobbyCode)
        // console.log(lobbies)
        // console.log("LOBBY?: " + lobby)
        // if (lobby && lobby.players.length < 8) {
        //     socket.join(lobbyCode);
        //     lobby.players.push({ id: socket.id, name: nombreJug });
        //
        //     io.to(lobbyCode).emit('updatePlayers', lobby.players);
        // } else {
        //     socket.emit('joinError', 'No se puede unir a la sala');
        // }
    });

    // Crear una nueva sala
    socket.on('create', (nombreHost, juego) => {
        const newLobby = { code: generateRandomCode(), players: [], game: juego };
        lobbies.push(newLobby);
        console.log("Código Lobby: " + newLobby.code)
        socket.join(newLobby.code);
        newLobby.players.push({ id: socket.id, name: nombreHost});
        socket.emit('lobbyCreated', newLobby.code);
        io.to(newLobby.code).emit('updatePlayers', newLobby.players);
    });

    // Manejar la desconexión
    socket.on('disconnect', () => {
        const lobby = lobbies.find((l) => l.players.some((p) => p.id === socket.id));

        if (lobby) {
            lobby.players = lobby.players.filter((p) => p.id !== socket.id);
            io.to(lobby.code).emit('updatePlayers', lobby.players);
        }

        console.log('Usuario desconectado:', socket.id);
    });
});

function generateRandomCode() {
    // Implementa la lógica para generar códigos únicos
    // Puedes usar algoritmos más avanzados dependiendo de tus necesidades
    return Math.random().toString(36).substring(2, 6).toUpperCase();
}
