import React, {Component} from 'react';
import {socket} from "../../scripts/cliente";

class Juego extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Estado común del juego
      estadoJuego: 'inicio', // estado inicial del juego
      rondaActual: 1, // ronda inicial del juego
      jugadoresConectados:  props.connectedPlayers,
    };
    this.GameCode = props.gameCode;
    this.playerReference = props.player;
    this.maxJugadores = 8;

  }



  componentDidMount() {
    // Llamar a la función aquí de que el componente se haya montado
    if (this.state.estadoJuego === 'inicio') {
      this.generarQRLobby();
    }
  }


  isPlayerHost(){
    return this.playerReference.id === this.state.jugadoresConectados[0].id;
  }

  startGame() {
    socket.emit('startGame', this.GameCode);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.connectedPlayers !== this.props.connectedPlayers) {
      // Actualizar jugadoresConectados en el estado
      this.setState({ jugadoresConectados: this.props.connectedPlayers });
    }
    if (this.state.estadoJuego === 'inicio' && prevState.estadoJuego !== 'inicio') {
      this.generarQRLobby();
    }
  }

  generarQRLobby() {
    const imgQRCode = document.getElementById("QRcode");
    let url = window.location.href + "/game/" + this.GameCode;
    console.log('URL IMAGEN: ' + url)
    imgQRCode.src = "https://api.qrserver.com/v1/create-qr-code/?data=" + url + "";
  }

  // Métodos para renderizar diferentes estados del juego
  renderInicio() {
    return (
      <div>
        <h1>Placeholder inicio</h1>
        <button onClick={() => this.setState({ estadoJuego: 'jugando' })}>Comenzar</button>
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

  render() {
    socket.on('cambiarEscena', (pantalla) => {
        this.setState(pantalla);
    });
    switch (this.state.estadoJuego) {
      case 'inicio':
        return this.renderInicio();
      case 'respondiendo':
        return this.renderRespondiendo();
      case 'jugando':
        return this.renderJugando();
      default:
        return null;
    }
  }
}

export default Juego;
