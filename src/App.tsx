import React from 'react';
import './App.css';
import HexRender from "./components/HexRender";
import {Center, Box, VStack} from '@chakra-ui/react';

function App() {

  return (
      <Center>
          <VStack></VStack>

          <Box pt="30">
              <HexRender/>
          </Box>
      </Center>

  );
}

export default App;
