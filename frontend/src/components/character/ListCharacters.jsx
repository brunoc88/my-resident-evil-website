import { Link } from "react-router-dom"

const ListCharacters = ({ characters = [] }) => { // <-- []  Esto solo aplica si characters es undefined, no si es null.
    const safeCharacters = characters ?? [];
    if (safeCharacters.length === 0) return <div><h1>No hay personajes registrados!</h1></div>

    return (
        <div>
            <ul>
                {safeCharacters.map(c => (
                    <li key={c.id}>
                        <Link to={`/personaje/editar/${c.id}`}>
                            <img src={c.picture} alt={`profile${c.nombre}`} />
                            <h3>{c.nombre}</h3>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ListCharacters