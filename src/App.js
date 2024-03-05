import Index from "./componentes/MainMenu";

import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams  } from 'react-router-dom';

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

const GamePage = () => {
  // Aquí puedes acceder al parámetro gameLobbyCode
  const { gameLobbyCode } = useParams();

  // Aquí puedes hacer la conexión a la partida usando el gameLobbyCode

  return (
    <div>
      <h1>Introduce tu nombre para unirte a la partida {gameLobbyCode}</h1>
      {/* Aquí puedes poner el formulario para introducir el nombre */}
    </div>
  );
};

export default App;
