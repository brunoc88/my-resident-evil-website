const CharacterInputs = ({ register, watch, reset, errors }) => {
    return (
        <div>
            <div>
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    {...register('nombre')}
                />
            </div>
            <div>
                <label htmlFor="fechaNacimiento">Fecha de Nacimiento:</label>
                <input
                    type="date"
                    id="fechaNacimiento"
                    {...register('fechaNacimiento')}
                />
            </div>
            <div>
                <label htmlFor="edad">Edad:</label>
                <input
                    type="text"
                    id="edad"
                    {...register('edad')}
                />
            </div>
            <div>
                <label htmlFor="peso">Peso:</label>
                <input
                    type="number"
                    id="peso"
                    {...register('peso')}
                />
            </div>
            <div>
                <label htmlFor="altura">Altura:</label>
                <input
                    type="number"
                    id="altura"
                    {...register('altura')}
                />
            </div>
            <div>
                <label htmlFor="colorOjos">Color de Ojos:</label>
                <input
                    type="text"
                    id="colorOjos"
                    {...register('colorOjos')}
                />
            </div>
            <div>
                <label htmlFor="colorPelo">Color de Pelo:</label>
                <input
                    type="text"
                    id="colorPelo"
                    {...register('colorPelo')}
                />
            </div>
            <div>
                <label htmlFor="oficio">Oficio:</label>
                <input
                    type="text"
                    id="oficio"
                    {...register('oficio')}
                />
            </div>
            <div>
                <label htmlFor="picture">Imagen:</label>
                <input
                    type="file"
                    id="picture"
                    {...register('picture')}
                />
            </div>
            <div>
                <label htmlFor="biografia">Biografia:</label>
                <textarea
                    type="text"
                    id="biografia"
                    {...register('biografia')}
                />
            </div>
        </div>
    )
}

export default CharacterInputs
