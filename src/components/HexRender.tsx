import React, {useEffect, useRef, useState} from 'react';
import {defineHex, Direction, Grid, rectangle,spiral,Point,Hex} from 'honeycomb-grid';
import { SVG,Svg  } from '@svgdotjs/svg.js';
import tank from './tank.png'
import GameControlPanel from "./GameControlPanel";
import Cards from "./Cards";
import { Center } from '@chakra-ui/react';

interface Hand {
    cards: Card[];
}
interface Card {
    id: number;
    cardType: string;
}

const hexSize = 55;
const gridSize = 5;
const xOffset = hexSize*(gridSize+0.5)*2;
const yOffset = hexSize*(gridSize+0.5)*2;

const imgSize = 30;
const Tile = defineHex({ dimensions: hexSize });
const grid = new Grid(Tile, spiral({ radius: gridSize}));
interface Robot {
    position: { r: number; q: number };
    q: number;
    r: number;
    robotId: string;
    id:string;
    direction: number;
}

interface GameState {
    boardRadius: number;
    current_game_state: Robot[];
}
interface Move {
    q: number;
    r: number;
    direction: number;
}

interface Movement {
    moves: Move[];
    turn: number;
}

interface GameStateHistoryItem {
    movements: Movement[];
    id: string;
}

interface ApiResponse {
    shot_history: any[]; // Adjust the type based on the actual structure of shot_history items
    boardRadius: number;
    game_state_history: GameStateHistoryItem[];
}







