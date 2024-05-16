create table salas
(
    id_sala      varchar(50) not null
        primary key,
    id_modoJuego int         not null,
    codigo_sala  char(4)     not null,
    constraint fk_JuegoSala
        foreign key (id_modoJuego) references juegos (id_juego)
);

