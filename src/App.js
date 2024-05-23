import Index from "./componentes/MainMenu";
import GamePage from "./componentes/UnirseAPartida";
import './scripts/cliente.js';
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/game/:gameLobbyCode" element={<GamePage />} />
      </Routes>
    </Router>
  );
};



export default App;
