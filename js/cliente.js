// client.js
const socket = io();

function joinLobby(codigoLobby) {
    socket.emit('join', codigoLobby);
}

function createLobby() {
    socket.emit('create');
}

socket.on('lobbyCreated', (lobbyCode) => {
    document.getElementById('lobby-code').innerText = `Código de sala: ${lobbyCode}`;
});

socket.on('updatePlayers', (players) => {
    players.forEach((player) => {
        const padre = document.getElementsByClassName("palo")[player.index];
        const icono = padre.children[0];
        icono.style.opacity = "1";
        icono.children[0].innerText = player.name;
        icono.style.animationPlayState = "running";
    });
});

socket.on('joinError', (message) => {
    alert(message);
});
