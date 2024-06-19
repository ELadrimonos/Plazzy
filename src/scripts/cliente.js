import io from 'socket.io-client';

export const socket = io('ws://plazzy.es:8080');

socket.on('joinError', (message) => {
    alert(message);
});