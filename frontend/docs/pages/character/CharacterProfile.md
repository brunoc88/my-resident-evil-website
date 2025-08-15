# 📄 Vista: `Perfil de personaje`

## 📌 Descripción General

El componente `CharacterProfile` muestra el perfil completo de un personaje individual de la saga *Resident Evil*, incluyendo sus datos personales, cantidad de likes, comentarios y botones de acción para usuarios autenticados. Soporta funcionalidades como dar "like", ver comentarios, editar, denunciar o eliminar personajes.

---

## 🧹 Importaciones

```js
import { useParams, useOutletContext } from "react-router-dom"
import { useEffect, useState } from "react"
import CharacterComments from "../../components/character/Charactercomments"
import { getCharacterById, sendLike, sendUnlike, deleteCharacterById } from "../../services/character"
import { useAuth } from "../../context/AuthContext"
import { FaThumbsUp, FaRegComment } from "react-icons/fa"
import styles from './CharacterProfile.module.css'
```

- `useParams`: obtiene el ID del personaje desde la URL.

- `useOutletContext`: permite usar el sistema de notificaciones.

- `useEffect, useState`: manejo de estado y efectos secundarios, como llamadas a la API.

- `CharacterComments`: componente para mostrar/comentar.

- `getCharacterById, sendLike, sendUnlike, deleteCharacterById`: servicios relacionados al personaje.

- `useAuth`: contexto de autenticación.

- `FaThumbsUp`, FaRegComment: íconos de interacción.

- `CharacterProfile.module.css`: estilos del componente.

---

## 🧠 Estados Locales y Variables de Contexto

```js
const { id } = useParams()
const [character, setCharacter] = useState(null)
const [loading, setLoading] = useState(true)
const [litteNote, setLittleNote] = useState({ comentarios: '', likes: '' })
const [plus, setPlus] = useState(false)
const [likes, setLikes] = useState(null)
const [liked, setLiked] = useState(false)
const [comments, setComments] = useState(null)
const [verComments, setVerComments] = useState(false)
const { isAuth, user, navigate } = useAuth()
const { setNotification } = useOutletContext()
```
- `id`: id del persoanje.

- `character`: contiene la información del personaje.

- `loading`: indica si se está cargando el personaje.

- `litteNote`: mensajes informativos para interacciones.

- `plus`: alterna la vista extendida del perfil.

- `likes`: contador de likes.

- `liked`: indica si el usuario dio like.

- `comments`: número de comentarios visibles.

- `verComments`: toggle para ver comentarios.

- `isAuth`: para validar si el usuario esta autenticado.

- `user`: info del usuario

- `navigate`: funcion de react-router para navegar.

---

## 🔄 Lógica del Componente

### `useEffect` – Carga inicial del personaje

```js
    useEffect(() => {
        const loadCharacter = async () => {
            try {
                const res = await getCharacterById(id)
                setCharacter(res)
                setLikes(res.likes.length)
                const comentarios = res.comentarios.filter(c => c.estado)
                setComments(comentarios.length)
            } catch (error) {
                setNotification({ error: error.message })
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
            } finally {
                setLoading(false)
            }
        }

        loadCharacter()
    }, [id])
```
Al montar el componente, `useEffect` ejecuta la funcion asincronica `loadCharacter` la cual va a llamar a la funcion `getCharacterById(id)` la cual recibe el id obtenido por el `useParams`, la funcion nos devolvera informacion del personaje, a continuacion se setea el personaje con `setCharacter`, luego setea la cantidad de likes `setLikes` y comentarios(activos) del personaje `setComments`. Si ocurre un error salta la notificacion con la informacion del error `setNotification`. Finalmente se setea `setLoading(false)` indicando que ya se termino de ejecutar la busqueda del personaje para bien o mal.

### `useEffect` – Carga de like 

```js
    useEffect(() => {
        if (!character || !character.likes || !user?.id) return

        const myLike = character.likes.some(l => {
            const likeId = l?._id?.toString?.() || l?.toString?.()
            return likeId === user.id.toString()
        })

        if (myLike) {
            setLiked(true)
        }
    }, [character, user])
```

Aqui `useEffect` al ejecutarse comprueba que `character` o `character.likes` o `user.id` no sean null o undefined caso contrario se corta la ejecucion.
Si no paso continua la ejecucion y buscamos en `character.likes` si en ese personaje esta registrado un `like` como mi `id`. Se verifica si el id no es undefined o null y si es tipo String para poder convertirlo al mismo. Una vez hecho la comprovacion lo guardamos en la variable `myLike`, si existe lo guardamos en `setLiked(true)` por lo que se va a mostrar el pulgar de like marcado.


### `handleLike`

