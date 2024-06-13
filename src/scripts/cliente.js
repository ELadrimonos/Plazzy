import io from 'socket.io-client';

export const socket = io('wss://plazzy.es:80');


socket.on('joinError', (message) => {
    alert(message);
});