import React, {useEffect, useState} from 'react';
import styles from '../css/menuPrincipal.module.css';
import {useSpring, animated} from '@react-spring/web'
import Chatbot from "./juegos/Chatbot";
import JokeBattle from "./juegos/JokeBattle";
import {socket} from "../scripts/cliente";
import {useNavigate, useLocation} from "react-router-dom";

function MenuCrear({volverAlMenu, crearPartida}) {
    const springs = useSpring({
        from: {x: -1000},
        to: {x: 0},
    });
    const [connection, setConnection] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setConnection(socket.connected)

        }, 1000);
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        if (socket.connected) {
            const formData = new FormData(event.target);
            const username = formData.get('username');
            const modoJuego = formData.get('juego');
            crearPartida(username, modoJuego);
        } else {
            alert('El servidor de juego no está disponible');
        }
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
                        <option value="jokebattle" defaultValue={true}>JokeBattle</option>
                        <option value="chatbot">Chatbot</option>
                    </select>
                    <input className={(connection ? styles.activeServer : styles.inactiveServer)} type="submit"
                           value="Crear" id="crearPartida"/>
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

    const [connection, setConnection] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setConnection(socket.connected)

        }, 1000);
    });

    const handleSubmit = (event) => {
        event.preventDefault();

        if (socket.connected) {
            const formData = new FormData(event.target);
            const gameCode = formData.get('code');
            const username = formData.get('username');
            unirsePartida(username, gameCode);
        } else {
            alert('El servidor de juego no está disponible');
        }


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
                    <input className={(connection ? styles.activeServer : styles.inactiveServer)} type="submit"
                           value="Unirse" id="unirsePartida"/>
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

    return (
        <>
            <header className={styles.header}>
                <h1>plazzy</h1>
            </header>
            <main className={styles.main}>
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
    const [isHost, setIsHost] = useState(false);

    const handleCreate = (userName, gameMode) => {
        setGame(gameMode);
        socket.emit('create', userName, gameMode);
    };

    socket.on('disconnectPlayer', (playerId, players) => {
        if (player === players[playerId]) {
            returnToLobby();
            if (isInGameRoute) {
                navigate('/');
            }
        }
    });

    const location = useLocation();
    const navigate = useNavigate();
    const [isInGameRoute, setIsInGameRoute] = useState(false);

    useEffect(() => {
        // Verifica si la ruta actual incluye "/game/"
        setIsInGameRoute(location.pathname.startsWith('/game/'));
    }, [location]);

    useEffect(() => {
        if (gameCodeRef && playerRef) {
            handleJoin(playerRef, gameCodeRef);
        }
    }, [gameCodeRef, playerRef]);

    function returnToLobby() {
        setPlayer(null);
        setPlayersInLobby([]);
        setGame(null);
        setGameCode(null);
        setIsHost(false);
        if (isInGameRoute) {
            navigate('/');
        }
    }

    socket.on('closeLobby', returnToLobby);

    socket.on('lobbyCreated', (lobby) => {
        setGameCode(lobby.code);
    });

    socket.on('shareGameMode', (gameMode) => {
        let gameName;
        switch (gameMode) {
            case 0:
                gameName = 'jokebattle';
                break;
            case 1:
                gameName = 'chatbot';
                break;
            default:
                break;
        }
        setGame(gameName);
    });

    socket.on('sharePlayer', (player) => {
        setPlayer(player);
    });

    socket.on('updatePlayers', (players) => {
        setPlayersInLobby(players);
        if (player) {
            if (playersInLobby[0] === player) {
                setIsHost(true);
            }
        }
    });

    // Si refresca la pagina se desconecta
    window.onbeforeunload = function () {
        if (player) {
            socket.emit('disconnectPlayer', player.id);
            if (isInGameRoute) {
                navigate('/');
            }
        }
        return null;
    }

    const handleJoin = (userName, gameCode) => {
        setGameCode(gameCode);
        socket.emit('joinGame', userName, gameCode);
    };

    if (player && gameCode && isHost) {
        if (game === 'jokebattle') {
            return <JokeBattle gameCode={gameCode} player={player} isHost={isHost} connectedPlayers={playersInLobby}/>;
        } else if (game === 'chatbot') {
            return <Chatbot gameCode={gameCode} player={player} isHost={isHost} connectedPlayers={playersInLobby}/>;
        }

    }
    return (
        <MenuPrincipal onCreate={handleCreate} onJoin={handleJoin}/>
    );
}

export default Index;
