import { useState } from "react"
import { useNavigate, useOutletContext } from 'react-router-dom'

const UserForm = () => {
    const [user, setUser] = useState('')
    const { setError } = useOutletContext()
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()
    }
    return (
        <div>
            <div>
                <h2>Registrate!</h2>
            </div>
            <div>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <div>
                        <div>
                            <label htmlFor="userName">Nombre de usuario:</label>
                            <input
                                type="text"
                                name="userName"
                                id="userName"
                                placeholder="Ingresar nombre de usuario"
                            />
                        </div>
                        <div>
                            <label htmlFor="email">Email:</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="Ingrese un Email"
                            />
                        </div>
                        <div>
                            <label htmlFor="pregunta">Selecciona una pregunta:</label>
                            <select name="pregunta" id="pregunta">
                                <option value=""></option>
                                <option value="resident_evil_favorito">Resident Evil Favorito?</option>
                                <option value="personaje_favorito">Personaje Favorito?</option>
                                <option value="como_descubriste">Como descubriste Resident Evil?</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="respuesta">Respuesta:</label>
                            <input
                                type="text"
                                id="respuesta"
                                placeholder="Ingrese una respuesta"
                            />
                        </div>
                        <div>
                            <label htmlFor="sobreMi">Sobre mi:</label>
                            <textarea
                                name="sobreMi"
                                placeholder="Cuentanos sobre ti (opcional)"
                                id="sobreMi"
                            />
                        </div>
                        <div>
                            <label htmlFor="picture">Foto: (opcional)</label>
                            <input type="file" name="picture" id="picture" />
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default UserForm
