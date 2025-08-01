# 📄 Vista: `Index de personajes`

## 📌 Descripción General

El componente `CharacterIndex` es responsable de mostrar la lista de personajes de la saga *Resident Evil*. Está diseñado para ser accesible tanto por usuarios autenticados como no autenticados.

---

## 🧹 Importaciones

```js
import { useState, useEffect } from "react"
import { useOutletContext } from "react-router-dom"
import { characterList } from "../../services/character"
import ListCharacters from "../../components/character/ListCharacters"
import './CharacterIndex.css'
```

- `useState`: para manejar el estado del componente.
- `useEffect`: para ejecutar efectos secundarios, como llamadas a la API.
- `useOutletContext`: para acceder al contexto compartido del layout (como notificaciones).
- `characterList`: función que obtiene la lista de personajes activos.
- `ListCharacters`: componente encargado de renderizar la lista.
- `./CharacterIndex.css`: hoja de estilos asociada.

---

## 🧠 Estados Locales y Variables de Contexto

```js
const [characters, setCharacters] = useState(null)
const [filter, setFilter] = useState('')
const [loading, setLoading] = useState(true)
const { setNotification } = useOutletContext()
```

- `characters`: almacena los personajes obtenidos de la API.
- `filter`: contiene la lista filtrada de personajes según el nombre buscado. Si no hay búsqueda activa, es `null`.
- `loading`: indica si la solicitud a la API está en curso.
- `setNotification`: función heredada del contexto que permite mostrar mensajes de error o éxito.

---

## 🔄 Lógica del Componente

### `useEffect` – Carga inicial de personajes

```js
useEffect(() => {
    const loadCharacters = async () => {
        try {
            const res = await characterList()
            if (res && res.personajes) {
                setCharacters(res.personajes)
            }
        } catch (error) {
            console.log(error)
            setNotification({ error: error.message ? error.message : `Hubo un problema: ${error}` })
            setTimeout(() => {
                setNotification({ error: '', exito: '' })
            }, 5000)
        } finally {
            setLoading(false)
        }
    }
    loadCharacters()
}, [setNotification])
```

Al montarse el componente, `useEffect` ejecuta la función asincrónica `loadCharacters`, que realiza una llamada a `characterList()` para obtener la lista de personajes. Si la respuesta es exitosa, se actualiza el estado `characters`. En caso de error, se lanza una notificación. Finalmente, `loading` se marca como `false`.

### `handleFilter` – Filtrado por nombre

```js
const handleFilter = (e) => {
    const value = e.target.value.trim()
    if (!value) {
        setFilter(null) // Si el input está vacío, se limpia el filtro
        return
    }
    const filtered = characters.filter(c =>
        c.nombre.toLowerCase().includes(value.toLowerCase())
    )
    setFilter(filtered)
}
```

Esta función se ejecuta en cada cambio del input de búsqueda. Obtiene el valor ingresado, lo limpia con `.trim()`, y:
- Si está vacío, reinicia el filtro con `setFilter(null)`.
- Si tiene contenido, filtra los personajes y actualiza el estado `filter`.

---

## 🧱 Renderizado

### 🌀 Loading

```js
if (loading) return <p>Cargando...</p>
```

Mientras `loading` sea `true`, se muestra el mensaje `"Cargando..."`. Esto indica que la solicitud para obtener los personajes aún está en curso.

### 🖼️ Contenido principal

```js
return (
    <div>
        <div>
            <h1>Lista de Personajes</h1>
        </div>
        <div className="filter">
            {characters && <input
                type="text"
                placeholder="Ingrese un nombre..."
                onChange={handleFilter}
                id="filter"
            />}
        </div>
        <div>
            <ListCharacters characters={filter ? filter : characters} />
        </div>
    </div>
)
```

Se renderizan:
- Un encabezado con el título `"Lista de Personajes"`.
- Un input de texto para filtrar personajes por nombre.
- El componente `ListCharacters`, que recibe la lista filtrada (`filter`) o completa (`characters`).

---

## 📦 Exportación

```js
export default CharacterIndex
```

Exporta el componente para ser usado en las rutas definidas  en `App.js`.
