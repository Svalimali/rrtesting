import {useEffect, useRef} from "react";
import {Svg, SVG} from "@svgdotjs/svg.js";
import {defineHex, Direction, Grid, rectangle,spiral,Point,Hex} from 'honeycomb-grid';
import HexRender from "./HexRender";


const hexSize = 55;
const gridSize = 5;
const xOffset = hexSize*(gridSize+0.5)*2;
const yOffset = hexSize*(gridSize+0.5)*2;

const Tile = defineHex({ dimensions: hexSize });
const grid = new Grid(Tile, spiral({ radius: gridSize}));

function Testing() {
    const ref = useRef<null | HTMLDivElement>(null);
    const svgRef = useRef<Svg | any>(null);


    useEffect(() => {
        if (ref.current && !svgRef.current) {
            // Initialize the SVG canvas and store it in svgRef
            svgRef.current = SVG().addTo(ref.current).size('100%', '100%');
        }
        if (svgRef.current) {
            const draw = svgRef.current;
            draw.clear();
            grid.forEach((hex) => {
                const points = hex.corners.map(({x, y}) => `${x + xOffset},${y + yOffset}`).join(' ');
                draw.polygon(points).fill('transparent').stroke({width: 1, color: '#999'}).addClass('hexagon');
            });
        }
    }, []);
}

export default Testing;