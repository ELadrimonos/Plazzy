import React, {useEffect, useState} from 'react';
import Juego from './Juego';
import {CodigoPartida, Contador, IconoJugador, IconoLobby, InputRespuestaLimitado} from "../ComponentesComunes";
import styles from '../../css/Quiplash.module.css';
import {useSpring, animated} from '@react-spring/web'
import {socket} from "../../scripts/cliente";
import logo0 from '../../assets/img/player_icons/Quiplash/0.webp';
import logo1 from '../../assets/img/player_icons/Quiplash/1.webp';
import logo2 from '../../assets/img/player_icons/Quiplash/2.webp';
import logo3 from '../../assets/img/player_icons/Quiplash/3.webp';
import logo4 from '../../assets/img/player_icons/Quiplash/4.webp';
import logo5 from '../../assets/img/player_icons/Quiplash/5.webp';
import logo6 from '../../assets/img/player_icons/Quiplash/6.webp';
import logo7 from '../../assets/img/player_icons/Quiplash/7.webp';

class Quiplash extends Juego {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state, // Así obtengo los estados de la clase padre
            senalMostrarRespuestas: false,
            senalMostrarPropietarios: false,
            colorNoria: this.colorAleatorio(),
            offsetNoria: 0,
            prevOffsetNoria: 0,
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

    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);
        if (prevState.offsetNoria !== this.state.offsetNoria) {
            this.setState({prevOffsetNoria: prevState.offsetNoria});
        }
    }


    componentDidMount() {
        super.componentDidMount();
        this.interval = setInterval(
            () => {
                const prevOffset = this.state.prevOffsetNoria; // Obtener el offset previo
                const newOffset = prevOffset + 20;
                this.setState({colorNoria: this.colorAleatorio(), offsetNoria: newOffset});
            },
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
                            <Noria key={this.state.jugadoresConectados.map(jugador => jugador.id).join('_')}
                                   jugadores={this.state.jugadoresConectados} offset={this.state.offsetNoria}/>

                        </article>
                        <img className={styles.QRcode} id="QRcode" src="" alt="codigoQR"/>

                    </div>

                </section>

            </>);
    }

   renderRespondiendo() {
    this.state.promptIndex = 0;

    const handleSubmit = () => {
        this.setState({promptIndex: this.state.promptIndex + 1});
    }

    return (
        <>
            <section className={styles.answerScreen}>
                <Contador tiempoInicial={90}/>
                <Prompt texto={this.state.prompts[this.state.promptIndex]}/>
                <InputRespuestaLimitado socket={socket} playerID={this.playerReference} gameCode={this.GameCode}
                                        styles={styles} onHandleSubmitRef={handleSubmit}/>
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
}

function Prompt({texto}) {
    return (
        <h1 className={styles.prompt}>{texto}</h1>
    );
}

const Noria = React.memo(function Noria({jugadores, offset = 0}) {
    const [connectedPlayers, setConnectedPlayers] = useState(jugadores);
    const [springStyles, setSpringStyles] = useSpring(() => ({
        transform: `rotate(${offset * 45}deg)` // 45 grados por jugador
    }));

    useEffect(() => {
        setConnectedPlayers(jugadores);
        setSpringStyles({transform: `rotate(${offset * 45}deg)`});
        console.log("offset effect: " + offset);
    }, [jugadores]);

    let counter = 0;
    const logos = [logo0, logo1, logo2, logo3, logo4, logo5, logo6, logo7];


    const iconosJugadores = connectedPlayers.map((jugador) => (
        <div className={styles.palo} key={jugador.id}>
            <IconoJugador nombreClase={styles.icono} nombre={jugador.name} rutaImagen={logos[counter++]}
                          style={springStyles}/>
        </div>
    ));
    console.log(counter);

    // Rellenar los espacios restantes con IconoJugador vacíos
    for (let i = connectedPlayers.length; i < 8; i++) {
        iconosJugadores.push(
            <div className={styles.palo} key={i} style={{visibility: 'hidden'}}>
                <IconoJugador/>
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
