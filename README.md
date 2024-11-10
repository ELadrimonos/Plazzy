# Plazzy
[![wakatime](https://wakatime.com/badge/user/90f48023-a4b3-46db-a768-5df0bf02bac6/project/018c6549-dde6-44dc-9324-78cb8d89a89d.svg)](https://wakatime.com/badge/user/90f48023-a4b3-46db-a768-5df0bf02bac6/project/018c6549-dde6-44dc-9324-78cb8d89a89d)

## Documentación

- [Documentación del proyecto (Word)](Primo_Bernat_Adrian_2324_CFSW.docx)
- [Presentación del proyecto (Powerpoint)](PresentacionPlazzy.pptx)

## Descripción

Plazzy es una plataforma online de juegos sociales que permiten hasta ocho jugadores en una misma sala jugar a un modo de juego disponible, al estilo Jackbox Games.

Guarda el historial de partidas jugadas en una base de datos MySQL donde se puede obtener datos importantes ocurridos en la partida como respuestas y votaciones de jugadores.

Previamente alojado en https://plazzy.es.

Tecnologías utilizadas:

- React:

  - Single Page Application.

  - Reutilización de componentes, un ejemplo es una clase de React llamada Juego utilizada para crear modos de juego con lógica de cambio de pantallas y de manejo de jugadores ya heredados.

  - Animaciones usando la librería de React Spring.

- WebSockets:

  - Librería Socket.IO.

  - Permite una comunicación bidireccional y basada en eventos entre un cliente y servidor.

- ThreeJS:

  - Carga de modelos de jugadores 3D creados en Blender.

- NodeJS:

  - Express, API y enrutamiento.

  - Servidor WebSocket.

- Azure:

  - Web App para alojamiento web con dominio web personalizado con su certificado SSL.

  - Base de Datos para almacenar información de salas, jugadores, rondas.

## Requisitos
- Base de datos con la estructura encontrada en /anonymous/plazzy
- NodeJS: ejecutar el archivo /src/scripts/server.js
- Crear archivo .env concorde con la plantilla y rellenar los datos
