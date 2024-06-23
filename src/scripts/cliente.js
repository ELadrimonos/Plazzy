import io from 'socket.io-client';

export const socket = io(`ws://plazzy.es:${process.env.PORT}`);

socket.on('joinError', (message) => {
    alert(message);
});