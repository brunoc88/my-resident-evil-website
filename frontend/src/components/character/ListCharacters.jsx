import { Link } from "react-router-dom"
import "./ListCharacters.css" 

const ListCharacters = ({ characters = [] }) => { // <-- [] evitar undefinded
    const safeCharacters = characters ?? [];
    if (safeCharacters.length === 0) return <div><h1>No hay personajes registrados o con esas caracteristicas!</h1></div>;

    return (
        <div className="cardContainer">
            {safeCharacters.map(c => (
                <div key={c.id} className="card">
                    <Link to={`/personajes/${c.id}`}>
                        <img
                            src={`http://localhost:3000/uploads/${c.picture}`}
                            alt={`profile${c.nombre}`}
                            className="character-img"
                        />
                        <h3 className="character-name">{c.nombre}</h3>
                        <button className="view-btn">Ver</button>
                    </Link>
                </div>
            ))}
        </div>
    );
};

export default ListCharacters
