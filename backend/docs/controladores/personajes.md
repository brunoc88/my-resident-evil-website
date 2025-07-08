# Controlador de Personajes

Este archivo contiene todas las funciones para manejar personajes: creación, listado, edición, eliminación, likes, comentarios y más.

---

## ✍️ `alta`

Crea un nuevo personaje.

### Campos en `req.body`:
- `nombre` (obligatorio)
- `fechaNacimiento` (opcional)
- `edad` (por defecto 'Sin datos')
- `colorOjos` (por defecto 'sin datos')
- `colorPelo` (por defecto 'sin datos')
- `altura` (opcional)
- `peso` (opcional)
- `categoria` (obligatorio)
- `oficio` (por defecto 'sin datos')
- `condicion` (obligatorio)
- `primeraAparicion` (obligatorio)
- `ultimaAparicion` (obligatorio)
- `biografia` (por defecto 'sin datos')

### Archivos:
- Imagen obligatoria: `picture` (middleware `upload.single('picture')`)

### Respuesta exitosa:
```json
{
  "msj": "Éxito, personaje creado!",
  "data": { /* objeto personaje creado */ }
}
```

---

## 🔄 `all`
- Obtiene todos los personajes activos (estado: true).

### Respuesta exitosa:
```json
{
  "personajes": [ /* array de personajes activos */ ]
}
```

---

## 👤 `getPersonaje`
- Obtiene un personaje por su ID.

### Parámetros:
- id en URL (req.params.id)

### Respuesta exitosa:
```json
{ /* objeto personaje */ }
```
### Error si no existe o está inactivo:
```json
{
  "error": "Personaje inexistente o eliminado!"
}
```

--- 

## 🗑️ `eliminar`
- Elimina (desactiva) un personaje por ID.

### Parámetros:
- id en URL (req.params.id)

### Respuesta exitosa:
```json
{
  "msj": "Personaje eliminado!"
}
```
### Error si no existe o está inactivo:
```json
{
  "error": "Personaje eliminado o desactivado!"
}
```

---

## ✏️ `editar`
- Edita un personaje por ID según los cambios validados.

### Parámetros:
- id en URL (req.params.id)

### Cambios recibidos:
- En req.cambios

### Respuesta exitosa:
```json
{
  "msj": "Personaje actualizado!"
}

```

---

## ❤️ `like`
- Agrega un "like" al personaje por parte del usuario autenticado.

### Parámetros:
- id del personaje (req.params.id)

### Respuesta exitosa:
```json
{
  "likes": 5
}
```
### Error si no existe o está inactivo:
```json
{
  "error": "Personaje eliminado o inexistente!"
}
```

---

## 💔 `unlike`
- Remueve el "like" del usuario al personaje.

### Parámetros:
- id del personaje (req.params.id)

### Respuesta exitosa:
```json
{
  "likes": 4
}
```

### Error si no existe o está inactivo:
```json
{
  "error": "Personaje eliminado o inexistente!"
}
```

## 💬 `postearComentario`
- Agrega un comentario a un personaje.

### Parámetros:
- id del personaje (req.params.id)

### Campos en req.body:
- mensaje (obligatorio, máximo 280 caracteres)

### Validaciones:
- Mensaje no vacío.

- Mensaje no excede 280 caracteres.

- Respuesta exitosa:
```json
{
  "msj": "Comentario agregado",
  "comentario": { /* comentario agregado con usuario poblado */ }
}
```

### Errores posibles:
```json
{ "error": "¡Escriba un comentario!" }
```
```json
{ "error": "El comentario pasó el límite de caracteres permitido!" }
```

---

## ✏️ `editarComentario`
- Edita un comentario propio en un personaje.

### Parámetros:
- id personaje (req.params.id)

- idComentario comentario (req.params.idComentario)

### Campos en req.body:
- mensaje (nuevo texto)

### Validaciones:
- Comentario existe y está activo.

- El usuario es autor del comentario.

- Mensaje válido y con cambios.

### Respuesta exitosa:
```json
{
  "msj": "Comentario actualizado",
  "comentario": { /* comentario actualizado */ }
}
```
### Errores posibles:
```json
{ "error": "Comentario eliminado o inexistente" }
```
```json
{ "error": "¡Escriba un comentario!" }
```
```json
{ "error": "El comentario pasó el límite de caracteres permitido!" }
```
```json
{ "error": "No hay cambios" }
```

---

## 🗑️ `eliminarComentario`
- Elimina (oculta) un comentario propio o si eres admin.

### Parámetros:
- id personaje (req.params.id)

- idComentario comentario (req.params.idComentario)

### Validaciones:
- Comentario existe y está activo.

- Usuario es autor o admin.

### Respuesta exitosa:
```json
{
  "msj": "Comentario eliminado correctamente"
}
```
### Errores posibles:
```json
{ "error": "Comentario inexistente o ya eliminado" }
```
```json
{ "error": "No tiene permisos para eliminar este comentario" }
```

## 📋 `getComentarios`
- Obtiene todos los comentarios activos de un personaje.

### Parámetros:
- id personaje (req.params.id)

### Respuesta exitosa:
```json
{
  "comentario": [ /* array de comentarios activos con usuario poblado */ ]
}
```
### Error si no existe o está inactivo:
```json
{
  "error": "Personaje eliminado o inexistente!"
}
```

---

## ⚠️ `Seguridad`
- Solo usuarios autenticados pueden hacer likes y comentarios.

- Validaciones previas y filtros aseguran integridad y permisos.