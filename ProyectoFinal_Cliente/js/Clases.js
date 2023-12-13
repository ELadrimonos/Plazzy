var numJug = 0;


class Jugador {
    constructor(nombre) {
        this.nombre = nombre;
        this.puntuacion = 0;
    }

}

const cambiarFondoNoria = () => {
    document.getElementById("jugadores").style.backgroundColor = colorAleatorio();
}


//TODO Hacer en lado servidor
const obtenerCodigoLobby = () => {
    return "jdsh";
}

const empezarPartida = () => {
    clearInterval(intervaloColorFondo);
}

const colorAleatorio = () => {
    return "rgb(" + (Math.random() * 255) + "," + (Math.random() * 255) + "," + (Math.random() * 255) + ")"
}

const intervaloColorFondo = setInterval(cambiarFondoNoria,1000);
Array.prototype.map.call(document.getElementsByClassName("gameCode"),e => e.innerText = obtenerCodigoLobby() )

const mostrarJugador = (nombre = ("J" + (numJug+1))) => {
    if (numJug < 8) {
        const padre = document.getElementsByClassName("palo")[numJug++];
        const icono = padre.children[0];
        icono.style.opacity = "1";
        icono.children[0].innerText = nombre;
    }

}

// TODO setTimeout dentro de Promise de unos 60 segundos con error a la hora de escribir una respuesta
// Así puedo saber si el jugador no ha escrito nada y si envía algo ignorará el error