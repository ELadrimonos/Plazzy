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

