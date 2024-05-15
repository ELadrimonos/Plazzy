create table if not exists jugadores
(
    id_jugador     int         not null,
    id_sala        int         not null,
    nombre_jugador varchar(10) not null,
    puntuacion     int         not null,
    primary key (id_jugador),
    constraint FK_sala
        foreign key (id_sala) references salas (id_sala)
);

create index if not exists id_sala
    on jugadores (id_sala);

