create table juegos
(
    id_juego      int auto_increment
        primary key,
    nombre        varchar(20)   not null,
    min_jugadores int default 3 not null,
    max_jugadores int default 8 not null
);

INSERT INTO plazzy.juegos (id_juego, nombre, min_jugadores, max_jugadores) VALUES (0, 'QUIPLASH', 3, 8);
