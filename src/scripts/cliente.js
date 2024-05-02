import io from 'socket.io-client';

export const socket = io('ws://localhost:8080');


socket.on('lobbyCreated', ()  => {
    //TODO insertar info del lobby en BBDD
});

socket.on('join', (lobbyCode) => {
    //TODO insertar info jugadores en BBDD

    const codes = document.getElementsByClassName('gameCode')

    for (const code of codes) {
        code.innerText = `${lobbyCode}`;
    }

});

socket.on('updatePlayers', (players) => {
    console.log(players.length)
    // for (const [index, player] of players.entries()) {
    //     console.log(index)
    //     const padre = document.getElementsByClassName("palo")[index];
    //     const icono = padre.children[0];
    //     icono.style.opacity = "1";
    //     icono.children[0].innerText = player.name;
    //     icono.style.animationPlayState = "running";
    // }
});

socket.on('disconnectPlayer', (playerId, players) => {
    //TODO borrar info del jugador desconectado

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
});

//TODO Obtener datos del formulario y meterlos

// // if crear lobby
// if (obtenerParametroUrl('juego') !== false){
//     socket.emit('create', obtenerParametroUrl('username'), obtenerParametroUrl('juego'))
// } else {
//     socket.emit('join', obtenerParametroUrl('username'), obtenerParametroUrl('code'));
// }
//
//