```js
    const handleLike = async () => {
        try {
            setLittleNote({ comentarios: '', likes: '' })
            if (isAuth) {

                if (!liked) {
                    setLiked(true)
                    setLikes(prev => prev + 1)
                    const id = character.id
                    const res = await sendLike(id)
                    if (res && res.likes) {
                        setNotification({ error: '', exito: 'Gracias por el like!' })
                        setTimeout(() => {
                            setNotification({ error: '', exito: '' })
                        }, 5000)
                    }
                } else {
                    setLiked(false)
                    setLikes(prev => prev - 1)
                    const id = character.id
                    await sendUnlike(id)
                }

            } else {
                setLittleNote({ comentarios: '', likes: 'Debes logearte o registrarte para dar like!' })
                setTimeout(() => {
                    setLittleNote({ comentarios: '', likes: '' })
                }, 5000)
            }

        } catch (error) {
            setNotification({ error: error.message })
            setTimeout(() => {
                setNotification({ error: '', exito: '' })
            }, 5000)
        }
    }
```

Esta funcion se ejecuta cuando el usuario autenticado le da click al boton de liker que esta en el icono del pulgar de like. Se comprueba que el usuario este autenticado, si no lo esta saltara el mensaje 'Debes logearte o registrarte para dar like!', si el usuario esta autenticado se comprueba si no dio like anteriormente comprobando si el estado de `liked` estaba en false. Si no le dio like se setea el like `setLiked(true)` y aumentamos el contador de likes con `setLikes` y se llamara a la funcion `sendLike` para guardar el mi id en el array de id de likes de Personaje. El icono cambiara a color verde. Caso contrario si ya dio like se hara lo contrario y llamaremos a la funcion `sendUnlike`. El `catch` es para mostrar si hubo algun error con el servidor.


### `handleVerComentarios`

```js
  const handleVerComentarios = () => {
        setLittleNote('')
        if (!isAuth) {
            setLittleNote({ comentarios: 'Registrate o Logeate para ver los comentarios', likes: '' })
            setTimeout(() => {
                setLittleNote('')
            }, 5000)
        }
        if (isAuth && verComments) {
            setVerComments(false)
        } else {
            setVerComments(true)
        }

    }
```

La funcion `handleVerComenarios` se va a ejecutar cuando el usuario autenticado le de al boton `Ver comentarios`, si el usuario no esta autenticado le va a salir el mensaje de `Registrate o Logeate para ver los comentarios`. Si esta autenticado y existen comentarios en el personaje se setea el boton a false para podes ver el listado de comentarios caso contrario no hace nada.

### `handleDeleteCharacter`

```js
  const handleDeleteCharacter = async () => {
        try {
            
            let msj = 'Seguro que quiere eliminar este personaje?'
            if(confirm(msj)){
                const res = await deleteCharacterById(id)
                if(res) {
                    setNotification({error:'', exito:'Personaje eliminado!'})
                    setTimeout(() => {
                        setNotification({error:'', exito:''})
                    }, 5000)
                    navigate('/personajes/index')
                }
            }
        } catch (error) {
            setNotification({error:error.message, exito:''})
            setTimeout(() => {
                setNotification({error:'', exito:''})
            }, 5000)
        }
    }
```

La funcion `handleDeleteCharacter` se va a ejecutar cuando el usuario de rol "admin" haga click en el boton eliminar. Se lo advierte al usuario con un mensaje de si desea eliminar el personaje, si confima de forma positiva se llama a la funcion `deleteCharacterById(id)`, si todo salio bien nos muestra la notificacion de exito y nos redirige a `personajes/index`, en caso que pasara un error es atrapado por el `catch` que nos mostrara una notificacion del mismo.


## `handleEditCharacterViewForm`

```js
  const handleEditCharacterViewForm = async () => {
        try {
            navigate(`/personajes/editar/${id}`)
        } catch (error) {
            setNotification({error: error.message || `Hubo un error: ${error}`})
        }
    }
```

La funcion `handleEditCharacterViewForm` se va a llamar cuando el usuario autenticado haga click en el botono editar. Automaticamente navegamos al form de editar usuario `userForm.jsx` mandando el id del personaje por paramentro. Si llegara a pasar un error el `Cath` lo mostrara con una notifiacion.


## `handleMakeComplaint`

```js
const handleMakeComplaint = () => {
        navigate(`/denuncias/crear/personaje/${character.nombre}/${character.id}`)
    }
```

La funcion `handleMakeComplaint` permite al usuario autenticado navegar a un formulario donde va a poder realizar una denuncia. Por ejemplo: si hay algo que esta mal en la biografia del personaje o cree que es perjudicial para la experiencia del usuario.

---

## 🧱 Renderizado

### 🌀 Loading

```js
if (loading) return <p>Cargando...</p>
```

Mientras `loading` sea `true`, se muestra el mensaje `"Cargando..."`. Esto indica que la solicitud para obtener los personajes aún está en curso.

