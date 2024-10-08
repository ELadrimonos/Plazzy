import React, {useEffect, useRef, useState} from 'react';
import Juego from './Juego';
import {CodigoPartida, Contador, IconoJugador, IconoLobby, InputRespuestaLimitado} from "../ComponentesComunes";
import styles from '../../css/JokeBattle.module.css';
import {useSpring, animated, useTrail, a, useSprings} from '@react-spring/web'
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
import {PerspectiveCamera} from "@react-three/drei";
import FondoColoresRandom from "../FondoColoresRandom";

class JokeBattle extends Juego {
    constructor(props) {
        super(props);
        this.state = {
            ...this.state, // Así obtengo los estados de la clase padre
            senalMostrarRespuestas: false,
            senalMostrarPropietarios: false,
            prompt: 'Eres un peruano de la verga',
            respuestaPrompt1: 'UNO',
            respuestaPrompt2: 'DOS',
            propietarioRespuesta1: '',
            propietarioRespuesta2: '',
            colorNoria: this.colorAleatorio(),
            offsetNoria: 0,
            prevOffsetNoria: 0,
            currentPromptIndex: 0,
            promptId: 0,
            bloquearRespuestas: false,
            respuestaSeleccionada: false,
            promptsData: [],
        };
        this.interval = null;
        this.modelos = ["/Burger.glb", "/Cube.glb", "/Barrel.glb", "/Cross.glb", "/Monkey.glb", "/Cone.glb", "/Icosphere.glb", "/Triangle.glb"];

        socket.on('receiveVotingData', (data) => {
            this.getVotingData(data);
        })
    }

    getVotingData(data) {
        this.setState({
            promptsData: data,
            currentPromptIndex: 0,
            prompt: data[0].promptText,
            promptId: data[0].promptId,
            respuestaPrompt1: data[0].answers[0].answerText,
            propietarioRespuesta1: this.getPlayerName(data[0].answers[0].playerId),
            respuestaPrompt2: data[0].answers[1].answerText,
            propietarioRespuesta2: this.getPlayerName(data[0].answers[1].playerId),
        });
    };

