import React, {useEffect, useState} from 'react';
import styles from '../css/menuPrincipal.module.css';
import * as THREE from 'three';
import {FontLoader} from 'three/examples/jsm/loaders/FontLoader';
import {TextGeometry} from 'three/examples/jsm/geometries/TextGeometry';
import {useSpring, animated} from '@react-spring/web'
import Chatbot from "./juegos/Chatbot";
import Quiplash from "./juegos/Quiplash";
import {socket} from "../scripts/cliente";
import {log} from "three/nodes";
import {useNavigate, useLocation} from "react-router-dom";
import ModeloJugador from "./ModeloJugador";


// TODO Refactorizar estilos por clases del styles


// Cambiar por iconos de los juegos
function FondoTresD() {
    const canvasRef = React.useRef();

    React.useEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({canvas: canvasRef.current});
        const geometry = new THREE.BoxGeometry(100, 100, 100);
        const textureLoader = new THREE.TextureLoader();
        const material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.BackSide});
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);
        camera.position.z = 5;
        let textMesh; // Definimos textMesh aquí

        const fontLoader = new FontLoader();
        fontLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/fonts/helvetiker_regular.typeface.json', function (font) {
            const textGeometry = new TextGeometry('PLAZZY', {
                font: font,
                size: 0.5,
                height: 0.5,
                curveSegments: 12,
                bevelEnabled: true,
                bevelThickness: 0.01,
                bevelSize: 0.02,
                bevelSegments: 1
            });

            const material = new THREE.MeshBasicMaterial({color: 0x000000});
            textMesh = new THREE.Mesh(textGeometry, material); // Asignamos a textMesh aquí
            scene.add(textMesh);

            let rotationDirection = 0.3; // Dirección de rotación (1 para la derecha, -1 para la izquierda)
            let rotationAngle = 0; // Ángulo de rotación acumulado

            const animate = () => {
                requestAnimationFrame(animate);

                // Girar hasta 2 en una dirección y luego 2 en la dirección opuesta
                if (rotationAngle >= 0.5 || rotationAngle <= -0.5) {
                    rotationDirection *= -1; // Cambiar la dirección de rotación
                }

                // Girar en la dirección actual
                textMesh.rotation.x += 0.005 * rotationDirection;
                textMesh.rotation.y -= 0.005 * rotationDirection;

                rotationAngle += 0.005 * rotationDirection; // Actualizar el ángulo de rotación acumulado

                renderer.setSize(window.innerWidth, window.innerHeight);
                renderer.render(scene, camera);
            };

            animate();
        });

        return () => {
            if (textMesh) { // Verificamos si textMesh está definido antes de usarlo
                scene.remove(textMesh);
            }
        };
    }, []);

    return <canvas ref={canvasRef} style={{position: 'fixed', top: 0, left: 0, zIndex: -1}}/>;
}

function MenuCrear({volverAlMenu, crearPartida}) {
    const springs = useSpring({
        from: {x: -1000},
        to: {x: 0},
    })

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí puedes agregar lógica para manejar la creación de la partida
        const formData = new FormData(event.target);
        const username = formData.get('username');
        const modoJuego = formData.get('juego');
        crearPartida(username, modoJuego);
    };


    return (
        <animated.section id="menuCrearPartida" style={{...springs, 'maxWidth': '50%'}}>
            <fieldset id="crearPartidaForm">
                <legend>Crear Partida</legend>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombreHost">Nombre: </label>
                    <input type="text" name="username" id="nombreHost" maxLength={10} required/>
                    <label htmlFor="modoDeJuego">Modo de juego: </label>
                    <select name="juego" id="modoDeJuego">
                        <option value="quiplash" defaultValue={true}>Quiplash</option>
                        <option value="chatbot">Chatbot</option>
                    </select>
                    <input type="submit" value="Crear" id="crearPartida"/>
                </form>
            </fieldset>
            <button className={styles.button} onClick={volverAlMenu}>Unirse a partida</button>
        </animated.section>
    );


}

