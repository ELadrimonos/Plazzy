import React from 'react';
import Juego from './Juego';
import {useState} from "react";
import {CodigoPartida, Contador, IconoJugador} from "../ComponentesComunes";

class Quiplash extends Juego {
  constructor(props) {
    super(props);
  }


  // Métodos para renderizar diferentes estados del juego
  renderLobby() {
    return (
        <>
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
      <button onClick={() => this.setState({estadoJuego: 'respondiendo'})}>Comenzar</button>
            </>);
  }

    renderRespondiendo() {
        const [respuesta, setRespuesta] = useState('');

        function enviarRespuesta(texto){
          // Enviar respuesta al servidor
      }

      return (
          <>
              <Prompt texto={'PRUEBA'}/>
              <input type="text" value={respuesta} onChange={e => setRespuesta(e.target.value)}/>
              <button onClick={enviarRespuesta(respuesta)}>Enviar</button>
              <button onClick={() => this.setState({estadoJuego: 'jugando'})}>Juego</button>

          </>
      );
    }

    renderJugando() {
        return (
            <>
                <header>
                <Contador tiempoInicial={10}/>
                <Prompt texto={'PRUEBA'}/>
                <CodigoPartida gameCode={1234}/>
            </header>
            <div id="promptMessages">
                <RespuestaPrompt texto={'UNO'}/>
                <RespuestaPrompt texto={'DOS'}/>
            </div>
            <button onClick={() => this.setState({estadoJuego: 'inicio'})}>Comenzar</button>
        </>
    );
  }

    render() {
        // Determinar qué método de renderizado llamar según el estado del juego
    switch (this.state.estadoJuego) {
      case 'inicio':
        return this.renderLobby();
      case 'respondiendo':
        return this.renderRespondiendo();
      case 'jugando':
        return this.renderJugando();
      // Puedes agregar más casos para otros estados del juego si es necesario
      default:
        return null;
    }
  }
}

function Prompt({texto}) {
    return (
        <div className="prompt">
            <h1>{texto}</h1>
        </div>
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

function RespuestaPrompt({texto, propietario}){
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

export default Quiplash;