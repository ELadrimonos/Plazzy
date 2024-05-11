import React, { useState, useEffect } from "react";
import styles from '../css/unirseJuego.module.css';
import { useNavigate, useParams } from "react-router-dom";
import Index from "./MainMenu";
import { socket } from "../scripts/cliente";

const GamePage = () => {
  const { gameLobbyCode } = useParams();
  const [isNameSet, setIsNameSet] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Almacena la última ruta visitada en el almacenamiento local
    localStorage.setItem('lastVisitedRoute', window.location.pathname);

    // Comprueba si es una recarga de página
    const isPageReload = performance.navigation.type === performance.navigation.TYPE_RELOAD;

    // Redirige a la ruta raíz si es una recarga de página
    if (isPageReload) {
      navigate('/');
    }
  }, [navigate]);

  function handleNameChange() {
    if (playerName !== "") {
      setIsNameSet(true);
    }
  }

  if (!isNameSet) {
    return (
      <div className={styles.raiz}>
        <div className={styles.container}>
          <h1>Introduce tu nombre para unirte a la partida:<br /> <span>{gameLobbyCode}</span></h1>
          <input type="text" onChange={e => setPlayerName(e.target.value)} />
          <button onClick={handleNameChange}>Entrar a la partida </button>
        </div>
      </div>
    );
  } else {
    return <Index gameCodeRef={gameLobbyCode} playerRef={playerName} />;
  }
};

export default GamePage;
