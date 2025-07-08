# Controlador de Denuncias

Este archivo contiene el controlador para manejar las funcionalidades relacionadas con las denuncias dentro de la aplicación. Las denuncias pueden estar dirigidas a usuarios o personajes y están disponibles solo para usuarios autenticados.

---

## 📌 `crearDenuncia`

Crea una nueva denuncia.

### Campos requeridos en `req.body`:
- `tipo`: `"User"` o `"Personaje"`
- `id`: ID de la entidad denunciada (usuario o personaje)
- `motivo`: razón breve de la denuncia (máx. 100 caracteres)
- `mensaje`: descripción detallada (máx. 500 caracteres)

### Validaciones:
- Todos los campos deben estar presentes.
- El tipo debe ser válido y la entidad debe existir y estar activa (`estado: true`).
- Límite de caracteres para `motivo` y `mensaje`.

### Ejemplo de respuesta exitosa:
```json
{
  "msj": "Denuncia enviada correctamente"
}
```

---

## 📌 `obtenerDenuncias` (Solo admin)

Obtiene todas las denuncias activas ordenadas por fecha descendente.

### Características:
- Poblado el campo `denunciante` con `userName` y `email`.

### Ejemplo de respuesta:
```json
{
  "denuncias": [ /* array de denuncias */ ]
}
```

---

## 📌 `marcarResuelta` (Solo admin)

Marca una denuncia como resuelta (`estado: false`).

### Parámetros:
- `id`: ID de la denuncia a marcar

### Ejemplo de respuesta:
```json
{
  "msj": "Denuncia marcada como resuelta"
}
```

---

## 📌 `detalleDenuncia`

Devuelve los detalles de una denuncia específica.

### Parámetros:
- `id`: ID de la denuncia

### Características:
- Incluye información del denunciante (`userName`, `email`).

### Ejemplo de respuesta:
```json
{
  "denuncia": { /* objeto denuncia */ }
}
```