function HexRender() {

    const exampleHand: Hand = {
        cards: [
            { id: 1, cardType:'FORWARD_ONE'},
            { id: 2, cardType:'FORWARD_TWO'},
            { id: 3, cardType:'FORWARD_THREE'},
            { id: 4, cardType:'TURN_LEFT_ONE'},
            { id: 5, cardType:'TURN_LEFT_TWO'},
            { id: 6, cardType:'TURN_RIGHT_ONE'},
            { id: 7, cardType:'TURN_RIGHT_TWO'},
            { id: 8, cardType:'TURN_180'}
        ],
    };

    const ref = useRef<null | HTMLDivElement>(null);
    const svgRef = useRef<Svg | any>(null);

    const [gameState, setGameState] = useState<GameState | null>(null);
    const [gameHistory, setGameHistory] = useState<ApiResponse | null>(null);

    const fetchGameState = async () => {
        const response = await fetch('http://localhost:8080/game/currentState');
        const data: GameState = await response.json();
        setGameState(data);
    };

    const fetchGameHistory = async (): Promise<void> => {
        try {
            const response = await fetch('http://localhost:8080/game/getGameStateHistory');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data: ApiResponse = await response.json();
            setGameHistory(data);

            // Example usage of the typed data
            console.log(data.boardRadius);
            data.game_state_history.forEach((item) => {
                console.log(`Player ID: ${item.id}`);
                item.movements.forEach((movement, index) => {
                    console.log(`Movement ${index} has ${movement.moves.length} moves`);
                });
            });
        } catch (error) {
            console.error('Failed to fetch game history:', error);
        }
    };

    useEffect(() => {
        fetchGameState();
        fetchGameHistory();
    }, []);

    useEffect(() => {
        if (ref.current && !svgRef.current) {
            // Initialize the SVG canvas and store it in svgRef
            svgRef.current = SVG().addTo(ref.current).size('100%', '100%');
        }
        if (svgRef.current) {
            const draw = svgRef.current;
            draw.clear();
            grid.forEach((hex) => {
                const points = hex.corners.map(({ x, y }) => `${x+xOffset},${y+xOffset}`).join(' ');
                draw.text(hex.q+","+hex.r).move(hex.x+xOffset,hex.y+yOffset)
                draw.polygon(points).fill('transparent').stroke({ width: 1, color: '#999' }).addClass('hexagon');

                /*console.log(hex.q + ", " + hex.r)
                console.log(hex.x + ", " + hex.y)

                console.log(gameState);*/
                if(gameState){
                    gameState.current_game_state.forEach((robot) => {
                    if (hex.r === robot.r && hex.q === robot.q) {
                        /*const bot = */draw.image(tank, imgSize, imgSize).move(hex.x + xOffset-imgSize/2, hex.y + yOffset-imgSize/2).rotate(robot.direction, hex.x + xOffset, hex.y + yOffset);

                        /*bot.animate(1000).move(hex.x + xOffset-imgSize/2, hex.y + yOffset-imgSize/2).after(() => {
                            bot.animate(2000).rotate(robot.direction, hex.x + xOffset, hex.y + yOffset)
                        })/!*.rotate(robot.direction, hex.x + xOffset, hex.y + yOffset);*!/
                        draw.text(robot.id).move(hex.x+xOffset,hex.y+yOffset-imgSize)
                        console.log(robot.id)
                        console.log("hex.q:"+hex.q)
                        console.log("hex.r:"+hex.r)
                        // @ts-ignore
                        console.log(bot.transform())
                        console.log("hex.x + xOffset-imgSize/2, hex.y + yOffset-imgSize/2: " + (hex.x + xOffset-imgSize/2)+","+ ( hex.y + yOffset-imgSize/2))*/

                    }
                });}


            });
            /*if (gameHistory) {
                gameHistory.game_state_history.forEach((item) => {
                    item.movements.forEach((movement, index) => {
                        const initialHex = grid.getHex([movement.moves[0].q, movement.moves[0].r]);
                        // @ts-ignore
                        let tankAnimation;
                        if (initialHex) {
                            // Initialize the tank animation with the first move
                            tankAnimation = draw.image(tank, imgSize, imgSize)
                                .move(initialHex.x + xOffset - imgSize / 2, initialHex.y + yOffset - imgSize / 2)
                                .rotate(movement.moves[0].direction, initialHex.x + xOffset, initialHex.y + yOffset);
                            // @ts-ignore
                            console.log(tankAnimation.transform())


                        }

                        console.log(`Movement ${index} has ${movement.moves.length} moves`);
                        if (tankAnimation) {
                            // Start with no delay for the first animation step
                            let cumulativeDelay = 0;

                            movement.moves.forEach((move, moveIndex) => {
                                if (moveIndex === 0) {
                                    // Skip animation for the first move since it's already set for initial position & rotation
                                    return;
                                }
                                const nextHex = grid.getHex([move.q, move.r]);
                                if (nextHex) {
                                    // @ts-ignore
                                    console.log(tankAnimation.transform())
                                    cumulativeDelay += 1000; // Increment delay for each move

                                    /!*draw.image(tank, imgSize, imgSize).move(nextHex.x + xOffset-imgSize/2, nextHex.y + yOffset-imgSize/2).rotate(move.direction, nextHex.x + xOffset, nextHex.y + yOffset);*!/
                                    // Animate to the next hex position
                                    // @ts-ignore


                                    // @ts-ignore
                                    tankAnimation.animate(1000).move(nextHex.x + xOffset, nextHex.y + yOffset).after(() => {
                                        // @ts-ignore
                                        tankAnimation.animate(1000).rotate(move.direction);
                                    });

                                }
                            });
                        }
                    });
                });
            }*/




            const pointA = grid.getHex([0, -4]);
            const pointB = grid.getHex([0, 0])


            // @ts-ignore
            const shot = draw.circle(10).fill('red').move(pointA.x + xOffset, pointA.y + yOffset);
            const group = draw.group();

            // @ts-ignore
            shot.animate(1000).move(pointB.x + xOffset, pointB.y + yOffset).after(() => {
                shot.remove();
                // @ts-ignore
                const explosion = group.circle(30).fill('orange').move(pointB.x - 10 + xOffset, pointB.y - 10 + yOffset);
                explosion.animate(1000, 500, 'absolute').attr({ r: 0, opacity: 0 }).after(() => {
                    explosion.remove();
                });
            });


        }
    }, [gameState]);





    // @ts-ignore

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
        <Center>
        {/*<GameControlPanel refreshGameState={fetchGameState}/>*/}
        <div ref={ref} style={{width: '120vh', height: '120vh'}}></div>
        {/*// @ts-ignore*/}
        <Cards hand ={exampleHand} refreshGamestate={fetchGameState}/>
        </Center>


    </>);
}

export default HexRender;
