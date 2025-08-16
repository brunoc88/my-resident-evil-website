# 📄 Vista: CharacterForm

## 📌 Descripción General

El componente CharacterForm se encarga de mostrar el formulario de creación y edición de personajes en la aplicación. Permite registrar los datos principales de cada personaje, validarlos y enviarlos al backend.

---

## 🧹 Importaciones

```js
import { useForm } from "react-hook-form"
import { useOutletContext, useParams } from "react-router-dom"
import CharacterInputs from "../../components/character/CharacterInputs"
import CharacterSelects from "../../components/character/CharacterSelects"
import { characterPost, editCharacterById, getCharacterById } from "../../services/character"
import { useAuth } from "../../context/AuthContext"
import { useEffect, useState } from "react"
```

- `useForm`: librería react-hook-form para validación y manejo de formularios.
- `useOutletContext`: para acceder al contexto compartido del layout (como notificaciones).
- `useParams`: hook de React Router obtener parámetros de la URL.
- `CharacterInputs`: Componente que tiene los inputs de `CharacterForm`.
- `CharacterSelects`: Componente que va a tener los selects de `CharacterForm`.
- `characterPost`, `editCharacaterById`, `getCharacterById`: Funciones para hacer la solicitud al backend de crear un personaje, editarlo y obtenerlo.
- `useAuth`: contexto de autenticación.
- `useEffect, useState`: manejo de estado y efectos secundarios, como llamadas a la API.

---

## Props

- `editMode`: Indicar si el formulario va a ser para edicion o no.

---

## 🧠 Estados Locales y Variables de Contexto

```js
 const { id } = useParams()
    const { navigate } = useAuth()
    const { setNotification } = useOutletContext()
    const [loading, setLoading] = useState(true)
    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors }
    } = useForm({ mode: 'onChange' })

    const formatDate = (date) => new Date(date).toISOString().split("T")[0];
```

- `id`: id del persoanje.
- `navigate`: funcion de react-router para navegar.
- `setNotification`: función heredada del contexto que permite mostrar mensajes de error o éxito.
- `loading`: indica si se está cargando el personaje.
- `register, handleSubmit, watch, formState.errors`: Funciones y estados de `useForm`. `watch` permite observar cambios en campos para contadores.

---

## 🔄 Lógica del componente

### `useEffect` – loadCharacterForm

```js
useEffect(() => {
        try {
            if (!id) return
            const loadCharacterForm = async () => {
                const character = await getCharacterById(id)
                if (character) {
                    reset({
                        id: character.id,
                        nombre: character.nombre,
                        categoria: character.categoria,
                        condicion: character.condicion,
                        primeraAparicion: character.primeraAparicion,
                        ultimaAparicion: character.ultimaAparicion,
                        picture: character.picture,
                        fechaNacimiento: character.fechaNacimiento ? formatDate(character.fechaNacimiento) : "",
                        edad: character.edad,
                        peso: character.peso,
                        altura: character.altura,
                        colorOjos: character.colorOjos,
                        colorPelo: character.colorPelo,
                        oficio: character.oficio,
                        biografia: character.biografia
                    })
                }
            }
            loadCharacterForm()
        } catch (error) {
            setNotification({ error: error.message || `Hubo un problema: ${error}` })
        } finally {
            setLoading(false)
        }
    }, [id])

```
- Si el id es null detiene la ejecucion, caso contrario significa que se va a editar un personaje. Por lo que llamamos a la funcion `loadCharacterForm()` la cual va a llamar a `getCharacterById(id)` que si es exitosa obtenemos los datos del personaje que seran cargados al formulario. En caso de error saltara una noticiacion, finalmente loading pasa a false indiciando que se termino de consumir la api. Finalmente loading pasa a false indicando fin de la carga del personaje.

### `onSubmit`

```js
 const onSubmit = async (data) => {
        const formData = new FormData()

        // obligatorios
        formData.append('nombre', data.nombre)
        formData.append('categoria', data.categoria)
        formData.append('condicion', data.condicion)
        formData.append('primeraAparicion', data.primeraAparicion)
        formData.append('ultimaAparicion', data.ultimaAparicion)
        formData.append('picture', data.picture[0])
        // opcionales
        if (data.fechaNacimiento) formData.append('fechaNacimiento', data.fechaNacimiento)
        if (data.edad) formData.append('edad', data.edad)
        if (data.peso) formData.append('peso', data.peso)
        if (data.altura) formData.append('altura', data.altura)
        if (data.colorOjos) formData.append('colorOjos', data.colorOjos)
        if (data.colorPelo) formData.append('colorPelo', data.colorPelo)
        if (data.oficio) formData.append('oficio', data.oficio)
        if (data.biografia) formData.append('biografia', data.biografia)

        try {
            console.log("try-catch")
            const res = await characterPost(formData)
            console.log(res)
            setNotification({ error: '', exito: res.msj })
            setTimeout(() => {
                setNotification({ error: '', exito: '' })
            }, 5000)

            navigate('/personajes/index')
        } catch (error) {
            setNotification({ error: error.message, exito: '' })
            setTimeout(() => {
                setNotification({ error: '', exito: '' })
            }, 5000)
        }
    }

```
- `onSubmit` Recibe los datos del personaje que se va a crear, llamamos a `characterPost(formData)` la cual enviara la informacion del personaja a la base de datos. Si la respuesta es exitosa aparecera una notificacion de exito y nos redirigira a al index de personajes caso contrario saltara una notificacion de error.

