import {useState} from "react";

function IconoJugador() {
    const [nombre, setNombre] = useState('');
    return (
        <div className="icono">
            <h4 className="nombreJug"></h4>
        </div>);
}
export default IconoJugador;