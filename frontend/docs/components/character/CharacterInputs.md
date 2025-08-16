# Componente - CharacterInputs

## 📌 Descripción general

El componente `CharacterInputs` contendra los inputs del formulario de personaje `CharacterForm`.

---

## 🧹 Importaciones

```js
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
```

- Son todas las validaciones de los inputs para validar que los datos ingresados respeten las reglas establecidas para la creacion/edicion de personaje valido.

---

## Props

```js
- `reset`: Reinicia los valores del formulario.
- `register`: Vincula inputs al estado del formulario.
- `watch`: Observa cambios en el campo `mensaje` (para mostrar el contador de caracteres).
- `errors`: Maneja mensajes de validación.
- `editMode`: Para indicar si se esta editando un personaje.
```

---

## 🧠 Variables

```js
const nombre = watch('nombre', '')
    const colorOjos = watch('colorOjos', '')
    const colorPelo = watch('colorPelo', '')
    const oficio = watch('oficio', '')
    const biografia = watch('biografia', '')
```

---

## 🧱 Renderizado

```js
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
                <label htmlFor="fechaNacimiento">Nacimiento (opcional):</label>
                <input
                    type="date"
                    id="fechaNacimiento"
                    {...register('fechaNacimiento')}
                />
            </div>
            <div className="campo">
                <label htmlFor="edad">Edad (opcional):</label>
                <input
                    type="text"
                    id="edad"
                    {...register('edad', validarEdad)}
                />
                {errors.edad && <span>{errors.edad.message}</span>}
            </div>
            <div className="campo">
                <label htmlFor="peso">Peso (opcional):</label>
                <input
                    type="number"
                    id="peso"
                    {...register('peso', validarPeso)}
                />
                {errors.peso && <span>{errors.peso.message}</span>}
            </div>
            <div className="campo">
                <label htmlFor="altura">Altura (opcional):</label>
                <input
                    type="number"
                    id="altura"
                    {...register('altura', validarAltura)}
                />
                {errors.altura && <span>{errors.altura.message}</span>}
            </div>
            <div className="campo">
                <label htmlFor="colorOjos">Color de Ojos (opcional):</label>
                <input
                    type="text"
                    id="colorOjos"
                    {...register('colorOjos', validarColorDeOjos)}
                />
                <div className="contador">{colorOjos.length}/20</div>
                {errors.colorOjos && <span>{errors.colorOjos.message}</span>}
            </div>
            <div className="campo">
                <label htmlFor="colorPelo">Color de Pelo (opcional):</label>
                <input
                    type="text"
                    id="colorPelo"
                    {...register('colorPelo', validarColorDePelo)}
                />
                <div className="contador">{colorPelo.length}/20</div>
                {errors.colorPelo && <span>{errors.colorPelo.message}</span>}
            </div>
            <div className="campo">
                <label htmlFor="oficio">Oficio (opcional):</label>
                <input
                    type="text"
                    id="oficio"
                    {...register('oficio', validarOficio)}
                />
                <div className="contador">{oficio.length}/50</div>
                {errors.oficio && <span>{errors.oficio.message}</span>}
            </div>
            <div className="campo">
                <label htmlFor="picture">{!editMode?'Imagen:' : 'Imagen(opcional):'}</label>
                {!editMode?(
                    <input
                        type="file"
                        id="picture"
                        accept="image/*"
                        {...register('picture', validarImagen)}
                    />
                ):(
                    <input
                        type="file"
                        id="picture"
                        accept="image/*"
                        {...register('picture')}
                    />
                )
                }
                {errors.picture && <span>{errors.picture.message}</span>}
            </div>
            <div className="campo textarea-full">
                <label htmlFor="biografia">Biografia (opcional):</label>
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
```

- Contiene los inputs correspondientes a los de personaje, cada uno cuenta con la funcion `register`. Dentro de la misma como primer parametro seria como el atributo `name` y el segundo seria la validacion correspondiente a ese input.
- Si editMode es verdad se omitirarn algunas validaciones obligatorias como el de `imagen`.
- Algunos de los inputs van a llevar un contador para que el usuario visualice el limite de caracteres de cada campo.
- Finalmente se mostrara abajo de cada inputs el error corresposdiente si es que lo hay.

---

## 📦 Exportación

```js
export default CharacterInputs
```
- Exporta el componente para su uso dentro de la vista de CharacterForm.