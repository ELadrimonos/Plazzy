import {useState} from "react";

export function IconoJugador({nombre}) {
    return (
        <div className="icono">
            <h4 className="nombreJug">{nombre}</h4>
        </div>);
}

export function CodigoPartida({gameCode}){
    return <h2 className="gameCode">{gameCode}</h2>
}

export function Contador({tiempoInicial}){
    const [tiempoActual, setTiempoActual] = useState(tiempoInicial);
    //TODO Función recursiva con Timeout que llame a una función para finalizar los votos
    return (
        <h2>{tiempoActual}</h2>
    );
}

