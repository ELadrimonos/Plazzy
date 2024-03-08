import React, { Component } from 'react';
class Juego extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Estado común del juego
      estadoJuego: 'inicio', // estado inicial del juego
      rondaActual: 1, // ronda inicial del juego
      jugadoresConectados:  [
            { nombre: 'Juan', rutaImagen: 'ruta/a/imagen1.png' },
            { nombre: 'Pepe', rutaImagen: 'ruta/a/imagen2.png' }
          ]
    };
    this.GameCode = 1234;
    this.isUserHost = props["userHost"];
    this.maxJugadores = 8;
  }

  componentDidMount() {
    // Llamar a la función aquí de que el componente se haya montado
    this.generarQRLobby();
  }

    componentDidUpdate(prevProps, prevState, snapshot) {
    if (this.state.estadoJuego === 'inicio' && prevState.estadoJuego !== 'inicio') {
      this.generarQRLobby();
    }
  }

  generarQRLobby() {
    const imgQRCode = document.getElementById("QRcode");
    let url = window.location.href + "/game/" + this.GameCode;
    console.log(url)
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
