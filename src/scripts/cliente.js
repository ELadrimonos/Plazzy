import io from 'socket.io-client';

export const socket = io("http://plazzy.es:8080", {
        cors: {
        origin: "http://plazzy.es:8080",
        credentials: true
      },transports : ['websocket'] });


socket.on('joinError', (message) => {
    alert(message);
});