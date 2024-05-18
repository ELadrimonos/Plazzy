import React, {useEffect, useState} from 'react';
import Juego from './Juego';
import {CodigoPartida, Contador, IconoJugador, IconoLobby, InputRespuestaLimitado} from "../ComponentesComunes";
import styles from '../../css/JokeBattle.module.css';
import {useSpring, animated} from '@react-spring/web'
import {socket} from "../../scripts/cliente";
import logo0 from '../../assets/img/player_icons/JokeBattle/0.webp';
import logo1 from '../../assets/img/player_icons/JokeBattle/1.webp';
import logo2 from '../../assets/img/player_icons/JokeBattle/2.webp';
import logo3 from '../../assets/img/player_icons/JokeBattle/3.webp';
import logo4 from '../../assets/img/player_icons/JokeBattle/4.webp';
import logo5 from '../../assets/img/player_icons/JokeBattle/5.webp';
import logo6 from '../../assets/img/player_icons/JokeBattle/6.webp';
import logo7 from '../../assets/img/player_icons/JokeBattle/7.webp';
import ModeloJugador from "../ModeloJugador";
import {Canvas} from "@react-three/fiber";
import {OrthographicCamera} from "@react-three/drei";

class JokeBattle extends Juego {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state, // Así obtengo los estados de la clase padre
            senalMostrarRespuestas: false,
            senalMostrarPropietarios: false,
            prompt: 'PRUEBA',
            respuestaPrompt1: 'UNO',
            respuestaPrompt2: 'DOS',
            propietarioRespuesta1: '',
            propietarioRespuesta2: '',
            colorNoria: this.colorAleatorio(),
            offsetNoria: 0,
            prevOffsetNoria: 0,
            promptIndex: 0,
            bloquearRespuestas: false,
            respuestaSeleccionada: false,
        };
        this.interval = null;
        this.modelos = ["/Burger.glb", "/Cube.glb", "/Barrel.glb", "/Cross.glb", "/Monkey.glb", "/Cone.glb", "/Icosphere.glb", "/Triangle.glb"];

    }

    // Método para emitir señal para mostrar respuestas
    emitirSenalMostrarRespuestas = (valor) => {
        this.setState({senalMostrarRespuestas: valor});
    }

    // Método para emitir señal para mostrar propietarios
    emitirSenalMostrarPropietarios = (valor) => {
        this.setState({senalMostrarPropietarios: valor});
    }

    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);
        if (prevState.offsetNoria !== this.state.offsetNoria) {
            this.setState({prevOffsetNoria: prevState.offsetNoria});
        }
    }


    componentDidMount() {
        super.componentDidMount();
        if (this.state.estadoJuego === 'lobby') {
            this.interval = setInterval(
                () => {
                    const prevOffset = this.state.prevOffsetNoria; // Obtener el offset previo
                    const newOffset = prevOffset + 20;
                    this.setState({colorNoria: this.colorAleatorio(), offsetNoria: newOffset});
                },
                1000
            );
        }

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
                        <h1>JokeBattle</h1>
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

        const logos = [logo0, logo1, logo2, logo3, logo4, logo5, logo6, logo7];

        const handleSubmit = () => {
            if (this.state.promptIndex < this.state.prompts.length - 1)
                this.setState({promptIndex: this.state.promptIndex + 1});
            else
                this.setState({bloquearRespuestas: true});
        }

        const handleRunOutOfTime = () => {
            this.setState({bloquearRespuestas: true});
            socket.emit('playerRanOutOfTimeToAnswer', this.GameCode, this.playerReference.id);
        }

        return (
            <>
                <section className={styles.answerScreen}>
                    {/* Pasando la funcion por referencia se congela*/}
                    <Contador tiempoInicial={90} onRunOutOfTime={() => handleRunOutOfTime()}/>
                    {!this.state.bloquearRespuestas && (
                        <>
                            <Prompt texto={this.state.prompts[this.state.promptIndex]}/>
                            <InputRespuestaLimitado socket={socket} playerID={this.playerReference.id}
                                                    gameCode={this.GameCode}
                                                    styles={styles} onHandleSubmitRef={handleSubmit}/>
                            <button onClick={() => {
                                socket.emit('playerUseSafetyAnswer', this.GameCode, this.playerReference.id);
                                handleSubmit();
                            }
                            }
                            >¡Ayudame!
                            </button>
                        </>)}


                    <section className={styles.jugadores}>
                        <Canvas className={styles.listaJugadores}>
                            <ambientLight intensity={0.5}/>
                            <directionalLight position={[10, 10, 10]} intensity={1}/>
                            <OrthographicCamera makeDefault position={[0, 0, 100]} zoom={20}/>
                            {this.state.jugadoresConectados.map((jugador, index) => (
                                <ModeloJugador key={jugador.id} modeloPath={this.modelos[index]}
                                               animationName="idle" position={[0, index * 10, 0]}/>
                            ))}
                        </Canvas>
                        <div className={styles.sombraJugadores}></div>
                    </section>
                </section>
            </>
        );
    }


    renderJugando() {
        const handleTimeout = () => {
            console.log('SIN TIEMPO');
            if (this.isPlayerHost()) {
                socket.emit('loadNextVotingData', this.GameCode);
                // Reiniciar el contador y las animaciones
                this.setState({
                    senalMostrarRespuestas: false,
                    senalMostrarPropietarios: false,
                    respuestaSeleccionada: false
                });
                // Volver a cargar los datos de votación
                mostrarSiguientesRespuestas();
            }
        };

        const mostrarSiguientesRespuestas = () => {
            setTimeout(() => {
                this.setState({senalMostrarRespuestas: true})
            }, 2000);
        };

        // Cargar los datos de votación inicial
        socket.on('getVotingData', (data) => {
            this.setState({
                prompt: data.prompt,
                respuestaPrompt1: data.answer1,
                propietarioRespuesta1: data.player1,
                respuestaPrompt2: data.answer2,
                propietarioRespuesta2: data.player2 // Asumiendo que tienes dos respuestas
            });
        });

        // Llamar a mostrarSiguientesRespuestas() después de cargar los datos iniciales
        mostrarSiguientesRespuestas();

        const handleClickRespuesta = (propietario) => {
            if (!this.state.respuestaSeleccionada) {
                socket.emit('playerVote', this.GameCode, propietario);
                this.setState({respuestaSeleccionada: true});
            }
        };

        return (
            <section className={styles.round}>
                <header className={styles.promptHeader}>
                    <Contador tiempoInicial={10} onTimeout={handleTimeout}/>
                    <Prompt texto={this.state.prompt}/>
                    <IconoLobby gameCode={this.GameCode}/>
                </header>
                <div className={styles.promptMessages}>
                    <RespuestaPrompt desdeIzquierda={true} texto={this.state.respuestaPrompt1}
                                     propietario={this.state.propietarioRespuesta1}
                                     senalMostrarRespuestas={this.state.senalMostrarRespuestas}
                                     senalMostrarPropietarios={this.state.senalMostrarPropietarios}
                                     onClick={() => handleClickRespuesta(this.state.propietarioRespuesta1)}/>
                    <RespuestaPrompt desdeIzquierda={false} texto={this.state.respuestaPrompt2}
                                     propietario={this.state.propietarioRespuesta2}
                                     senalMostrarRespuestas={this.state.senalMostrarRespuestas}
                                     senalMostrarPropietarios={this.state.senalMostrarPropietarios}
                                     onClick={() => handleClickRespuesta(this.state.propietarioRespuesta2)}/>
                </div>
                <button onClick={() => socket.emit('startEndGame', this.GameCode)}>Finalizar</button>
                <button onClick={() => this.emitirSenalMostrarRespuestas(true)}>Comenzar</button>
            </section>
        );
    }

    renderFin() {

        socket.on('getWinner', (data) => {
            this.setState({ganador: {name: this.state.jugadoresConectados[data].name, index: data}});
        });

        return (
            <section>
                <h1>Fin de la partida</h1>
                {
                    this.isPlayerHost() && (
                        <button onClick={() => socket.emit('startLobby', this.GameCode)}>Volver a jugar</button>
                    )
                }
                <button onClick={() => window.location.reload()}>Regresar al menú</button>

                {
                    this.state.ganador &&
                    <>
                        <h2>GANADOR: {this.state.ganador.name}</h2>
                        <ModeloJugador modeloPath={this.modelos[this.state.ganador.index]} animationName="idle"/>
                    </>
                }

            </section>
        );
    }
}

