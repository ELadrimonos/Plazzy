import io from 'socket.io-client';

export const socket = io('ws://localhost:8080');


socket.on('disconnectPlayer', (playerId, players) => {
    //TODO borrar info del jugador desconectado

    // TODO Llamar al objeto Juego para quitar al jugador del array


    // Asegurémonos de que updatePlayers se ejecute después de ocultar el icono
    setTimeout(() => {
        socket.emit('updatePlayers', players);
    }, 100); // Ajusta el tiempo según sea necesario
});

socket.on('joinError', (message) => {
    alert(message);
});