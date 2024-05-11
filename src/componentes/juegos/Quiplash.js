import React, {useEffect, useState} from 'react';
import Juego from './Juego';
import {CodigoPartida, Contador, IconoJugador, IconoLobby, InputRespuestaLimitado} from "../ComponentesComunes";
import styles from '../../css/Quiplash.module.css';
import {useSpring, animated} from '@react-spring/web'
import {socket} from "../../scripts/cliente";


class Quiplash extends Juego {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state, // Así obtengo los estados de la clase padre
            senalMostrarRespuestas: false,
            senalMostrarPropietarios: false,
            colorNoria: this.colorAleatorio(),
        };
    }

    // Método para emitir señal para mostrar respuestas
    emitirSenalMostrarRespuestas = () => {
        this.setState({senalMostrarRespuestas: true});
    }

    // Método para emitir señal para mostrar propietarios
    emitirSenalMostrarPropietarios = () => {
        this.setState({senalMostrarPropietarios: true});
    }


    componentDidMount() {
        super.componentDidMount();
        this.interval = setInterval(
            () => this.setState({colorNoria: this.colorAleatorio()}),
            1000
        );
    }

    colorAleatorio = () => {
        return "rgb(" + (Math.random() * 255) + "," + (Math.random() * 255) + "," + (Math.random() * 255) + ")"
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    // Métodos para renderizar diferentes estados del juego
    renderLobby() {

        return (
            <>
                <section className={styles.lobby}>
                    <header>
                        <h1>Quiplash</h1>
                        <h2>Código de sala</h2>
                        <CodigoPartida gameCode={this.GameCode}/>
                        {/* Hacer un botón para iniciar partida por el Host que arrancará el juego a todos los clientes*/}
                        {this.isPlayerHost() && (
                            <button className={styles.startButton}
                                    onClick={() => this.startGame()}
                                    disabled={this.state.jugadoresConectados.length < 3}
                            >
                                Comenzar
                            </button>
                        )}
                    </header>
                    <div style={{position: "relative"}}>
                        <article className={styles.jugadores} style={{backgroundColor: this.state.colorNoria}}>
<Noria key={this.state.jugadoresConectados.map(jugador => jugador.id).join('_')} jugadores={this.state.jugadoresConectados} />

                        </article>
                        <img className={styles.QRcode} id="QRcode" src="" alt="codigoQR"/>

                    </div>

                </section>

            </>);
    }

    renderRespondiendo() {
        this.state.respuesta = '';

        function enviarRespuesta() {
            // Enviar respuesta al servidor
        }

        return (
            <>
                <section className={styles.answerScreen}>
                    <Contador tiempoInicial={90}/>
                    <Prompt texto={'PRUEBA'}/>
                    <InputRespuestaLimitado socket={socket} playerID={this.playerReference} gameCode={this.GameCode}
                                            styles={styles}/>
                    <button onClick={() => this.setState({estadoJuego: 'jugando'})}>Juego</button>
                    <section className={styles.jugadores}>
                        <div className={styles.sombraJugadores}></div>
                    </section>
                </section>
            </>
        );
    }

    renderJugando() {
        return (
            <section className={styles.round}>
            <header className={styles.promptHeader}>
                    <Contador tiempoInicial={10}/>
                    <Prompt texto={'PRUEBA'}/>
                    <IconoLobby gameCode={this.GameCode}/>
                </header>
                <div className={styles.promptMessages}>
                    <RespuestaPrompt desdeIzquierda={true} texto={'UNO'}
                                     senalMostrarRespuestas={this.state.senalMostrarRespuestas}
                                     senalMostrarPropietarios={this.state.senalMostrarPropietarios}/>
                    <RespuestaPrompt desdeIzquierda={false} texto={'DOS'}
                                     senalMostrarRespuestas={this.state.senalMostrarRespuestas}
                                     senalMostrarPropietarios={this.state.senalMostrarPropietarios}/>
                </div>
                <button onClick={() => this.setState({estadoJuego: 'inicio'})}>Comenzar</button>
            </section>
        );
    }

    // render() {
    //     // Determinar qué método de renderizado llamar según el estado del juego
    //     switch (this.state.estadoJuego) {
    //         case 'inicio':
    //             return this.renderLobby();
    //         case 'start':
    //             return 'EMPEZADO';
    //         case 'respondiendo':
    //             return this.renderRespondiendo();
    //         case 'jugando':
    //             return this.renderJugando();
    //         // Puedes agregar más casos para otros estados del juego si es necesario
    //         default:
    //             return null;
    //     }
    // }
}

function Prompt({texto}) {
    return (
        <h1 className={styles.prompt}>{texto}</h1>
    );
}

const Noria = React.memo(function Noria({ jugadores }) {
      const [connectedPlayers, setConnectedPlayers] = useState(jugadores);

    useEffect(() => {
        setConnectedPlayers(jugadores);
    }, [jugadores]);


    const iconosJugadores = connectedPlayers.map((jugador) => (
        <div className={styles.palo} key={jugador.id}>
            <IconoJugador nombreClase={styles.icono} nombre={jugador.name} rutaImagen={jugador.rutaImagen} />
        </div>
    ));
    console.log()

    // Rellenar los espacios restantes con IconoJugador vacíos
    for (let i = connectedPlayers.length; i < 8; i++) {
        iconosJugadores.push(
            <div className={styles.palo} key={i} style={{ visibility: 'hidden' }}>
                <IconoJugador />
            </div>
        );
    }

    return <>{iconosJugadores}</>;
});
function RespuestaPrompt({texto, propietario, desdeIzquierda, senalMostrarRespuestas, senalMostrarPropietarios}) {
    const [springs, api] = useSpring(() => ({
        from: {x: desdeIzquierda ? -100 : 100},
    }));

    const [visibilidadUsuario, setVisibilidadUsuario] = useState('hidden');

    const estiloPropietario = {
        visibility: visibilidadUsuario,
    }

    useEffect(() => {
        if (senalMostrarRespuestas) {
            api.start({
                from: {x: desdeIzquierda ? -100 : 100},
                to: {x: 0},
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
            className={styles.promptResponse}
        >
            <p>{texto}</p>
            <h5 style={estiloPropietario}>{propietario}</h5> {/* Ocultar propietario por ahora */}
        </animated.div>
    );
}

export default Quiplash;