function Prompt({texto}) {
    const props = useSpring({
        from: {opacity: 0, transform: 'scale(0)'},
        to: {opacity: 1, transform: 'scale(1)'},
    });

    return <animated.h1 className={styles.prompt} style={{...props}}>{texto}</animated.h1>;
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

function RespuestaPrompt({
                             texto,
                             propietario,
                             desdeIzquierda,
                             senalMostrarRespuestas,
                             senalMostrarPropietarios,
                             onClick
                         }) {
    const [springs, api] = useSpring(() => ({
        from: {x: desdeIzquierda ? -100 : 100},
        config: {duration: senalMostrarRespuestas ? 1000 : 500},
        delay: senalMostrarRespuestas ? 0 : 200, // Ajusta el retraso en la animación si no se muestran las respuestas
        visibility: senalMostrarRespuestas ? 'visible' : 'hidden', // Define la visibilidad inicial
    }));

    useEffect(() => {
        if (senalMostrarRespuestas) {
            api.start({
                from: {x: desdeIzquierda ? -100 : 100},
                to: {x: 0},
            });
        }
    }, [senalMostrarRespuestas]);

    return (
        <animated.div
            style={{
                ...springs,
            }}
            className={styles.promptResponse}
            onClick={onClick} // Aquí se pasa la función onClick
        >
            <p>{texto}</p>
            <AnimatedPropietario propietario={propietario} senalMostrarPropietarios={senalMostrarPropietarios}
                                 senalMostrarRespuestas={senalMostrarRespuestas}/>
        </animated.div>
    );
}

function AnimatedPropietario({propietario, senalMostrarPropietarios, senalMostrarRespuestas}) {
    const props = useSpring({
        opacity: senalMostrarPropietarios && senalMostrarRespuestas ? 1 : 0,
        visibility: senalMostrarPropietarios && senalMostrarRespuestas ? 'visible' : 'hidden',
    });

    return (
        <animated.h5 style={props}>{propietario}</animated.h5>
    );
}


export default JokeBattle;
