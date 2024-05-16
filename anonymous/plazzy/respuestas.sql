create table respuestas
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

