import IconoJugador from "./ComponentesComunes";

function Noria() {
    return (
        <>
            <div className="palo">
                <IconoJugador/>
            </div>
            <div className="palo">
                <IconoJugador/>
            </div>
            <div className="palo">
                <IconoJugador/>
            </div>
            <div className="palo">
                <IconoJugador/>
            </div>
            <div className="palo">
                <IconoJugador/>
            </div>
            <div className="palo">
                <IconoJugador/>
            </div>
            <div className="palo">
                <IconoJugador/>
            </div>
            <div className="palo">
                <IconoJugador/>
            </div>
        </>
    );
}

function LobbyQuiplash() {
    return (
        <section id="lobby">
            <article>
                <h1>Quiplash</h1>
                <h2>Código de sala</h2>
                <h3 className="gameCode"></h3>
            </article>
            <article id="jugadores">
                <Noria></Noria>
            </article>
        </section>
    );
}

export default LobbyQuiplash;