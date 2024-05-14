import React, {useEffect, useRef} from "react";
import { Canvas } from "@react-three/fiber";
import {useGLTF, Stage, useAnimations, OrthographicCamera} from "@react-three/drei";

const ModeloJugador = ({ modeloPath, animationName }) => {
  return (
    <Canvas style={{ width: '200px', height: '200px' }} key={modeloPath + '_' + animationName + '_canvas_' + Math.random()}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} />
<OrthographicCamera makeDefault position={[0, 0, 100]} zoom={0} />

      <PlayerMesh modeloPath={modeloPath} animationName={animationName} />
    </Canvas>
  );
};

const PlayerMesh = ({ modeloPath, animationName }) => {
  const { scene, animations } = useGLTF(modeloPath);
  const { actions } = useAnimations(animations, scene);
  const meshRef = useRef();

  // Ejecutar la animación al cargar el componente
  useEffect(() => {
    const action = actions[animationName];
    if (action) {
      action.play();
    }
  }, [actions, animationName]);

  return (
    <Stage environment={null} key={modeloPath + '_' + animationName + '_stage_' + Math.random()}>
      <primitive object={scene} scale={0.2} ref={meshRef} key={modeloPath + '_' + animationName + '_mesh_' + Math.random()} />
    </Stage>
  );
};

export default ModeloJugador;
