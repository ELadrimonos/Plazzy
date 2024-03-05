import React, { useState } from 'react';
import styles from '../css/menuPrincipal.module.css';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import { useSpring, animated } from '@react-spring/web'
import Chatbot from "./juegos/Chatbot";
// import Quiplash from "./juegos/Quiplash";

// TODO Refactorizar estilos por clases del styles


// Cambiar por iconos de los juegos
function FondoTresD() {
  const canvasRef = React.useRef();

  React.useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current });
   const geometry = new THREE.BoxGeometry(100, 100, 100);
    const textureLoader = new THREE.TextureLoader();
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });
    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    camera.position.z = 5;
    let textMesh; // Definimos textMesh aquí

    const fontLoader = new FontLoader();
    fontLoader.load('https://cdn.jsdelivr.net/gh/mrdoob/three.js/examples/fonts/helvetiker_regular.typeface.json', function(font) {
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

      const material = new THREE.MeshBasicMaterial({ color: 0x000000 });
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

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, zIndex: -1 }} />;
}

function CrearPartida({ volverAlMenu }) {
    const springs = useSpring({
    from: { x: -1000 },
    to: { x: 0 },
  })

  const [showMenu, setShowMenu] = useState(true);


    const handleSubmit = (event) => {
    event.preventDefault();
    setShowMenu(false); // Cambiar el estado para ocultar el menú de creación de partida
    // Aquí puedes agregar lógica para manejar la creación de la partida
  };

    if (showMenu) {
    return (
      <animated.section id="menuCrearPartida" style={{...springs,}}>
        <fieldset id="crearPartidaForm">
          <legend>Crear Partida</legend>
          <form onSubmit={handleSubmit}>
            <label htmlFor="nombreHost">Nombre: </label>
            <input type="text" name="username" id="nombreHost" required />
            <label htmlFor="modoDeJuego">Modo de juego: </label>
            <select name="juego" id="modoDeJuego">
              <option value="quiplash" defaultValue={true}>Quiplash</option>
              <option value="chatbot">Chatbot</option>
            </select>
            <input type="submit" value="Crear" id="crearPartida" />
          </form>
        </fieldset>
        <button onClick={volverAlMenu}>Unirse a partida</button>
      </animated.section>
    );
  } else {
    // Aquí puedes renderizar la siguiente pantalla después de enviar el formulario
    return <Chatbot />;
  }

}

function MenuPrincipal({menuCrear}) {
    const springs = useSpring({
        from: {x: -1000},
        to: {x: 0},
    })
    return (
        <animated.section style={{...springs,}} id="menuPrincipal">
            <fieldset id="joinGame">
                <legend>Unirse A Partida</legend>
                <form>
                    <label htmlFor="nombreJugador">Nombre: </label>
                    <input type="text" name="username" id="nombreJugador" required/>
                    <label htmlFor="gameCode">Código partida: </label>
                    <input type="text" name="code" id="gameCode" minLength="4" maxLength="4" required/>
                    <input type="submit" value="Unirse" id="unirsePartida"/>
                </form>
            </fieldset>
            <button onClick={menuCrear}>Crear partida</button>
        </animated.section>
    );
}


function Index() {
    const [mostrarCrearPartida, setMostrarCrearPartida] = useState(false);

    const mostrarCrearPartidaHandler = () => {
        setMostrarCrearPartida(true);
    };

    const volverAlMenuHandler = () => {
        setMostrarCrearPartida(false);
    };

    return (
        <>
            <FondoTresD/>
            <header>
                <h1>plazzy</h1>
            </header>
            <main>


                {!mostrarCrearPartida && <MenuPrincipal menuCrear={mostrarCrearPartidaHandler} />}
                {mostrarCrearPartida && <CrearPartida volverAlMenu={volverAlMenuHandler} />}
            </main>
        </>
    );
}

export default Index;
