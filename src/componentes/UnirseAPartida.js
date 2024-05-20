import React, { useState, useEffect } from "react";
import styles from '../css/unirseJuego.module.css';
import { useNavigate, useParams } from "react-router-dom";
import Index from "./MainMenu";

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
        <h1 className={styles.plazzyTitle}>PLAZZY</h1>
        <form className={styles.container}>
          <h2>Introduce tu nombre para unirte a la partida:<br /> <span className={styles.gameCode}>{gameLobbyCode}</span></h2>
          <input className={styles.nameInput} required={true} type="text" onChange={e => setPlayerName(e.target.value)} maxLength={10} />
          <button className={styles.buttonEnter} onClick={handleNameChange}>Entrar a la partida </button>
        </form>
      </div>
    );
  } else {
    return <Index gameCodeRef={gameLobbyCode} playerRef={playerName} />;
  }
};

export default GamePage;
