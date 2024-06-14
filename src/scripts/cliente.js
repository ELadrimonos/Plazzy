import io from 'socket.io-client';

export const socket = io('wss://plazzy.es:8080', {
    transports: ['websocket']
});


socket.on('joinError', (message) => {
    alert(message);
});