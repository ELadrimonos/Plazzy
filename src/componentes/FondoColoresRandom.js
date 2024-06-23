import React, {useEffect, useMemo, useState} from 'react';
import {animated, createInterpolator, to as interpolate, useSpring} from '@react-spring/web';
import {random} from 'lodash';
import {cubicCoordinates, stepsCoordinates} from 'easing-coordinates';

const easeMap = {
    'ease-in-out': { x1: 0.42, y1: 0, x2: 0.58, y2: 1 },
    'ease-out': { x1: 0, y1: 0, x2: 0.58, y2: 1 },
    'ease-in': { x1: 0.42, y1: 0, x2: 1, y2: 1 },
    ease: { x1: 0.25, y1: 0.1, x2: 0.25, y2: 1 },
    linear: { x1: 0.25, y1: 0.25, x2: 0.75, y2: 0.75 },
};

const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;

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
                const newAttributes = {
                    from: randomColor(),
                    mid: randomColor(),
                    to: randomColor(),
                    angle: random(0, 360),
                    stops: random(2, 100),
                    easing: 'ease-in-out',
                    easeCustom: '',
                };
                setAttributes(newAttributes);
            } catch (error) {
                console.error("An error occurred while updating attributes:", error);
            }
        };

        const interval = setInterval(() => {
            regenerateAttributes();
        }, 10000);

        return () => clearInterval(interval);
    }, []);

    const { from, mid, to, angle, stops, easing, easeCustom } = attributes;

    const springValues = useSpring({
        colorFrom: from,
        colorMid: mid,
        colorTo: to,
    });

    const colorFrom = springValues.colorFrom;
    const colorMid = springValues.colorMid;
    const colorTo = springValues.colorTo;

    const coordinates = useMemo(() => {
        try {
            let coordinates;
            const customBezier = easeCustom.split(',').map(Number);
            if (customBezier.length !== 4) {
                if (easing === 'steps') {
                    coordinates = stepsCoordinates(stops, 'skip-none');
                } else {
                    const { x1, y1, x2, y2 } = easeMap[easing];
                    coordinates = cubicCoordinates(x1, y1, x2, y2, stops);
                }
            } else {
                coordinates = cubicCoordinates(customBezier[0], customBezier[1], customBezier[2], customBezier[3], stops);
            }

            return Array.from({length: stops}, (_, i) => {
                const coord = coordinates.find(c => Math.round(c.x * stops) === i);
                return coord ? [coord.x, coord.y] : [i / stops, 0];
            });
        } catch (error) {
            console.error("An error occurred while generating coordinates:", error);
            return Array.from({ length: stops }, (_, i) => [i / stops, 0]);
        }
    }, [easing, easeCustom, stops]);

    const allStops = interpolate([colorFrom, colorMid, colorTo], (from, mid, to) => {
        try {
            const blend = createInterpolator({ range: [0, 0.5, 1], output: [from, mid, to] });
            const colorStops = coordinates.map(([x, y]) => {
                const color = blend(y);
                return `${color} ${x * 100}%`;
            });
            return colorStops.join(', ');
        } catch (error) {
            console.error("An error occurred while blending colors:", error);
            return '';
        }
    });

    return (
        <animated.div
            style={{
                height: '100vh',
                width: '100vw',
                top: 0,
                position: 'absolute',
                zIndex: -1,
                backgroundImage: allStops.to(stops => `linear-gradient(${angle}deg, ${stops})`),
            }}
        />
    );
};

export default FondoColoresRandom;
