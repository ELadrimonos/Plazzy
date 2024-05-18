import React, { useEffect, useRef } from "react";
import { useGLTF, Stage, useAnimations } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

const ModeloJugador = ({ modeloPath, animationName, position }) => {
  const { scene, animations } = useGLTF(modeloPath);
  const { actions } = useAnimations(animations, scene);
  const meshRef = useRef();

  useEffect(() => {
    function restoreContext() {
      const canvas = document.querySelector('canvas');
      canvas.addEventListener(
        'webglcontextlost',
        function (event) {
          event.preventDefault();
          setTimeout(function () {
            canvas.getContext('webgl', {preserveDrawingBuffer: true});
          }, 1);
        },
        false
      );
    }
    restoreContext();

    const action = actions[animationName];
    if (action) {
      action.play();
    }
  }, [animationName, actions]);

  useFrame(() => {
    // This is where you can update animations or perform other per-frame logic
  });

  return (
    <Stage environment={null}>
      <primitive object={scene} scale={[0.2, 0.2, 0.2]} position={position} ref={meshRef} />
    </Stage>
  );
};

export default ModeloJugador;
