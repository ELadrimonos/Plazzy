create database if not exists jackbox;

use jackbox;

create table if not exists salas
(
	id_sala int auto_increment
		primary key,
	codigo_sala char(4) not null,
	num_jugadores int not null,
	nombre_juego varchar(50) not null
);

create table if not exists jugadores
(
	id_jugador int not null
		primary key,
	id_sala int not null,
	nombre_jugador varchar(10) not null,
	puntuacion int not null,
	constraint FK_sala
		foreign key (id_sala) references salas (id_sala)
);

create index if not exists id_sala
	on jugadores (id_sala);


