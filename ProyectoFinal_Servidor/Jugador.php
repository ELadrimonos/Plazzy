<?php

class Jugador
{
    public function __construct($nombre)
    {
        $this->nombre = $nombre;
        $this->puntuacion = 0;
        $this->ip = $this->obtenerDireccionIP();
    }

    public function obtenerNombre()
    {
        return $this->nombre;
    }

    public function obtenerPuntuacion()
    {
        return $this->puntuacion;
    }

    public function actualizarPuntuacion($puntuacionExtra)
    {
        $this->puntuacion += $puntuacionExtra;
    }

    private function obtenerDireccionIP()
    {
        $ip = $_SERVER['REMOTE_ADDR'];

        if (array_key_exists('HTTP_X_FORWARDED_FOR', $_SERVER)) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        }

        return $ip;
    }
}
