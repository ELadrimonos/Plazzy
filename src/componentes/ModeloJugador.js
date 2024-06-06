import React, { useEffect, useRef } from "react";
import { useGLTF, Stage, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const ModeloJugador = ({ modeloPath, animationName, bloquearRespuestas }) => {
  const { scene, animations } = useGLTF(modeloPath);
  const { actions } = useAnimations(animations, scene);
  const meshRef = useRef();

  useEffect(() => {
    function restoreContext() {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        canvas.addEventListener(
          'webglcontextlost',
          function (event) {
            event.preventDefault();
            setTimeout(() => {
              canvas.getContext('webgl', { preserveDrawingBuffer: true });
            }, 1);
          },
          false
        );
      }
    }
    restoreContext();

    if (!bloquearRespuestas && actions && animationName && actions[animationName]) {
      actions[animationName].play();
    } else {
      // Detener todas las animaciones si bloquearRespuestas es true
      Object.values(actions).forEach(action => action.stop());
    }
  }, [actions, animationName, bloquearRespuestas]);

  useFrame(() => {
    // Aquí puedes actualizar animaciones u otras lógicas por cuadro
  });

  return (
    <Stage environment={null} receiveShadow={false}>
      <primitive object={scene} scale={[0.2, 0.2, 0.2]} ref={meshRef} />
    </Stage>
  );
};

export default ModeloJugador;
