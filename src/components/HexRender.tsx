import React, {useEffect, useRef, useState} from 'react';
import {defineHex, Direction, Grid, rectangle} from 'honeycomb-grid';
import { SVG,Svg  } from '@svgdotjs/svg.js';
import tank from './tank.png'

const Tile = defineHex({ dimensions: 50 });

const grid = new Grid(Tile, rectangle({ width: 10, height: 10 }));

function HexRender() {
    const ref = useRef<null | HTMLDivElement>(null);
    const svgRef = useRef<Svg | any>(null);
    const [currentHex, setCurrentHex] = useState({ q: 5, r: 3 });
    const [rotation, setRotation] = useState(30);
    useEffect(() => {
        if (ref.current && !svgRef.current) {
            // Initialize the SVG canvas and store it in svgRef
            svgRef.current = SVG().addTo(ref.current).size('100%', '100%');
        }
        if (svgRef.current) {
            const draw = svgRef.current;
            draw.clear();
            grid.forEach((hex) => {
                const points = hex.corners.map(({ x, y }) => `${x},${y}`).join(' '); // Adjust offset for visibility as needed
                draw.text(hex.q+","+hex.r).move(hex.x,hex.y)
                draw.polygon(points).fill('transparent').stroke({ width: 1, color: '#999' }).addClass('hexagon')
                    .mouseover(() => draw.fill({ color: '#f06' }))
                    .mouseout(() => draw.fill({ color: 'transparent' }));

                if(hex.r===currentHex.r && hex.q===currentHex.q){
                    draw.image(tank,30,30).center(hex.x-15,hex.y-15).rotate(rotation, hex.x, hex.y);
                }
            });


        }
    }, [currentHex,rotation]);
    const directionFromDegrees = (degrees: number): Direction => {
        console.log(degrees)
        const adjustedDegrees = degrees % 360;
        if (adjustedDegrees === 0) return Direction.N;
        else if (adjustedDegrees === 30) return Direction.NE;
        else if (adjustedDegrees === 90) return Direction.E;
        else if (adjustedDegrees === 150) return Direction.SE;
        else if (adjustedDegrees === 210) return Direction.SW;
        else if (adjustedDegrees === 270) return Direction.W;
        else if (adjustedDegrees === 330) return Direction.NW;
        else return Direction.W;
    };


    const moveForward = () => {
        setCurrentHex(hex => {
            const direction = directionFromDegrees(rotation);
            return grid.neighborOf(hex, direction);
        });
    };
    const rotateClockwise = () => setRotation((prevRotation) => (prevRotation + 60) % 360);
    const rotateCounterClockwise = () => setRotation((prevRotation) => (prevRotation - 60 + 360) % 360);


    return (<>
        <style>
            {`
                    .hexagon {
                        
                        stroke-width: 1;
                        stroke: #999;
                        fill: none;
                        pointer-events: visible;
                        
                    }
                    .hexagon:hover {
                        fill: #f06; /* Change as desired */
                        
                    }
                `}
        </style>
        <button onClick={rotateCounterClockwise} style={{margin: '20px'}}>Rotate Left</button>
        <button onClick={moveForward} style={{margin: '20px'}}>Move Forward</button>
        <button onClick={rotateClockwise} style={{margin: '20px'}}>Rotate Right</button>
        <div ref={ref} style={{width: '100vh', height: '100vh'}}></div>


    </>);
}

export default HexRender;
