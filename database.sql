create table if not exists juegos
(
    id_juego      int auto_increment
        primary key,
    nombre        varchar(20)   not null,
    min_jugadores int default 3 not null,
    max_jugadores int default 8 not null
);

create table if not exists prompts
(
    id_prompt int                            not null,
    id_juego  int                            not null,
    text      varchar(100)                   null,
    idioma    enum ('ES', 'EN') default 'ES' not null,
    primary key (id_prompt, id_juego, idioma),
    constraint fk_juego_prompts
        foreign key (id_juego) references juegos (id_juego)
);

create table if not exists respuestas_emergencia
(
    id_answer int                            not null,
    id_prompt int                            not null,
    text      varchar(30)                    null,
    idioma    enum ('ES', 'EN') default 'ES' not null,
    primary key (id_answer, id_prompt, idioma),
    constraint safety_answers_prompts_id_prompt_fk
        foreign key (id_prompt) references prompts (id_prompt)
            on update cascade on delete cascade
);

create table if not exists salas
(
    id_sala      varchar(50) not null,
    id_modoJuego int         not null,
    codigo_sala  char(4)     not null,
    primary key (id_sala),
    constraint fk_JuegoSala
        foreign key (id_modoJuego) references juegos (id_juego)
);

create table if not exists jugadores
(
    id_jugador     varchar(50) not null,
    id_sala        varchar(50) not null,
    nombre_jugador varchar(10) not null,
    puntuacion     int         not null,
    primary key (id_jugador, id_sala),
    constraint fk_JugadorSala
        foreign key (id_sala) references salas (id_sala)
);

create table if not exists respuestas
(
    id_jugador varchar(50) not null,
    id_sala    varchar(50) not null,
    id_prompt  int         not null,
    ronda      int         not null,
    texto      varchar(30) not null comment 'El límite de caracteres de las respuestas de jugadores es de 30',
    primary key (id_jugador, id_sala, id_prompt, ronda),
    constraint fk_RespuestaJugador
        foreign key (id_jugador) references jugadores (id_jugador),
    constraint fk_RespuestaPrompt
        foreign key (id_prompt) references prompts (id_prompt),
    constraint fk_RespuestaSala
        foreign key (id_sala) references salas (id_sala)
);

