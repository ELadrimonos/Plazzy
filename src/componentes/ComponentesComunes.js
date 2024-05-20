import React, {useState, useEffect} from "react";

export function IconoJugador({nombreClase, nombre, rutaImagen, style}) {
    return (
        <div className={nombreClase} style={style}>
            <img src={rutaImagen} alt="icono jugador"/>
            <h4>{nombre}</h4>
        </div>);
}

export function IconoLobby({gameCode}){
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

export function Contador({className, tiempoInicial, onTiempoTerminado }) {
  const [tiempoActual, setTiempoActual] = useState(tiempoInicial);

  useEffect(() => {
    let intervalo;

    const contarTiempo = () => {
      if (tiempoActual > 0) {
        intervalo = setInterval(() => {
          setTiempoActual(tiempo => tiempo - 1);
        }, 1000);
      } else {
        // Cuando el tiempo llega a cero, emitir la señal de tiempo terminado
          if (onTiempoTerminado !== undefined) {
            onTiempoTerminado();

          }
        clearInterval(intervalo);
      }
    };

    // Comenzar a contar el tiempo al cargar el componente
    contarTiempo();

    // Limpiar el intervalo al desmontar el componente
    return () => clearInterval(intervalo);
  }, [tiempoActual, onTiempoTerminado]);

  return <h2 className={className}>{tiempoActual}</h2>;
}

export function InputRespuestaLimitado({socket, playerID, gameCode, onHandleSubmitRef ,styles, maxLength = 30}) {
    const [respuesta, setRespuesta] = useState('');

    function enviarRespuesta() {
        socket.emit('playerAnswer', gameCode, playerID, respuesta);
        onHandleSubmitRef();
        setRespuesta('');
    }

    return (
        <div className={styles.answerInput}>
        <h2>{respuesta.length}/30</h2>
    <input
        type="text"
        value={respuesta}
        maxLength={maxLength}
        onChange={e => setRespuesta( e.target.value)}
    />
    <button onClick={enviarRespuesta}>Enviar</button>
            </div>
    );
}