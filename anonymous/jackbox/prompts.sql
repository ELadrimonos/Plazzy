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

