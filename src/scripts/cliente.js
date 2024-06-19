import io from 'socket.io-client';

export const socket = io('ws://plazzy.es:3000');

socket.on('joinError', (message) => {
    alert(message);
});