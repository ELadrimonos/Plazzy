create table prompts
(
    id_prompt int                            not null,
    id_juego  int                            not null,
    text      varchar(100)                   null,
    idioma    enum ('ES', 'EN') default 'ES' not null,
    primary key (id_prompt, id_juego, idioma),
    constraint fk_juego_prompts
        foreign key (id_juego) references juegos (id_juego)
);

INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (0, 0, 'El mayor amigo del perro es ...', 'ES');
INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (0, 0, 'Dog\'s best friend is ...', 'EN');
INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (1, 0, 'Estás en 1945, Berlín. Lo primero que haces es ...', 'ES');
INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (1, 0, 'You\'re in 1945, Berlin. First thing you do is ...', 'EN');
INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (2, 0, 'Después de ganar la lotería, decides...', 'ES');
INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (2, 0, 'After winning the lottery, you decide to ...', 'EN');
INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (3, 0, 'En un mundo habitado por unicornios y dragones, tu misión es...', 'ES');
INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (3, 0, 'In a world inhabited by unicorns and dragons, your mission is ...', 'EN');
INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (4, 0, 'Tu superpoder recién descubierto es...', 'ES');
INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (4, 0, 'Your newly discovered superpower is ...', 'EN');
INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (5, 0, 'El hashtag que usarías en un golpe de estado', 'ES');
INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (5, 0, 'The hashtag you\'d use in a coup d\'etat', 'EN');
INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (6, 0, 'Si pudieras viajar en el tiempo, irías a...', 'ES');
INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (6, 0, 'If you could travel in time, you\'d go to ...', 'EN');
INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (7, 0, 'En un mundo sin tecnología, tu habilidad más valiosa sería...', 'ES');
INSERT INTO plazzy.prompts (id_prompt, id_juego, text, idioma) VALUES (7, 0, 'In a world without technology, your most important skill would be ...', 'EN');
