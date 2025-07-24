import {
    validarAltura,
    validarBiografia,
    validarColorDeOjos,
    validarColorDePelo,
    validarEdad,
    validarImagen,
    validarNombre,
    validarOficio,
    validarPeso
} from '../../utils/characterValidations'

const CharacterInputs = ({ register, watch, errors }) => {
    const nombre = watch('nombre', '')
    const colorOjos = watch('colorOjos', '')
    const colorPelo = watch('colorPelo', '')
    const oficio = watch('oficio', '')
    const biografia = watch('biografia', '')

    return (
        <div>
            <div>
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    {...register('nombre', validarNombre)}
                />
                <div >{nombre.length}/30</div>
                {errors.nombre && <span>{errors.nombre.message}</span>}
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
                    {...register('edad', validarEdad)}
                />
                {errors.edad && <span>{errors.edad.message}</span>}
            </div>
            <div>
                <label htmlFor="peso">Peso:</label>
                <input
                    type="number"
                    id="peso"
                    {...register('peso', validarPeso)}
                />
                {errors.peso && <span>{errors.peso.message}</span>}
            </div>
            <div>
                <label htmlFor="altura">Altura:</label>
                <input
                    type="number"
                    id="altura"
                    {...register('altura', validarAltura)}
                />
                {errors.altura && <span>{errors.altura.message}</span>}
            </div>
            <div>
                <label htmlFor="colorOjos">Color de Ojos:</label>
                <input
                    type="text"
                    id="colorOjos"
                    {...register('colorOjos', validarColorDeOjos)}
                />
                <div >{colorOjos.length}/20</div>
                {errors.colorOjos && <span>{errors.colorOjos.message}</span>}
            </div>
            <div>
                <label htmlFor="colorPelo">Color de Pelo:</label>
                <input
                    type="text"
                    id="colorPelo"
                    {...register('colorPelo', validarColorDePelo)}
                />
                <div >{colorPelo.length}/20</div>
                {errors.colorPelo && <span>{errors.colorPelo.message}</span>}
            </div>
            <div>
                <label htmlFor="oficio">Oficio:</label>
                <input
                    type="text"
                    id="oficio"
                    {...register('oficio', validarOficio)}
                />
                <div >{oficio.length}/50</div>
                {errors.oficio && <span>{errors.oficio.message}</span>}
            </div>
            <div>
                <label htmlFor="picture">Imagen:</label>
                <input
                    type="file"
                    id="picture"
                    {...register('picture', validarImagen)}
                />
                {errors.picture && <span>{errors.picture.message}</span>}
            </div>
            <div>
                <label htmlFor="biografia">Biografia:</label>
                <textarea
                    type="text"
                    id="biografia"
                    {...register('biografia', validarBiografia)}
                />
                <div >{biografia.length}/500</div>
                {errors.biografia && <span>{errors.biografia.message}</span>}
            </div>
        </div>
    )
}

export default CharacterInputs
