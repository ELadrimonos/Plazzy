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
        {/* Componentes para el estado inicial del juego */}
        <h1>¡Bienvenido al juego!</h1>
        <button onClick={() => this.setState({ estadoJuego: 'jugando' })}>Comenzar</button>
      </div>
    );
  }

  renderJugando() {
    return (
      <div>
        {/* Componentes para cuando el juego está en curso */}
        <h1>Jugando...</h1>
        {/* Otros componentes específicos del estado 'jugando' pueden ir aquí */}
      </div>
    );
  }

  render() {
    // Determinar qué método de renderizado llamar según el estado del juego
    switch (this.state.estadoJuego) {
      case 'inicio':
        return this.renderInicio();
      case 'jugando':
        return this.renderJugando();
      // Puedes agregar más casos para otros estados del juego si es necesario
      default:
        return null;
    }
  }
}

export default Juego;
