import React, { Component } from 'react';

class Juego extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Estado común del juego
      estadoJuego: 'inicio', // estado inicial del juego
    };
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
