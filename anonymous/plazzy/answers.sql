create table answers
(
    round     int          not null,
    lobby_id  int          not null,
    player_id int          not null,
    prompt_id int          not null,
    text      varchar(100) not null,
    primary key (round, lobby_id, player_id),
    constraint fk_LobbyAnswer
        foreign key (lobby_id) references salas (id_sala),
    constraint fk_PlayerAnswer
        foreign key (player_id) references jugadores (id_jugador),
    constraint fk_PromptAnswer
        foreign key (prompt_id) references prompts (id_prompt)
);

