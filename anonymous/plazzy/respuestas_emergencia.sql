create table respuestas_emergencia
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

INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (0, 0, 'su pelota', 'ES');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (0, 0, 'run away', 'EN');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (0, 1, 'huir', 'ES');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (0, 1, 'ask for a loan', 'EN');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (0, 2, 'pedir un préstamo', 'ES');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (0, 2, 'create a dragon farm', 'EN');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (0, 3, 'crear una granja de dragones', 'ES');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (0, 3, 'attract wealth', 'EN');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (0, 4, 'atraer riquezas', 'ES');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (0, 4, '#LikeTheOldDays', 'EN');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (0, 5, '#ComoLosViejosTiempos', 'ES');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (0, 5, 'avoid doing the FDP', 'EN');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (0, 6, 'evitar hacer el TFG', 'ES');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (0, 6, 'do the worm', 'EN');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (0, 7, 'hacer el gusano', 'ES');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (1, 0, 'su hueso', 'ES');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (1, 0, 'shave your moustache', 'EN');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (1, 1, 'cortarte el bigote', 'ES');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (1, 1, 'share the prize', 'EN');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (1, 2, 'compartir el premio', 'ES');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (1, 2, 'rescue the unicorn king', 'EN');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (1, 3, 'rescatar al rey unicornio', 'ES');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (1, 3, 'swim in lava', 'EN');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (1, 4, 'nadar en lava', 'ES');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (1, 4, '#TomorrowJuanOustsHim', 'EN');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (1, 5, '#MañanaLoDestituyeJuan', 'ES');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (1, 5, 'avoid validating business', 'EN');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (1, 6, 'evitar convalidarme empresa', 'ES');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (1, 6, 'teach tricks to pigs', 'EN');
INSERT INTO plazzy.respuestas_emergencia (id_answer, id_prompt, text, idioma) VALUES (1, 7, 'enseñar trucos a cerdos', 'ES');
