# Componente: Searching

## 📌 Descripción general
Componente que permite buscar usuarios en la base de datos por su nombre de usuario y mostrarlos en una lista filtrada.  
Cada usuario encontrado muestra su imagen de perfil y un enlace a su página de perfil.

---

## 🧹 Importaciones
```js
import { useState, useEffect } from "react"
import { Link, useOutletContext } from "react-router-dom"
import { getUsers } from "../../services/user"
import './List.css'
```
- `useEffect` y `useState`: Para manejar el ciclo de vida y los estados locales.
- `useOutletContext`: Para obtener funciones como `setNotification`.
- `Link`: Para ir a una ruta.
- `getUsers`: Funcion para obtener todos los usuarios del backend.
- `List.css`: Estilos para el componente.

---
## Contexto Usado
- `setNotification` (desde `useOutletContext`): función para mostrar mensajes de error o éxito.
---

## Hooks Utilizados
- **useState**
  - `filter`: almacena la lista filtrada de usuarios según el texto ingresado.
  - `users`: lista completa de usuarios obtenidos del servidor.
- **useEffect**
  - Llama a la función `getUsers()` al montar el componente para obtener todos los usuarios.

---

## Funciones Internas
- **loadUsers**:  
  Llama a la API `getUsers()` para obtener la lista de usuarios y almacenarla en `users`.  
  Si ocurre un error, se muestra mediante `setNotification`.
```js
 useEffect(() => {
        const loadUsers = async () => {
            try {
                const res = await getUsers()
                if (res) {
                    setUsers(res)
                }
            } catch (error) {
                setNotification({ error: error.message || `hubo un problema ${error}`, exito: '' })
                setTimeout(() => {
                    setNotification({ error: '', exito: '' })
                }, 5000)
            }
        }
        if (!users) loadUsers()
    }, [])
  
```
- **handleFilter(e)**:  
  Filtra la lista `users` comparando `userName` con el valor ingresado en el input.  
  Si el campo está vacío, se limpia el filtro (`filter` se establece en `null`).

```js
    const handleFilter = (e) => {
        let value = e.target.value

        if (!value.trim()) {
            SetFilter(null)
            return
        }

        const searching = users.filter(user =>
            user.userName.toLowerCase().includes(value.trim().toLowerCase())
        )
        SetFilter(searching)
    }

    const result = filter ? filter : ''
```
---

## 🧱 Flujo de Renderizado

```js
 return (
        <div className="list-container">
            <div>
                <h1>Busqueda de Usuario</h1>
            </div>
            
                <input type="text"
                    placeholder="Ingrese un nombre de usuario..."
                    onChange={handleFilter}
                    className="filter-input"
                />
            
            <ul className="user-list">
                {result && result.length > 0 ? (
                    <>
                        {result.map(u => (
                            <li key={u.id}>
                                <div className="user-info">
                                    <img src={`http://localhost:3000/uploads/${u.picture}`} alt="profile" />
                                    <Link to={`/user/perfil/${u.userName}`} className="user-name">
                                        {u.userName}
                                    </Link>
                                </div>
                                
                            </li>
                        ))}
                    </>) : (<div></div>)
                }
            </ul>
        </div>
    )


```
1. Muestra el título **"Búsqueda de Usuario"**.
2. Muestra un campo de texto (`input`) para ingresar el nombre de usuario.
3. Filtra los resultados en tiempo real mientras el usuario escribe.
4. Si hay resultados, muestra:
   - Imagen de perfil.
   - Nombre de usuario con enlace a su perfil.
5. Si no hay resultados, no se muestra ningún mensaje, solo la lista vacía.

---
## 📦 Exportación

```js
export default Searching
```

- Exporta el componente para ser usado en las rutas de usuarios autenticados.

---