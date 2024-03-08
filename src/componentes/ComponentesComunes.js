import React, {useState, useEffect} from "react";

export function IconoJugador({nombreClase, nombre, rutaImagen}) {
    return (
        <div className={nombreClase}>
            <img src={rutaImagen} alt="icono jugador"/>
            <h4>{nombre}</h4>
        </div>);
}

export function IconoLobby({gameCode}){
    return (
        <div>
            <h3>Jackbox.tv</h3>
            <CodigoPartida gameCode={gameCode}/>
        </div>
    );
}

export function CodigoPartida({gameCode}) {
    return <h2 className="gameCode">{gameCode}</h2>
}

// onTiempoTerminado es una función que se ejecuta cuando termina
export function Contador({ tiempoInicial, onTiempoTerminado }) {
  const [tiempoActual, setTiempoActual] = useState(tiempoInicial);

  useEffect(() => {
    const contarTiempo = () => {
      if (tiempoActual > 0) {
        setTimeout(() => {
          setTiempoActual(tiempoActual - 1);
        }, 1000);
      } else {
        // Cuando el tiempo llega a cero, emitir la señal de tiempo terminado
        onTiempoTerminado();
      }
    };

    // Comenzar a contar el tiempo al cargar el componente
    contarTiempo();

    // Limpiar el temporizador al desmontar el componente
    return () => clearTimeout(contarTiempo);
  }, [tiempoActual, onTiempoTerminado]);

  return <h2>{tiempoActual}</h2>;
}
