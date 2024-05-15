create database if not exists plazzy;

use plazzy;

create table if not exists salas
(
    id_sala       int auto_increment
        primary key,
    codigo_sala   char(4)     not null,
    num_jugadores int         not null,
    nombre_juego  varchar(50) not null
);

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

create table if not exists answers
(
    round        int          not null,
    lobby_id     int          not null,
    player_id    int          not null,
    answer_order int          not null,
    text         varchar(100) not null,
    primary key (round, lobby_id, player_id, answer_order),
    constraint fk_LobbyAnswer
        foreign key (lobby_id) references salas (id_sala),
    constraint fk_PlayerAnswer
        foreign key (player_id) references jugadores (id_jugador)
);

create index if not exists id_sala
    on jugadores (id_sala);

create table if not exists prompts
(
    round        int          not null,
    lobby_id     int          not null,
    player_id    int          not null,
    prompt_order int          not null comment 'El orden de aparición del prompt',
    text         varchar(100) not null,
    primary key (round, player_id, lobby_id, prompt_order),
    constraint fk_PlayerPrompt
        foreign key (player_id) references jugadores (id_jugador),
    constraint prompts_salas_id_sala_fk
        foreign key (lobby_id) references salas (id_sala)
);

