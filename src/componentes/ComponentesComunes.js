import {useState} from "react";

function IconoJugador({nombre}) {
    return (
        <div className="icono">
            <h4 className="nombreJug">{nombre}</h4>
        </div>);
}

function CodigoPartida({gameCode}){
    return <h2>{gameCode}</h2>
}

function Contador({tiempoInicial}){
    const [tiempoActual, setTiempoActual] = useState(tiempoInicial);
    //TODO Función recursiva con Timeout que llame a una función para finalizar los votos
    return (
        <h2>{tiempoActual}</h2>
    );
}

export default IconoJugador;