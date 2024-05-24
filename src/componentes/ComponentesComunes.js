import React, {useState, useEffect, useRef} from "react";
import {useSpring, animated} from '@react-spring/web'

export function IconoJugador({nombreClase, nombre, rutaImagen, style}) {
    return (
        <div className={nombreClase} style={style}>
            <img src={rutaImagen} alt="icono jugador"/>
            <h4>{nombre}</h4>
        </div>);
}

export function IconoLobby({gameCode}) {
    return (
        <div>
            <h3>plazzy.es</h3>
            <CodigoPartida gameCode={gameCode}/>
        </div>
    );
}

export function CodigoPartida({gameCode}) {
    return <h2 style={{textTransform: 'uppercase'}} className="gameCode">{gameCode}</h2>
}

// onTiempoTerminado es una función que se ejecuta cuando termina

export function Contador({className, tiempoInicial, onTiempoTerminado}) {
    const [tiempoActual, setTiempoActual] = useState(tiempoInicial);
    const intervaloRef = useRef(null);

    useEffect(() => {
        intervaloRef.current = setInterval(() => {
            setTiempoActual(tiempo => {
                if (tiempo > 0) {
                    return tiempo - 1;
                } else {
                    clearInterval(intervaloRef.current);
                    if (onTiempoTerminado !== undefined) {
                        onTiempoTerminado();
                    }
                    return tiempo;
                }
            });
        }, 1000);

        // Limpiar el intervalo al desmontar el componente
        return () => clearInterval(intervaloRef.current);
    }, [tiempoActual]);

    return <h2 className={className}>{tiempoActual}</h2>;
}

export function InputRespuestaLimitado({
                                           socket,
                                           playerID,
                                           promptId,
                                           gameCode,
                                           onHandleSubmitRef,
                                           styles,
                                           maxLength = 30
                                       }) {
    const [respuesta, setRespuesta] = useState('');
        const [clicked, setClicked] = useState(false);

    const animationProps = useSpring({
        transform: clicked ? 'scale(0.9)' : 'scale(1)',
        background: clicked ? '#770a5f' : '#d23885',
        border: '3px solid black',
        fontWeight: clicked ? 'bold' : 'normal',
        from: {transform: 'scale(1)', background: '#d23885', fontWeight: 'normal'},
        config: {duration: 200},
        onRest: () => setClicked(false),
    });

    function enviarRespuesta() {
        setClicked(true);
        if (respuesta !== '') {
            socket.emit('playerAnswer', gameCode, playerID, respuesta, promptId);
            onHandleSubmitRef();
            setRespuesta('');
        }
    }

    return (
        <div className={styles.answerInput}>
            <h2 className={styles.respuestaLength}>{respuesta.length}/30</h2>
            <input
                type="text"
                value={respuesta}
                maxLength={maxLength}
                onChange={e => setRespuesta(e.target.value)}
                onSubmit={enviarRespuesta}
            />
            <animated.button style={animationProps} onClick={enviarRespuesta}>Enviar</animated.button>
        </div>
    );
}