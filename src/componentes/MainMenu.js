import '../css/menuPrincipal.css';

function CrearPartida() {
    return (
        <main id="menuCrearPartida">
            <button>Volver al menú</button>
            <fieldset id="crearPartidaForm">
                <legend>Crear Partida</legend>
                <form>
                    <label htmlFor="nombreHost">Nombre: </label>
                    <input type="text" name="username" id="nombreHost" required/>
                    <label htmlFor="modoDeJuego">Modo de juego: </label>
                    <select name="juego" id="modoDeJuego">
                        <option value="quiplash" selected>Quiplash</option>
                    </select>
                    <input type="submit" value="Crear" id="crearPartida"/>
                </form>
            </fieldset>
        </main>
    );
}


function MenuPrincipal() {
    return (<>
        <header>
            <h1>plazzy</h1>
        </header>
        <main id="menuPrincipal">
            <fieldset id="joinGame">
                <legend>Unirse A Partida</legend>
                <form>
                    <label htmlFor="nombreJugador">Nombre: </label>
                    <input type="text" name="username" id="nombreJugador" required/>
                    <label htmlFor="gameCode">Código partida: </label>
                    <input type="text" name="code" id="gameCode" minLength="4" maxLength="4" required/>
                    <input type="submit" value="Unirse" id="unirsePartida"/>
                </form>
            </fieldset>


        </main>
        </>
    );
}

export default MenuPrincipal;