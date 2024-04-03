import React from 'react';
import './App.css';
import HexRender from "./components/HexRender";
import Cards from "./components/Cards";
import {Center, Box, VStack} from '@chakra-ui/react';
interface Hand {
    cards: Card[];
    refreshGamestate: ()=>void;
}
interface Card {
    id: number;
    cardType: string;
}

function App() {
    /*const exampleHand: Hand = {
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
    };*/

  return (
      <Center>



              <HexRender/>

          {/*<Cards hand ={exampleHand} />*/}

      </Center>

  );
}

export default App;
