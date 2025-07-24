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
        <div className="grid">
            <div className="campo">
                <label htmlFor="nombre">Nombre:</label>
                <input
                    type="text"
                    id="nombre"
                    {...register('nombre', validarNombre)}
                />
                <div className="contador">{nombre.length}/30</div>
                {errors.nombre && <span>{errors.nombre.message}</span>}
            </div>
            <div className="campo">
                <label htmlFor="fechaNacimiento">Nacimiento:</label>
                <input
                    type="date"
                    id="fechaNacimiento"
                    {...register('fechaNacimiento')}
                />
            </div>
            <div className="campo"> 
                <label htmlFor="edad">Edad:</label>
                <input
                    type="text"
                    id="edad"
                    {...register('edad', validarEdad)}
                />
                {errors.edad && <span>{errors.edad.message}</span>}
            </div>
            <div className="campo">
                <label htmlFor="peso">Peso:</label>
                <input
                    type="number"
                    id="peso"
                    {...register('peso', validarPeso)}
                />
                {errors.peso && <span>{errors.peso.message}</span>}
            </div>
            <div className="campo">
                <label htmlFor="altura">Altura:</label>
                <input
                    type="number"
                    id="altura"
                    {...register('altura', validarAltura)}
                />
                {errors.altura && <span>{errors.altura.message}</span>}
            </div>
            <div className="campo">
                <label htmlFor="colorOjos">Color de Ojos:</label>
                <input
                    type="text"
                    id="colorOjos"
                    {...register('colorOjos', validarColorDeOjos)}
                />
                <div className="contador">{colorOjos.length}/20</div>
                {errors.colorOjos && <span>{errors.colorOjos.message}</span>}
            </div>
            <div className="campo">
                <label htmlFor="colorPelo">Color de Pelo:</label>
                <input
                    type="text"
                    id="colorPelo"
                    {...register('colorPelo', validarColorDePelo)}
                />
                <div className="contador">{colorPelo.length}/20</div>
                {errors.colorPelo && <span>{errors.colorPelo.message}</span>}
            </div>
            <div className="campo">
                <label htmlFor="oficio">Oficio:</label>
                <input
                    type="text"
                    id="oficio"
                    {...register('oficio', validarOficio)}
                />
                <div className="contador">{oficio.length}/50</div>
                {errors.oficio && <span>{errors.oficio.message}</span>}
            </div>
            <div className="campo">
                <label htmlFor="picture">Imagen:</label>
                <input
                    type="file"
                    id="picture"
                    accept="image/*"
                    {...register('picture', validarImagen)}
                />
                {errors.picture && <span>{errors.picture.message}</span>}
            </div>
            <div className="campo textarea-full">
                <label htmlFor="biografia">Biografia:</label>
                <textarea
                    type="text"
                    id="biografia"
                    {...register('biografia', validarBiografia)}
                />
                <div className="contador">{biografia.length}/500</div>
                {errors.biografia && <span>{errors.biografia.message}</span>}
            </div>
        </div>
    )
}

export default CharacterInputs