### Character
```js
if (!character) return <p>Personaje no encontrado.</p>
```

Si `character` es null mostrara el mensaje `Personaje no encontrado.`


### 🖼️ Contenido principal

```js
return (
        <div className={styles.characterContainer}>
            <h1 className={styles.allWhite}>{character.nombre}</h1>

            {litteNote.likes && <div className={styles.note}>{litteNote.likes}</div>}

            <div className={styles.characterContent}>
                {/* Imagen + Iconos */}
                <div className={styles.card}>
                    <img
                        src={`http://localhost:3000/uploads/${character.picture}`}
                        alt={`profile${character.nombre}`}
                        className={styles.characterImg}
                    />
                    <div className={styles.iconStats}>
                        <span
                            onClick={handleLike}
                            className={`${styles.likeIcon} ${liked ? styles.likeIconLiked : styles.likeIconNotLiked}`}
                        >
                            <FaThumbsUp /> {likes}
                        </span>
                        <span>
                            <FaRegComment onClick={handleVerComentarios} /> {comments}
                        </span>
                    </div>
                </div>

                {/* Datos + Botones */}
                <div className={styles.characterDetails}>
                    <table>
                        <tbody>
                            <tr><td>Nombre: {character.nombre}</td></tr>
                            <tr><td>Fecha de Nacimiento: {new Date(character.fechaNacimiento).toLocaleDateString('es-AR')}</td></tr>
                            <tr><td>Edad: {character.edad || 'sin datos'}</td></tr>
                            <tr><td>Color de pelo: {character.colorPelo || 'sin datos'}</td></tr>
                            <tr><td>Color de ojos: {character.colorOjos || 'sin datos'}</td></tr>
                            <tr><td>Altura: {character.altura ? `${character.altura} cm` : 'sin datos'}</td></tr>
                            <tr><td>Peso: {character.peso ? `${character.peso} Kg` : 'sin datos'}</td></tr>
                            {plus && (
                                <>
                                    <tr><td>Categoria: {character.categoria}</td></tr>
                                    <tr><td>Condicion: {character.condicion}</td></tr>
                                    <tr><td>Primera Aparicion: {character.primeraAparicion}</td></tr>
                                    <tr><td>Ultima Aparicion: {character.ultimaAparicion}</td></tr>
                                    <tr><td>Oficio: {character.oficio || 'sin datos'}</td></tr>
                                    <tr><td>Biografia: {character.biografia || 'sin datos'}</td></tr>
                                </>
                            )}
                        </tbody>
                    </table>

                    <button
                        className={styles.plusButton}
                        onClick={() => setPlus(prev => !prev)}
                    >
                        {plus ? '-' : '+'}
                    </button>

                    <div className={styles.actionButtons}>
                        {isAuth && (
                            <>
                                <button onClick={handleEditCharacterViewForm}>Editar</button>
                                <button onClick={handleMakeComplaint}>Denunciar</button>
                            </>
                        )}
                        {user?.rol === 'admin' && <button onClick={handleDeleteCharacter}>Eliminar</button>}
                    </div>

                    {litteNote.comentarios && <div className={styles.note}>{litteNote.comentarios}</div>}

                    <button className={styles.commentsButton} onClick={handleVerComentarios}>
                        {verComments && isAuth ? 'Ocultar' : 'Ver Comentarios'}
                    </button>
                </div>
            </div>

            {isAuth && verComments && (
                <div>
                    <CharacterComments id={id} setComments={setComments} />
                </div>
            )}
        </div>
    )
```
Se renderiza:
- El titulo con el nombre del personaje
- Si llega a haber un error como dar like se renderiza `litteNote` con un mensaje.
- Una carta que contendra la imagen del personaje, el icono likes & comentarios con su respectiva cantidad.
- Una tabla con los datos del personaje.
- Un boton `+` que mostrara informacion extendia del personaje y boton `-` para volver a ocultar esa informacione extra.
- Si el usuario esta autenticado se renderizaran los botonos `editar`, `denunciar` y `eliminar`.
- Si el rol del usuario es `admin` se renderiza el boton `eliminar`.
- Si llega a haber un error como dar click en el icono de comentarios o ver comentarios `littleNote` mostrara mensaje de error.
- El boton de comentarios segun si esta autenticado `isAuth` y si ver comentarios `verComments` es verdadero mostrar el mensaje de `ocultar` una vez desplegado la lista de comentarios, si no muestra `Ver Comentarios`.
- Si `isAuth` y `verComments` son verdaderos vamos a renderizar el componente `CharacterComments` el `id` del personaje y `setComments` para una vez encontrado el personaje este componente los setee.

---

## 📦 Exportación

```js
export default CharacterProfile
```

Exporta el componente para ser usado en las rutas definidas  en `App.js`.