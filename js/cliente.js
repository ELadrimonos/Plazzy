const socket = io('ws://localhost:8080');

socket.on('lobbyCreated', (lobbyCode) => {

    window.location.href = `quiplash.html?code=${lobbyCode}`;
    // document.getElementById('lobby-code').innerText = `Código de sala: ${lobbyCode}`;
});

socket.on('updatePlayers', (players) => {
    const lobby = lobbies.find((l) => l.game === "Quiplash");
    if (lobby){
        players.forEach((player) => {
            // const padre = document.getElementsByClassName("palo")[player.index];
            // const icono = padre.children[0];
            // icono.style.opacity = "1";
            // icono.children[0].innerText = player.name;
            // icono.style.animationPlayState = "running";
        });
    }

});

socket.on('joinError', (message) => {
    alert(message);
});
