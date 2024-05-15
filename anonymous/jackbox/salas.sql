create table if not exists salas
(
    id_sala       int auto_increment
        primary key,
    codigo_sala   char(4)     not null,
    num_jugadores int         not null,
    nombre_juego  varchar(50) not null
);

