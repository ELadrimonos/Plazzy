create table jugadores
(
    id_jugador     varchar(50) not null,
    id_sala        varchar(50) not null,
    nombre_jugador varchar(10) not null,
    puntuacion     int         not null,
    primary key (id_jugador, id_sala),
    constraint fk_JugadorSala
        foreign key (id_sala) references salas (id_sala)
);

