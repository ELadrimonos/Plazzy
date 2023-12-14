const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Servidor Quiplash');
});

const lobbies = [];

io.on('connection', (socket) => {
    console.log('Usuario conectado:', socket.id);

    // Unirse a una sala
    socket.on('join', (lobbyCode) => {
        const lobby = lobbies.find((l) => l.code === lobbyCode);

        if (lobby && lobby.players.length < 8) {
            socket.join(lobbyCode);
            lobby.players.push({ id: socket.id, name: `Jugador ${lobby.players.length + 1}` });

            io.to(lobbyCode).emit('updatePlayers', lobby.players);
        } else {
            socket.emit('joinError', 'No se puede unir a la sala');
        }
    });

    // Crear una nueva sala
    socket.on('create', () => {
        const newLobby = { code: generateRandomCode(), players: [] };
        lobbies.push(newLobby);

        socket.join(newLobby.code);
        newLobby.players.push({ id: socket.id, name: `Jugador ${newLobby.players.length + 1}` });

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
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

server.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
