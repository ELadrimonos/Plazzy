import io from 'socket.io-client';

export const socket = io('ws://localhost:8181');


socket.on('joinError', (message) => {
    alert(message);
});