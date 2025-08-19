# Componente `Notification`

Este componente se encarga de mostrar mensajes de notificación de éxito o error en la interfaz de usuario.

---

## Importaciones

```javascript
import './Notification.css'
```

- Se importa la hoja de estilos para aplicar clases CSS a los mensajes.

---

## Props

- `error`: Mensaje de error a mostrar.
- `exito`: Mensaje de éxito a mostrar.

---

## Lógica del componente

```javascript
const Notification = ({ error, exito }) => {
  if (!error && !exito) return null

  return (
    <div>
      {exito ? <p className="succes-msg">{exito}</p> : <p className="error-msg">{error}</p>}
    </div>
  )
}
```

- Si no hay mensaje de error ni de éxito, no renderiza nada (`return null`).
- Si hay mensaje de éxito (`exito`), se muestra dentro de un párrafo con clase `succes-msg`.
- Si hay mensaje de error (`error`), se muestra dentro de un párrafo con clase `error-msg`.

---

## Export

```javascript
export default Notification
```

- Exporta el componente para poder ser usado en cualquier parte de la aplicación.

---

### Notas

- Es un componente simple y reutilizable para notificaciones.
- Requiere la hoja de estilos `Notification.css` para mostrar los mensajes con formato adecuado.
- Ideal para mostrar mensajes temporales de éxito o error en formularios o interacciones del usuario.