### `handleEditCharacter`

```js
const handleEditCharacter = async (data) => {
        
        const formData = new FormData()
        
        try {
            
            if (data.nombre) formData.append('nombre', data.nombre)
            if (data.fechaNacimiento) formData.append('fechaNacimiento', data.fechaNacimiento)
            if (data.edad) formData.append('edad', data.edad)
            if (data.altura) formData.append('altura', data.altura)
            if (data.peso) formData.append('peso', data.peso)
            if (data.colorOjos) formData.append('colorOjos', data.colorOjos)
            if (data.colorPelo) formData.append('colorPelo', data.colorPelo)
            if (data.oficio) formData.append('oficio', data.oficio)
            if (data.biografia) formData.append('biografia', data.biografia)
            if (data.categoria) formData.append('categoria', data.categoria)
            if (data.condicion) formData.append('condicion', data.condicion)
            if (data.primeraAparicion) formData.append('primeraAparicion', data.primeraAparicion)
            if (data.ultimaAparicion) formData.append('ultimaAparicion', data.ultimaAparicion)
            if (data.picture && data.picture[0]) {
                formData.append('picture', data.picture[0])
            }

            const update = await editCharacterById(id, formData)
            if(update){
                setNotification({error:'', exito:'Personaje Actualizado!'})
                setTimeout(() => {
                    setNotification({error:'', exito:''})
                }, 5000)
                navigate(`/personajes/${id}`)
            }
        } catch (error) {
            setNotification({ error: error.message || `Hubo un problema: ${error}` })
            setTimeout(() => {
                setNotification({ error: '', exito: '' })
            }, 5000)
        }
    }
```

- La funcion `handleEditCharacter` recibe los datos que se cambiaron del personaje, los cuales seran enviador por `editCharacterById(id, formData)`. Caso de exito nos saltara notificacion, y volveremos a la vista del personaje editado, si hay un problema tambien nos notificara.

### `handleBackProfileCharacter`

```js
   const handleBackProfileCharacter = () => {
        if (id) {
            navigate(`/personajes/${id}`)
        } else {
            navigate(`/personajes/index`)
        }
    }
```

- Funcion que nos permite volver al perfil del personaje si es que id no es null. Sino no nos devolvera al index de personajes.

---

## 🧱 Renderizado

- Mientras carga la información del usuario:
```js
if (loading) return <p> Cargando...</p>
```

- Formulario: 

```js
return (

        <div className="user-form-layout">
            {!editMode? 
            (<img src="/cForm.jpg" alt="registro" className="side-image" />) : (<img src="/editForm.jpg" alt="registro" className="side-image" />)}
            <form className="formulario" onSubmit={handleSubmit(!editMode ? onSubmit : handleEditCharacter)} encType="multipart/form-data">
                <h1>{!editMode?'Formulario de registro de personaje': 'Formulario de edicion de personaje'}</h1>
                <div>
                    <CharacterInputs register={register} watch={watch} reset={reset} errors={errors} editMode={editMode} />
                </div>
                <div>
                    <CharacterSelects register={register} watch={watch} reset={reset} errors={errors} />
                </div>
                <div className="buttonGroup">
                    <button type="submit">Enviar</button>
                    <button type="button" onClick={handleBackProfileCharacter}>Volver</button>
                </div>
            </form>
        </div>
    )
```

- Si editMode es false o null se mostrara una imagen a la izquierda de *Claire Redfield* caso contrario se mostrara la imagen de *Rose Mary*.
- Si editMode el submit se hara en `onSubmit` sino en `handleEditCharacter` siempre y cuando `handleSumit` controle que se pasaron todas las validaciones.
- Dentro del form vamos a tener dos componentes `CharacterInputs` y `CharacterSelects` donde ambos recibiran las props ( `register`, `watch`, `reset`, `errors`)que le permitiran usar las fuciones de `useForm` y `editMode` para indicar si estan en modo edicion.
- Completa el form los botones `enviar` para hacer el envio del mismo y `volver` que llamara a la funcion `handleBackProfileCharacter` que nos llevara devuelta al perfil del personaje.

## 📦 Exportación

```js
export default CharacterForm
```
- Exporta el componente para ser usado en las rutas definidas en `App.js`.

---