function MenuUnirse({menuCrear, unirsePartida}) {
    const springs = useSpring({
        from: {x: -1000},
        to: {x: 0},
    });

    const handleSubmit = (event) => {
        event.preventDefault();
        // Aquí puedes agregar lógica para manejar la creación de la partida
        const formData = new FormData(event.target);
        const gameCode = formData.get('code');
        const username = formData.get('username');
        unirsePartida(username, gameCode);
    };

    return (
        <animated.section style={{...springs, 'maxWidth': '50%'}} id="menuPrincipal">
            <fieldset id="joinGame">
                <legend>Unirse A Partida</legend>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="nombreJugador">Nombre: </label>
                    <input type="text" name="username" id="nombreJugador" maxLength={10} required/>
                    <label htmlFor="gameCode">Código partida: </label>
                    <input type="text" name="code" id="gameCode" minLength="4" maxLength="4" required/>
                    <input type="submit" value="Unirse" id="unirsePartida"/>
                </form>
            </fieldset>
            <button className={styles.button} onClick={menuCrear}>Crear partida</button>
        </animated.section>
    );
}


function MenuPrincipal({onCreate, onJoin}) {
    const [mostrarCrearPartida, setMostrarCrearPartida] = useState(false);

    const mostrarCrearPartidaHandler = () => {
        setMostrarCrearPartida(true);
    };

    const volverAlMenuHandler = () => {
        setMostrarCrearPartida(false);
    };

    const estilosHeader = {
        backgroundColor: 'purple',
        zIndex: 1000,
        width: '90%',
        height: '100px',
        paddingLeft: '30px',
    }

    return (
        <>
            <header style={estilosHeader}>
                <h1>plazzy</h1>
            </header>
            <main>
                {!mostrarCrearPartida && <MenuUnirse menuCrear={mostrarCrearPartidaHandler} unirsePartida={onJoin}/>}
                {mostrarCrearPartida && <MenuCrear volverAlMenu={volverAlMenuHandler} crearPartida={onCreate}/>}
            </main>
        </>
    );
}

function Index({gameCodeRef = null, playerRef = null}) {
    const [game, setGame] = useState(null);
    const [player, setPlayer] = useState(null);
    const [playersInLobby, setPlayersInLobby] = useState([]);
    const [gameCode, setGameCode] = useState(null);

    const handleCreate = (userName, gameMode) => {
        setGame(gameMode);
        socket.emit('create', userName, gameMode);
    };

    socket.on('disconnectPlayer', (playerId, players) => {
        if (player === players[playerId]){
            returnToLobby();
            if (isInGameRoute){
                navigate('/');
            }
        }
    });

    const location = useLocation();
    const navigate = useNavigate();
    const [isInGameRoute, setIsInGameRoute] = useState(false);

    //TODO: Evitar la conexion en intervalo mediante codigo QR

    useEffect(() => {
        // Verifica si la ruta actual incluye "/game/"
        setIsInGameRoute(location.pathname.startsWith('/game/'));
    }, [location]);

    useEffect(() => {
        if (gameCodeRef && playerRef) {
            handleJoin(playerRef, gameCodeRef);
        }
    }, [gameCodeRef,playerRef]);

    function returnToLobby() {
        setPlayer(null);
        setPlayersInLobby([]);
        setGame(null);
        setGameCode(null);
    }

    socket.on('closeLobby', returnToLobby);

    socket.on('lobbyCreated', (lobby) => {
        setGameCode(lobby.code);
    });

    socket.on('shareGameMode', (gameMode) => {
        setGame(gameMode);
    });

    socket.on('sharePlayer', (player) => {
        setPlayer(player);
    });

    socket.on('updatePlayers', (players) => {
        setPlayersInLobby(players);
    });

    // Si refresca la pagina se desconecta
    window.onbeforeunload = function (){
        if (player){
            socket.emit('disconnectPlayer', player.id);
            if (isInGameRoute){
                navigate('/');
            }
        }
       return null;
    }

    const handleJoin = (userName, gameCode) => {
        setGameCode(gameCode);
        socket.emit('joinGame', userName, gameCode);
    };

    if (game === 'quiplash' && gameCode && player) {
        return <Quiplash gameCode={gameCode} player={player} connectedPlayers={playersInLobby}/>;
    } else if (game === 'chatbot' && gameCode) {
        return <Chatbot gameCode={gameCode} player={player} connectedPlayers={playersInLobby}/>;
    } else {
        return (
            <MenuPrincipal onCreate={handleCreate} onJoin={handleJoin} connectedPlayers={playersInLobby}/>
        );
    }
}

export default Index;
