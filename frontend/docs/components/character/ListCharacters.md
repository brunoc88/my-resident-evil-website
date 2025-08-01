
# 📄 Componente: `ListCharacters`

## 📌 Descripción General

El componente `ListCharacters` es un componente de presentación encargado de mostrar una grilla de tarjetas con los personajes pasados como prop. Cada tarjeta incluye una imagen, el nombre del personaje y un botón para acceder a su perfil individual.

---

## 🧹 Importaciones

```js
import { Link } from "react-router-dom"
import "./ListCharacters.css" 
```

- `Link`: componente de React Router para navegación sin recarga.
- `./ListCharacters.css`: hoja de estilos asociada al diseño de las tarjetas.

---

## ⚙️ Props

```js
const ListCharacters = ({ characters = [] })
```

- `characters`: prop obligatoria que contiene un array de objetos personaje. Se inicializa por defecto como un array vacío para evitar errores si se pasa `undefined`.

---

## 🔄 Lógica del Componente

### Validación de personajes

```js
const safeCharacters = characters ?? [];
if (safeCharacters.length === 0) return <div><h1>No hay personajes registrados o con esas caracteristicas!</h1></div>;
```

- Se asegura que `characters` no sea `null` o `undefined` usando `?? []`.
- Si no hay personajes, se muestra un mensaje indicando que no hay resultados.

### Renderizado de tarjetas

```js
<div className="cardContainer">
    {safeCharacters.map(c => (
        <div key={c.id} className="card">
            <Link to={`/personajes/${c.id}`}>
                <img
                    src={`http://localhost:3000/uploads/${c.picture}`}
                    alt={`profile${c.nombre}`}
                    className="character-img"
                />
                <h3 className="character-name">{c.nombre}</h3>
                <button className="view-btn">Ver</button>
            </Link>
        </div>
    ))}
</div>
```

- Se itera sobre `safeCharacters` para generar una tarjeta por personaje.
- Cada tarjeta incluye:
  - Imagen del personaje.
  - Nombre en un `h3`.
  - Botón `"Ver"` para acceder a los detalles.
- Todo está envuelto en un `Link` que redirige a la vista `/personajes/:id`.

---

## 🧱 Estilos CSS

Se asume que los estilos de `.cardContainer`, `.card`, `.character-img`, `.character-name`, y `.view-btn` están definidos en `ListCharacters.css`.

---

## 📦 Exportación

```js
export default ListCharacters
```

El componente se exporta como `default` para poder ser utilizado en otras vistas como `CharacterIndex`.