    componentDidUpdate(prevProps, prevState) {
        super.componentDidUpdate(prevProps, prevState);
        if (prevState.offsetNoria !== this.state.offsetNoria) {
            this.setState({prevOffsetNoria: prevState.offsetNoria});
        }
        if (this.state.estadoJuego === 'puntuaje' && this.state.rondaActual >= this.maxRounds && prevState.estadoJuego !== 'puntuaje') {
            setTimeout(
                function () {
                    this.startEndGame();
                }
                    .bind(this),
                5000
            );
        } else if (this.state.estadoJuego === 'puntuaje' && prevState.estadoJuego !== 'puntuaje') {
            if (this.isPlayerHost()) {
                setTimeout(
                    function () {
                        this.startNewRound();
                    }
                        .bind(this),
                    5000
                );
            }

        }
        if (this.state.estadoJuego === 'votando' && prevState.estadoJuego !== 'votando') {
            this.setState({bloquearRespuestas: false, currentPromptIndex: 0});

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
        if (this.state.estadoJuego === 'puntuaje') {
            if (this.state.rondaActual >= this.maxRounds) {
                setTimeout(this.startEndGame, 5000);
            }
        }

    }

    colorAleatorio = () => {
        return "rgb(" + (Math.random() * 255) + "," + (Math.random() * 255) + "," + (Math.random() * 255) + ")"
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        socket.off('getVotingData');
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

    renderIntro() {
        return (
            <section className={styles.introScreen}>
                <IntroduccionJokeBattle/>
                <button className={styles.startButton} onClick={() => this.startAnswering()}>Comenzar</button>
            </section>
        );
    }

    renderRespondiendo() {

        const handleSubmit = () => {
            if (this.state.currentPromptIndex < this.state.prompts.length - 1)
                this.setState({currentPromptIndex: this.state.currentPromptIndex + 1});
            else
                this.setState({bloquearRespuestas: true});
        }

        const handleRunOutOfTime = () => {
            this.setState({bloquearRespuestas: true});
            socket.emit('playerRanOutOfTimeToAnswer', this.GameCode, this.playerReference.id);
        }

        const indexJugador = this.state.jugadoresConectados.findIndex(jugador => jugador.id === this.playerReference.id);

        return (
            <>
                <FondoColoresRandom/>
                <section className={styles.answerScreen}>
                    <div style={{position: 'relative', display: 'flex', justifyContent: 'space-between', width: '100%'}}>

                    <h1 className={styles.rondaActual}>RONDA {this.state.rondaActual}</h1>
                    <Contador className={styles.contador} tiempoInicial={90}
                              onTiempoTerminado={handleRunOutOfTime}/>
                    </div>

                    {!this.state.bloquearRespuestas && (
                        <>
                            <Prompt texto={this.state.prompts[this.state.currentPromptIndex]?.text}/>
                            <InputRespuestaLimitado socket={socket} playerID={this.playerReference.id}
                                                    gameCode={this.GameCode}
                                                    promptId={this.state.prompts[this.state.currentPromptIndex]?.id_prompt}
                                                    styles={styles} onHandleSubmitRef={handleSubmit}/>
                            <SafetyButton handleSubmit={handleSubmit} gameCode={this.GameCode}
                                          playerId={this.playerReference.id}/>
                        </>)}
                    <section className={styles.jugadores}>
                        <Canvas className={styles.listaJugadores}>
                            <ambientLight intensity={0.5}/>
                            <directionalLight position={[10, 10, 10]} intensity={1}/>
                            <PerspectiveCamera fov={10} makeDefault position={[0, 0, 10000]}/>
                            <ModeloJugador modeloPath={this.modelos[indexJugador]}
                                           animationName={!this.state.bloquearRespuestas ? "idle" : null}
                                           bloquearRespuestas={this.state.bloquearRespuestas}/>
                        </Canvas>
                        <div className={styles.sombraJugadores}></div>
                    </section>
                </section>
            </>
        );
    }

    getPlayerName = (id) => {
        const player = this.state.jugadoresConectados.find((jugador) => jugador.id === id);
        if (player) {
            return player.name;
        }
    }


    renderVotando() {
        const handleTimeout = () => {
            console.log('SIN TIEMPO');

            this.setState({
                senalMostrarRespuestas: false,
                senalMostrarPropietarios: false,
                respuestaSeleccionada: false
            });

            mostrarSiguientesRespuestas();
        };


        const mostrarSiguientesRespuestas = () => {
            this.setState({
                senalMostrarPropietarios: true
            });

            setTimeout(() => {
                const {currentPromptIndex, promptsData} = this.state;
                const newIndex = currentPromptIndex + 1;

                if (newIndex >= promptsData.length) {
                    this.setState({
                        senalMostrarRespuestas: false,
                        senalMostrarPropietarios: false,
                        respuestaSeleccionada: false,
                        prompts: [],
                        currentPromptIndex: 0,
                        prompt: "",
                        promptId: "",
                        respuestaPrompt1: "",
                        propietarioRespuesta1: "",
                        respuestaPrompt2: "",
                        propietarioRespuesta2: "",
                        promptsData: []
                    });

                    if (this.isPlayerHost()) {
                        socket.emit('startResults', this.GameCode);
                    }
                } else {
                    const nextPrompt = promptsData[newIndex];
                    this.setState({
                        senalMostrarRespuestas: true,
                        senalMostrarPropietarios: false,
                        currentPromptIndex: newIndex,
                        prompt: nextPrompt.promptText,
                        promptId: nextPrompt.promptId,
                        respuestaPrompt1: nextPrompt.answers[0].answerText,
                        propietarioRespuesta1: this.getPlayerName(nextPrompt.answers[0].playerId),
                        respuestaPrompt2: nextPrompt.answers[1].answerText,
                        propietarioRespuesta2: this.getPlayerName(nextPrompt.answers[1].playerId),
                        respuestaSeleccionada: false
                    });
                }
            }, 3000);
        };

        const handleClickRespuesta = (propietario) => {
            if (!this.state.respuestaSeleccionada) {
                socket.emit('playerVote', this.GameCode, propietario);
                this.setState({respuestaSeleccionada: true});
            }
        };

        return (
            <section className={styles.round}>

                <RespuestasPrompt key={'Respuestas_' + this.state.currentPromptIndex}
                                  prompt={this.state.prompt}
                                  senalMostrarPropietarios={this.state.senalMostrarPropietarios}
                                  handleTimeout={handleTimeout}
                                  propietarioIzq={this.state.propietarioRespuesta1}
                                  propietarioDer={this.state.propietarioRespuesta2}
                                  respuestaIzq={this.state.respuestaPrompt1}
                                  respuestaDer={this.state.respuestaPrompt2}
                                  handleClickRespuesta={handleClickRespuesta}
                                  gameCode={this.GameCode}
                                  bloquearRespuestas={this.state.respuestaSeleccionada}
                />
            </section>
        );
    }

    renderPuntuacion() {
        return <PodioPuntuacion btnFunc={this.startNewRound} jugadores={this.state.jugadoresConectados}/>
    };


    renderFin() {

        socket.on('getWinner', (data) => {
            this.setState({ganador: {name: this.state.jugadoresConectados[data].name, index: data}});
        });

        return (
            <section className={styles.endScreen}>
                <h1>Fin de la partida</h1>

                {
                    this.state.ganador &&
                    <>
                        <h2>GANADOR: {this.state.ganador.name}</h2>
                        <Canvas className={styles.winnerModel}>
                            <ambientLight intensity={0.5}/>
                            <directionalLight position={[10, 10, 10]} intensity={1}/>
                            <PerspectiveCamera fov={10} makeDefault position={[0, 0, 10000]}/>
                            <ModeloJugador modeloPath={this.modelos[this.state.ganador.index]}
                                           animationName="idle"/>
                        </Canvas>
                    </>
                }
                <div className={styles.buttonList}>
                    {
                        this.isPlayerHost() && (
                            <button onClick={() => socket.emit('startLobby', this.GameCode)}>Volver a jugar</button>
                        )
                    }
                    <button onClick={() => window.location.reload()}>Regresar al menú</button>
                </div>

            </section>
        );
    }
}


function Prompt({texto}) {
    const [displayText, setDisplayText] = useState(texto);
    const prevTexto = useRef(texto);

    useEffect(() => {
        if (prevTexto.current !== texto) {
            setDisplayText(texto);
            prevTexto.current = texto;
        }
    }, [texto]);

    return (
        <h1 className={styles.prompt}>
            {displayText}
        </h1>
    );
}

const
    Noria = React.memo(function Noria({jugadores, offset = 0}) {
        const [connectedPlayers, setConnectedPlayers] = useState(jugadores);
        const [springStyles, setSpringStyles] = useSpring(() => ({
            transform: `rotate(${offset * 45}deg)`
        }));

        useEffect(() => {
            setConnectedPlayers(jugadores);
            setSpringStyles({transform: `rotate(${offset * 45}deg)`});
        }, [jugadores, offset, setSpringStyles]);

        let counter = 0;
        const logos = [logo0, logo1, logo2, logo3, logo4, logo5, logo6, logo7];


        const iconosJugadores = connectedPlayers.map((jugador) => (
            <div className={styles.palo} key={jugador.id}>
                <IconoJugador nombreClase={styles.icono} nombre={jugador.name} rutaImagen={logos[counter++]}
                              style={springStyles}/>
            </div>
        ));

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
                             senalMostrarPropietarios,
                             clickFunc,
                             bloquearRespuesta
                         }) {
    const [springs, api] = useSpring(() => ({
        from: {x: desdeIzquierda ? -100 : 100},
        to: {x: 0},
        config: {duration: 1200},
        reset: true // Asegúrate de reiniciar la animación
    }));


    useEffect(() => {
        api.start({from: {x: desdeIzquierda ? -100 : 100}, to: {x: 0}});
    }, [api, desdeIzquierda, texto]);

    return (
        <animated.div
            style={{...springs}}
            className={styles.promptResponse}
            onClick={() => {
                if (!bloquearRespuesta) clickFunc(propietario);
            }}
        >
            <p className={bloquearRespuesta ? styles.responseTextBold : styles.responseText}>{texto}</p>
            <AnimatedPropietario propietario={propietario} senalMostrarPropietarios={senalMostrarPropietarios}/>
        </animated.div>
    );
}

function RespuestasPrompt({
                              gameCode,
                              handleTimeout,
                              handleClickRespuesta,
                              prompt,
                              respuestaIzq,
                              respuestaDer,
                              propietarioIzq,
                              propietarioDer,
                              senalMostrarPropietarios,
                              bloquearRespuestas
                          }) {
    return (
        <>
            <header className={styles.promptHeader}>
                <Contador className={styles.contador} tiempoInicial={10} onTiempoTerminado={handleTimeout}/>
                <Prompt texto={prompt}/>
                <IconoLobby className={styles.gameCode} gameCode={gameCode}/>
            </header>
            <div className={styles.promptMessages}>
                <RespuestaPrompt
                    key={`izq-${prompt}`} // Añadir key para forzar el reinicio del componente
                    desdeIzquierda={true}
                    texto={respuestaIzq}
                    propietario={propietarioIzq}
                    senalMostrarPropietarios={senalMostrarPropietarios}
                    clickFunc={() => handleClickRespuesta(propietarioIzq)}
                    bloquearRespuesta={bloquearRespuestas}
                />
                <RespuestaPrompt
                    key={`der-${prompt}`} // Añadir key para forzar el reinicio del componente
                    desdeIzquierda={false}
                    texto={respuestaDer}
                    propietario={propietarioDer}
                    senalMostrarPropietarios={senalMostrarPropietarios}
                    clickFunc={() => handleClickRespuesta(propietarioDer)}
                    bloquearRespuesta={bloquearRespuestas}
                />
            </div>
        </>
    );
}

function AnimatedPropietario({propietario, senalMostrarPropietarios}) {
    const props = useSpring({
        opacity: senalMostrarPropietarios ? 1 : 0,
        visibility: senalMostrarPropietarios ? 'visible' : 'hidden'
    });

    return (
        <animated.h5 className={styles.responseOwner} style={props}>{propietario}</animated.h5>
    );
}

const IntroduccionJokeBattle = () => {
    const title = ['¿Cómo', 'jugar?']; // Texto dividido en palabras

    const trail = useTrail(title.length, {
        config: {mass: 5, tension: 600, friction: 200},
        opacity: 1,
        x: 0,
        from: {opacity: 0, x: 20},
    });

    return (
        <div>
            {trail.map((props, index) => (
                <a.h1 className={styles.title} key={index} style={props}>
                    {title[index]}
                </a.h1>
            ))}
            <p>El juego consta de 3 rondas, donde los jugadores rellenarán los espacios restantes de las frases
                recibidas y serán juzgados por el resto de jugadores.</p>
        </div>
    );
};

function PodioPuntuacion({btnFunc, jugadores = []}) {
    const [jugadoresConectados, setJugadoresConectados] = useState(jugadores);
    const logos = [logo0, logo1, logo2, logo3, logo4, logo5, logo6, logo7];

    useEffect(() => {
        if (jugadores.length > 0) {
            setJugadoresConectados(jugadores);
        }
    }, [jugadores]);

    const jugadoresOrdenados = [...jugadoresConectados].sort((a, b) => b.score - a.score);

    const [springs, api] = useSprings(jugadoresOrdenados.length, index => ({
        from: {transform: 'translateX(100vw)', opacity: 0},
        to: {transform: 'translateX(0)', opacity: 1},
        delay: index * 300,
        config: {tension: 200, friction: 20}
    }));

    useEffect(() => {
        api.start(index => ({
            from: {transform: 'translateX(100vw)', opacity: 0},
            to: {transform: 'translateX(0)', opacity: 1},
            delay: index * 300,
            config: {tension: 200, friction: 20}
        }));
    }, [jugadoresConectados, api]);

    return (
        <div className={styles.scoreScreen}>
            <h1>Clasificación de Jugadores</h1>
            <button className={styles.startButton} onClick={btnFunc}>Empezar nueva ronda</button>
            <div className={styles.puntuacion}>
                {springs.map((springStyle, index) => {
                    const jugador = jugadoresOrdenados[index];
                    const posicionPodio = index + 1;
                    return (
                        <animated.div key={jugador.id} style={springStyle} className={styles.posicionPodio}>
                            <div className={styles.numeroPodio}>
                                <h2>{posicionPodio}°</h2>
                            </div>
                            <IconoJugador
                                nombreClase={styles.icono}
                                nombre={jugador.name}
                                rutaImagen={logos[index]}
                            />
                            <h3>Puntuación:</h3>
                            <h4>{jugador.score}</h4>
                        </animated.div>
                    );
                })}
            </div>
        </div>
    );
}

function SafetyButton({gameCode, playerId, handleSubmit}) {
    const [clicked, setClicked] = useState(false);

    const animationProps = useSpring({
        transform: clicked ? 'scale(0.9)' : 'scale(1)',
        background: clicked ? '#a9a611' : '#d2b638',
        fontWeight: clicked ? 'bold' : 'normal',
        from: {transform: 'scale(1)', background: '#d2b638', fontWeight: 'normal'},
        config: {duration: 200},
        onRest: () => setClicked(false),
    });

    const handleClick = () => {
        setClicked(true);
        socket.emit('playerUseSafetyAnswer', gameCode, playerId);
        handleSubmit();
    };

    return (
        <animated.button
            className={styles.safetySendButton}
            style={animationProps}
            onClick={handleClick}
        >
            ¡Ayudame!
        </animated.button>
    );
}

export default JokeBattle;
