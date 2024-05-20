import React, { useState, useEffect } from 'react';
import { useSpring, animated, to as interpolate, createInterpolator } from '@react-spring/web';
import { random } from 'lodash';
import { cubicCoordinates, stepsCoordinates } from 'easing-coordinates';

const easeMap = {
  'ease-in-out': { x1: 0.42, y1: 0, x2: 0.58, y2: 1 },
  'ease-out': { x1: 0, y1: 0, x2: 0.58, y2: 1 },
  'ease-in': { x1: 0.42, y1: 0, x2: 1, y2: 1 },
  ease: { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 },
  linear: { x1: 0.25, y1: 0.25, x2: 0.75, y2: 0.75 },
};

const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

const FondoColoresRandom = () => {
  const [attributes, setAttributes] = useState({
    from: randomColor(),
    mid: randomColor(),
    to: randomColor(),
    angle: random(0, 360),
    stops: random(2, 100),
    easing: 'ease-in-out',
    easeCustom: '',
  });

  useEffect(() => {
    const regenerateAttributes = () => {
      try {
        setAttributes(prevAttributes => ({
          ...prevAttributes,
          from: randomColor(),
          mid: randomColor(),
          to: randomColor(),
          angle: random(0, 360),
          stops: random(2, 100),
          easing: 'ease-in-out',
          easeCustom: '',
        }));
      } catch (error) {
        console.error("An error occurred while updating attributes:", error);
      }
    };

    const interval = setInterval(() => {
      regenerateAttributes();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const { from, mid, to, angle, stops, easing, easeCustom } = attributes;

  const { colorFrom, colorMid, colorTo } = useSpring({
    colorFrom: from,
    colorMid: mid,
    colorTo: to,
  });

  const coordinates = React.useMemo(() => {
    let coordinates;
    const customBezier = easeCustom.split(',').map(Number);
    if (customBezier.length <= 1) {
      if (easing === 'steps') {
        coordinates = stepsCoordinates(stops, 'skip-none');
      } else {
        const { x1, y1, x2, y2 } = easeMap[easing];
        coordinates = cubicCoordinates(x1, y1, x2, y2, stops);
      }
    } else {
      coordinates = cubicCoordinates(customBezier[0], customBezier[1], customBezier[2], customBezier[3], stops);
    }

    // Asegurar que cada coordenada tenga exactamente 2 valores (posición y valor interpolado)
    const fullCoordinates = new Array(stops).fill(null).map((_, i) => {
      const coord = coordinates.find(c => Math.round(c.x * stops) === i);
      return coord ? [coord.x, coord.y] : [i / stops, 0];
    });

    return fullCoordinates;
  }, [easing, easeCustom, stops]);

  const allStops = interpolate([colorFrom, colorMid, colorTo], (from, mid, to) => {
    const blend = createInterpolator({ range: [0, 0.5, 1], output: [from, mid, to] });

    return coordinates.map(([x, y]) => {
      const color = blend(y);

      return `${color} ${x * 100}%`;
    });
  });

  return (
    <animated.div
      style={{
        height: '100vh',
        width: '100vw',
        top: 0,
        position: 'absolute',
        zIndex: -1,
        backgroundImage: allStops.to((...args) => `linear-gradient(${angle}deg, ${args.join(', ')})`),
      }}
    />
  );
};

export default FondoColoresRandom;
