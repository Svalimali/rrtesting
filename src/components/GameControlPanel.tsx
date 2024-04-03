import React, { useEffect, useState } from 'react';
import { Button, VStack, HStack, Input, FormControl, FormLabel, NumberInput, NumberInputField } from '@chakra-ui/react';

interface Robot {
    robotId: string;
}

interface GameState {
    robots: Robot[];
}

// @ts-ignore
const GameControlPanel = ({ refreshGameState }) => {
    const [gameState, setGameState] = useState<GameState>({ robots: [] });
    const [activePlayer, setActivePlayer] = useState<string | null>(null);
    const [newRobot, setNewRobot] = useState({ id: '', direction: 30, position: { q: 0, r: 0 } });
    const [boardSize, setBoardSize] = useState(0);

    useEffect(() => {
        const fetchGameState = async () => {
            try {
                const response = await fetch('http://localhost:8080/game/gameState');
                const data: GameState = await response.json();
                setGameState(data);
            } catch (error) {
                console.error('Failed to fetch game state:', error);
            }
        };
        console.log(activePlayer)

        fetchGameState();
    }, [activePlayer,newRobot]);

    const handleAPIRequest = async (url: string, body: any) => {
        try {
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'accept': '*/*',
                },
                body: JSON.stringify(body),
            });
            refreshGameState(); // Refresh game state after the API request
        } catch (error) {
            console.error(`Failed to request ${url}:`, error);
        }
    };

    return (
        <VStack spacing={4}>
            <HStack spacing={4}>
                {gameState.robots.map((robot) => (
                    <Button key={robot.robotId} colorScheme="teal" onClick={() => setActivePlayer(robot.robotId)}>
                        {robot.robotId}
                    </Button>
                ))}
            </HStack>
            <HStack spacing={4}>
                <Button colorScheme="orange" onClick={() => handleAPIRequest(`http://localhost:8080/game/turnRobot?robotId=${activePlayer}&rotation=-60`,"")}>Turn left</Button>
                <Button colorScheme="green" onClick={() => handleAPIRequest(`http://localhost:8080/game/moveRobotForward?robotId=${activePlayer}&numberOfTiles=1`, "")}>Move forward</Button>
                <Button colorScheme="orange" onClick={() => handleAPIRequest(`http://localhost:8080/game/turnRobot?robotId=${activePlayer}&rotation=60`, "")}>Turn right</Button>
            </HStack>
            <VStack spacing={4}>
                <FormControl>
                    <FormLabel>Add Robot</FormLabel>
                    <Input placeholder="Player ID" value={newRobot.id} onChange={(e) => setNewRobot({ ...newRobot, id: e.target.value })} />
                    <NumberInput defaultValue={30} min={0} max={360} onChange={(value) => setNewRobot({ ...newRobot, direction: parseInt(value) })}>
                        <NumberInputField placeholder="Direction" />
                    </NumberInput>
                    <Input placeholder="Q Position" type="number" onChange={(e) => setNewRobot({ ...newRobot, position: { ...newRobot.position, q: parseInt(e.target.value) } })} />
                    <Input placeholder="R Position" type="number" onChange={(e) => setNewRobot({ ...newRobot, position: { ...newRobot.position, r: parseInt(e.target.value) } })} />
                    <Button colorScheme="blue" onClick={() => handleAPIRequest('http://localhost:8080/game/addRobot', newRobot)}>Add Robot</Button>
                </FormControl>
                <FormControl>
                    <FormLabel>Initialize Board</FormLabel>
                    <NumberInput defaultValue={0} min={0} onChange={(value) => setBoardSize(parseInt(value))}>
                        <NumberInputField placeholder="Board Size" />
                    </NumberInput>
                    <Button colorScheme="purple" onClick={() => handleAPIRequest('http://localhost:8080/game/initializeBoard', boardSize)}>Initialize Board</Button>
                </FormControl>
                <Button colorScheme="red" onClick={() => handleAPIRequest('http://localhost:8080/game/reset', {})}>Reset Game</Button>
            </VStack>
        </VStack>
    );
};

export default GameControlPanel;
