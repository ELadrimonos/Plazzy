import React, {Component} from 'react';
import {socket} from "../../scripts/cliente";

class Juego extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Estado común del juego
      estadoJuego: 'lobby', // estado inicial del juego
      rondaActual: 1, // ronda inicial del juego
      jugadoresConectados:  props.connectedPlayers,
      prompts: [],
      ganador: undefined,

    };
    this.GameCode = props.gameCode;
    this.playerReference = props.player;
    this.maxJugadores = 8;
    this.maxRounds = 3;
    socket.on('cambiarEscena', (pantalla) => {
        this.setState({ estadoJuego: pantalla });
    });

    socket.on('getPrompts', (prompts) => {
      this.setState({prompts: prompts});
    });

  }

  componentDidMount() {
    // Llamar a la función aquí de que el componente se haya montado
    if (this.state.estadoJuego === 'lobby') {
      this.generarQRLobby();
    }
  }


  isPlayerHost(){
    return this.playerReference.id === this.state.jugadoresConectados[0].id;
  }

  startGame() {
    socket.emit('startGame', this.GameCode);
  }

  startNewRound() {
    socket.emit('newRound', this.GameCode, this.maxRounds);
  }

  startAnswering() {
    socket.emit('startAnswering', this.GameCode);
  }

  startVoting() {
    socket.emit('startVoting', this.GameCode);
  }

  startResults() {
    socket.emit('startResults', this.GameCode);
  }

  startEndGame() {
    socket.emit('startEndGame', this.GameCode);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.connectedPlayers !== this.props.connectedPlayers) {
      // Actualizar jugadoresConectados en el estado
      this.setState({ jugadoresConectados: this.props.connectedPlayers });
    }
    if (this.state.estadoJuego === 'lobby' && prevState.estadoJuego !== 'lobby') {
      this.generarQRLobby();
    }
    if (this.state.estadoJuego === 'respondiendo' && prevState.estadoJuego !== 'respondiendo') {
      socket.emit('getPlayerPrompts', this.GameCode, this.playerReference.id);
    }
  }

  generarQRLobby() {
    const imgQRCode = document.getElementById("QRcode");
    let url = window.location.href + "/game/" + this.GameCode;
    console.log('URL IMAGEN: ' + url)
    imgQRCode.src = "https://api.qrserver.com/v1/create-qr-code/?data=" + url + "";
  }

  // Métodos para renderizar diferentes estados del juego
  renderLobby() {
    return (
      <div>
        <h1>Placeholder inicio</h1>
        <button onClick={() => this.startGame()}>Comenzar</button>
      </div>
    );
  }

  renderIntro() {
    return (
        <div>
          <h1>Placeholder introducción</h1>
          <button onClick={() => this.startAnswering()}>Comenzar</button>
        </div>
    );
  }

  renderRespondiendo() {
    return (
        <div>
          <h1>Placeholder respondiendo propio prompt</h1>
      </div>
    );
  }


  renderJugando() {
    return (
      <div>
        <h1>Placeholder jugando ronda</h1>
      </div>
    );
  }

  renderPuntuacion () {
    return (
      <div>
        <h1>Placeholder puntuación</h1>
      </div>
    );
  }

  renderFin () {
    return (
      <div>
        <h1>Placeholder fin</h1>
      </div>
    );
  }

  render() {

    switch (this.state.estadoJuego) {
      case 'lobby':
        return this.renderLobby();
      case 'start':
        return this.renderIntro();
      case 'respondiendo':
        return this.renderRespondiendo();
      case 'jugando':
        return this.renderJugando();
      case 'fin':
        return this.renderFin();
      case 'puntuaje':
        return this.renderPuntuacion();
      default:
        return null;
    }
  }
}

export default Juego;
