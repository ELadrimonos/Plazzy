var numJug = 0;
const cuentaAtrasPrompt = document.getElementById("tiempoPrompt")

const cambiarFondoNoria = () => {
    document.getElementById("jugadores").style.backgroundColor = colorAleatorio();
}


// Desde cliente.js ya se obtiene
// const obtenerCodigoLobby = () => {
//     return "2kfs";
// }

const empezarPartida = () => {
    clearInterval(intervaloColorFondo);
}

const colorAleatorio = () => {
    return "rgb(" + (Math.random() * 255) + "," + (Math.random() * 255) + "," + (Math.random() * 255) + ")"
}

const intervaloColorFondo = setInterval(cambiarFondoNoria,1000);
// Array.prototype.map.call(document.getElementsByClassName("gameCode"),e => e.innerText = obtenerCodigoLobby() )

const mostrarJugador = (nombre = ("J" + (numJug+1))) => {
    if (numJug < 8) {
        const padre = document.getElementsByClassName("palo")[numJug++];
        const icono = padre.children[0];
        icono.style.opacity = "1";
        icono.children[0].innerText = nombre;
        icono.style.animationPlayState = "running";
    }

}


// TODO setTimeout dentro de Promise de unos 60 segundos con error a la hora de escribir una respuesta
// Así puedo saber si el jugador no ha escrito nada y si envía algo ignorará el error


//TODO Transformar en promesa
//TODO Saber cual cuenta atrás es, tal vez pasando el elemento como parametro
const cuentaAtras = (segundos) => {
    if (segundos >= 0) {
        cuentaAtrasPrompt.innerText = segundos;
        setTimeout(() => cuentaAtras(segundos - 1), 1000);
    } else {
        return true;
    }
}

// cuentaAtras(50);


function obtenerCaracteresRestantes(elemento) {
    console.log("MAX: " + elemento.maxLength)
    console.log("VALOR: " + elemento.value.length)
    console.log("RESTA: " + (elemento.maxLength - elemento.value.length))
    return elemento.maxLength - elemento.value.length;
}


//TODO Convertir en SPA (Single-page) usando react y modificar esta función
function obtenerParametroUrl(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return false;
}

