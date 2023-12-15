const socket = io('ws://localhost:8080');

socket.on('lobbyCreated', ()  => {

});

socket.on('join', (lobbyCode) => {

    const codes = document.getElementsByClassName('gameCode')

    for (const code of codes) {
        code.innerText = `${lobbyCode}`;
    }
});

socket.on('updatePlayers', (players) => {
    console.log(players.length)
    for (const [index, player] of players.entries()) {
        console.log(index)
        const padre = document.getElementsByClassName("palo")[index];
        const icono = padre.children[0];
        icono.style.opacity = "1";
        icono.children[0].innerText = player.name;
        icono.style.animationPlayState = "running";
    }
});

socket.on('disconnectPlayer', (playerId, players) => {
    const padre = document.getElementsByClassName("palo")[playerId];
    const icono = padre.children[0];

    // Ocultar el icono con una breve demora
    icono.style.opacity = "0";

    // Asegurémonos de que updatePlayers se ejecute después de ocultar el icono
    setTimeout(() => {
        socket.emit('updatePlayers', players);
    }, 100); // Ajusta el tiempo según sea necesario
});

socket.on('joinError', (message) => {
    alert(message);
    // window.location.href = index.html;
});

//TODO Obtener datos del formulario y meterlos

// if crear lobby
if (0){
    socket.emit('create', 'Adrian', 'quiplash')
} else {
    socket.emit('join', 'Calvo', '0DCR');
}


