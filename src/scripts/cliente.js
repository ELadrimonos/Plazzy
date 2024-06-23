import io from 'socket.io-client';

export const socket = io(`ws://plazzy.es`,
    {
        transports: ['websocket'], // Ensure only WebSocket transport is used
        reconnectionAttempts: 5, // Number of reconnection attempts
        reconnectionDelay: 1000, // Time delay between reconnection attempts
    });

socket.on('joinError', (message) => {
    alert(message);
});

socket.on('connect_error', (err) => {
    console.error('Connection Error:', err);
});

socket.on('reconnect_attempt', () => {
    console.info('Reconnecting...');
});

socket.on('connect', () => {
    console.info('Connected to WebSocket server');
});

socket.on("disconnect", (reason, details) => {
    // the reason of the disconnection, for example "transport error"
    console.log(reason);

    // the low-level reason of the disconnection, for example "xhr post error"
    console.log(details.message);

    // some additional description, for example the status code of the HTTP response
    console.log(details.description);

    // some additional context, for example the XMLHttpRequest object
    console.log(details.context);
});