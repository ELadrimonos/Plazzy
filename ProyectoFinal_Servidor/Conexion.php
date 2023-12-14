<?php

class Conexion
{
    private $database;
    private $user;
    private $password;
    private $pdo;
    private $id_sala;
    private $cod_sala;

    public function __construct()
    {
        $this->host = "192.168.18.33";
        $this->database = "jackbox";
        $this->user = "root";
        $this->password = "";
        $this->pdo = new PDO($this->database,$this->user,$this->password);

    }

    public function ObtenerDatosJugadores()
    {
        $seleccion = $this->pdo->prepare("SELECT * FROM jugadores");
        $seleccion->execute();
        return $seleccion->fetchAll();
    }

    private function GenerarCodigoSala()
    {
        $caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        $stringRandom = "";
        for ($i = 0; $i < 4; $i++) {
            $random_character = $caracteres[mt_rand(0, strlen($caracteres) - 1)];
            $stringRandom .= $random_character;
        }
        return strtoupper($stringRandom);
    }

    public function CrearLobby($nombre_juego)
    {
        $this->cod_sala = $this->GenerarCodigoSala();
        $insercion = $this->pdo->prepare("INSERT INTO salas (codigo_sala, nombre_juego) VALUES" . $this->cod_sala .
            ", :nombre");
        $insercion->bindParam(":nombre", $nombre_juego);
        $insercion->execute();

        $obtener_id_sala = $this->pdo->prepare("SELECT id_sala FROM salas WHERE codigo_sala = $this->cod_sala");
        $obtener_id_sala->execute();
        $this->id_sala = $obtener_id_sala->fetch()[0];
    }
}