import React, { useState } from 'react';
import { Flex, Box, Button } from '@chakra-ui/react';

// Keeping the interfaces as they are but repurposing the 'highlighted' property.
interface Card {
    id: number;
    cardType: string;
}

interface Hand {
    cards: Card[];
}

type CardProps = {
    highlighted: boolean;
    onClick: () => void;
    cardType: string;

};

type CardHandProps={
    refreshGamestate: () => void;
    hand: Hand;
};

const CardComponent: React.FC<CardProps> = ({ highlighted, onClick, cardType }) => {
    return (
        <Box
            onClick={onClick}
            w="130px"
            h="30px"
            bg="white"
            borderWidth="2px"
            borderStyle="solid"
            borderColor={highlighted ? "blue.500" : "gray.400"} // Differentiate selected cards
            cursor="pointer"
            display="flex"
            alignItems="center"
            justifyContent="center"
            _hover={{
                bg: "yellow",
            }}
        >
            {cardType}
        </Box>
    );
};

const Cards: React.FC<CardHandProps> = ({ hand ,refreshGamestate}) => {
    const [cards, setCards] = useState(hand.cards.map(card => ({
        ...card,
        highlighted: false
    })));

    const [selectedOrder, setSelectedOrder] = useState<number[]>([]);

    const toggleSelection = (id: number) => {
        const isCurrentlySelected = cards.find(card => card.id === id)?.highlighted;
        const selectedCount = cards.filter(card => card.highlighted).length;

        if (!isCurrentlySelected && selectedCount >= 5) {
            // If trying to select a new card and 5 cards are already selected, do nothing
            return;
        }

        setCards(cards.map(card => {
            if (card.id === id) {
                return { ...card, highlighted: !card.highlighted };
            }
            return card;
        }));

        setSelectedOrder(prevOrder => {
            const index = prevOrder.indexOf(id);
            if (index >= 0) {
                // Remove card from selectedOrder if it's already selected
                return [...prevOrder.slice(0, index), ...prevOrder.slice(index + 1)];
            } else {
                // Add card to selectedOrder if it's not selected and limit is not exceeded
                return prevOrder.length < 5 ? [...prevOrder, id] : prevOrder;
            }
        });
    };

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
        } catch (error) {
            console.error(`Failed to request ${url}:`, error);
        }

    };

    const playSelectedCards = () => {
        // Filter out the highlighted cards and extract their cardTypes
        const selectedCardTypes = cards.filter(card => card.highlighted)
            .map(card => card.cardType)
            .reverse(); // Reverse the order

        console.log("Selected card types to send:", selectedCardTypes);

        // Call the API with the prepared list of cardTypes
        console.log(selectedCardTypes)
        handleAPIRequest('http://localhost:8080/game/postMoves?playerId=R1', selectedCardTypes);
        /*handleAPIRequest('http://localhost:8080/game/postMoves?playerId=R2', selectedCardTypes);
        handleAPIRequest('http://localhost:8080/game/postMoves?playerId=R3', selectedCardTypes);
        handleAPIRequest('http://localhost:8080/game/postMoves?playerId=R4', selectedCardTypes);*/
        refreshGamestate();



    };

    return (
        <Flex direction="column" align="center" m="4">
            <Flex wrap="wrap" justify="center" mb="4">
                {/* Display "empty" cards based on selectedOrder */}
                {selectedOrder.map((id, index) => {
                    const card = cards.find(card => card.id === id);
                    return card ? (
                        <CardComponent
                            key={`selected-${index}`}
                            highlighted={true}
                            onClick={() => toggleSelection(card.id)}
                            cardType={card.cardType}
                        />
                    ) : null;
                })}
                {Array.from({ length: 5 - selectedOrder.length }).map((_, index) => (
                    <CardComponent
                        key={`empty-${index}`}
                        highlighted={false}
                        onClick={() => {}}
                        cardType={`${index + 1}`}
                    />
                ))}
            </Flex>
            <Flex wrap="wrap" justify="center">
                {/* Filter out the selected cards for display */}
                {cards.filter(card => !card.highlighted).map((card) => (
                    <CardComponent
                        key={card.id}
                        highlighted={false}
                        onClick={() => toggleSelection(card.id)}
                        cardType={card.cardType}
                    />
                ))}
            </Flex>
            <Button colorScheme="blue" onClick={playSelectedCards} mt="4">
                PLAY SELECTED CARDS
            </Button>
        </Flex>
    );
};

export default Cards;
