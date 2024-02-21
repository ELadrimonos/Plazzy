import {IconoJugador, Contador, CodigoPartida} from "./ComponentesComunes";
import '../css/Quiplash.css';
import {useState} from "react";


function Prompt({texto}) {
    return (
        <div className="promt">
            <h1>{texto}</h1>
        </div>
    );
}

function Respuesta({texto, propietario}){
    const [visibilidadUsuario, setVisibilidadUsuario] = useState('hidden');

    const estilosPropietario = {
        visibility: {visibilidadUsuario},
    }

    return (
        <div className="promptResponse">
            <p>{texto}</p>
            <h5 style={estilosPropietario}>{propietario}</h5>
        </div>
    );
}

function TablaPuntuaciones() {
    //TODO Rellenar con iconos para cada jugador
}

export function Partida() {
    return (
        <>
            <header>
                <Contador tiempoInicial={10}/>
                <Prompt texto={'PRUEBA'}/>
                <CodigoPartida gameCode={1234}/>
            </header>
            <div id="promptMessages">
                <Prompt texto={'UNO'}/>
                <Prompt texto={'DOS'}/>
            </div>
        </>
    );
}

function Noria() {
    return (
        <>
            <div className="palo">
                <IconoJugador/>
            </div>
            <div className="palo">
                <IconoJugador/>
            </div>
            <div className="palo">
                <IconoJugador/>
            </div>
            <div className="palo">
                <IconoJugador/>
            </div>
            <div className="palo">
                <IconoJugador/>
            </div>
            <div className="palo">
                <IconoJugador/>
            </div>
            <div className="palo">
                <IconoJugador/>
            </div>
            <div className="palo">
                <IconoJugador/>
            </div>
        </>
    );
}

export function LobbyQuiplash() {
    return (
        <section id="lobby">
            <article>
                <h1>Quiplash</h1>
                <h2>Código de sala</h2>
                <h3 className="gameCode"></h3>
            </article>
            <article id="jugadores">
                <Noria></Noria>
            </article>
        </section>
    );
}

