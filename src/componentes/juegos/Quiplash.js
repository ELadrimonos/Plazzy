import React, { useEffect, useState } from 'react';
import Juego from './Juego';
import { CodigoPartida, Contador, IconoJugador } from "../ComponentesComunes";
import '../../css/Quiplash.css';
import { useSpring, animated } from '@react-spring/web'
import {generarQRLobby} from "../../scripts/generarQRLobby"

class Quiplash extends Juego {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state, // Así obtengo los estados de la clase padre
      senalMostrarRespuestas: false,
      senalMostrarPropietarios: false,
    };
  }

  // Método para emitir señal para mostrar respuestas
  emitirSenalMostrarRespuestas = () => {
    this.setState({ senalMostrarRespuestas: true });
  }

  // Método para emitir señal para mostrar propietarios
  emitirSenalMostrarPropietarios = () => {
    this.setState({ senalMostrarPropietarios: true });
  }

  componentDidMount() {
    // Llamar a la función después de que el componente se haya montado
    generarQRLobby();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.estadoJuego === 'inicio' && prevState.estadoJuego !== 'inicio') {
      generarQRLobby();
    }
  }

    // Métodos para renderizar diferentes estados del juego
  renderLobby() {
    return (
        <>
            <section id="lobby">
                <article>
                    <h1>Quiplash</h1>
                    <h2>Código de sala</h2>
                    <CodigoPartida gameCode={1234}/>
                </article>
                <article id="jugadores">
                    <Noria></Noria>
                </article>
                <img id="QRcode" src="" alt="codigoQR"/>
            </section>

            <button onClick={() => this.setState({estadoJuego: 'respondiendo'})}>Comenzar</button>
        </>);
  }

    renderRespondiendo() {
        this.state.respuesta = ''

    function enviarRespuesta() {
      // Enviar respuesta al servidor
    }

    return (
      <section id="typing">
        <Prompt texto={'PRUEBA'} />
        <input type="text" value={this.state.respuesta.value} onChange={e => this.setState({ respuesta: e.target.value })} />
        <button onClick={enviarRespuesta()}>Enviar</button>
        <button onClick={() => this.setState({ estadoJuego: 'jugando' })}>Juego</button>

      </section>
    );
  }

  renderJugando() {
    return (
      <section id="round">
        <header id="promptHeader">
          <Contador tiempoInicial={10} />
          <Prompt texto={'PRUEBA'} />
          <div>
            <h3>Jackbox.tv</h3>
            <CodigoPartida gameCode={1234} />
          </div>
        </header>
        <div id="promptMessages">
          <RespuestaPrompt desdeIzquierda={true} texto={'UNO'} senalMostrarRespuestas={this.state.senalMostrarRespuestas} senalMostrarPropietarios={this.state.senalMostrarPropietarios} />
          <RespuestaPrompt desdeIzquierda={false} texto={'DOS'} senalMostrarRespuestas={this.state.senalMostrarRespuestas} senalMostrarPropietarios={this.state.senalMostrarPropietarios} />
        </div>
        <button onClick={() => this.setState({ estadoJuego: 'inicio' })}>Comenzar</button>
      </section>
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

function Prompt({ texto }) {
  return (
    <h1 className="prompt">{texto}</h1>
  );
}

function Noria() {
  return (
    <>
      <div className="palo">
        <IconoJugador nombre='Juan' />
      </div>
      <div className="palo">
        <IconoJugador />
      </div>
      <div className="palo">
        <IconoJugador />
      </div>
      <div className="palo">
        <IconoJugador />
      </div>
      <div className="palo">
        <IconoJugador nombre='Pepe' />
      </div>
      <div className="palo">
        <IconoJugador />
      </div>
      <div className="palo">
        <IconoJugador />
      </div>
      <div className="palo">
        <IconoJugador />
      </div>
    </>
  );
}

function RespuestaPrompt({ texto, propietario, desdeIzquierda, senalMostrarRespuestas, senalMostrarPropietarios }) {
  const [springs, api] = useSpring(() => ({
    from: { x: desdeIzquierda ? -100 : 100 },
  }));

  const [visibilidadUsuario, setVisibilidadUsuario] = useState('hidden');

  const estiloPropietario = {
    visibility: visibilidadUsuario,
  }

  useEffect(() => {
    if (senalMostrarRespuestas) {
      api.start({
        from: { x: desdeIzquierda ? -100 : 100 },
        to: { x: 0 },
      });
    }
  }, [senalMostrarRespuestas]);

  useEffect(() => {
    if (senalMostrarPropietarios) {
      // Aquí puedes manejar la animación para mostrar propietarios, si es necesario
      console.log("Mostrar propietarios");
    }
  }, [senalMostrarPropietarios]);

  return (
    <animated.div
      style={{
        ...springs,
      }}
      className="promptResponse"
    >
      <p>{texto}</p>
      <h5 style={estiloPropietario}>{propietario}</h5> {/* Ocultar propietario por ahora */}
    </animated.div>
  );
}

export default Quiplash;
