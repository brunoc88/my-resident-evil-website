# 🛠️ Middleware: validarEdicionPersonaje

Este middleware valida los datos enviados para la edición de un personaje, basándose en los cambios detectados previamente en `req.cambios`.

---

## 📋 Requisitos previos

- `req.cambios` debe contener los campos a modificar.
- `req.params.id` debe contener el ID del personaje a editar.
- `req.file` puede contener una nueva imagen subida para el personaje.

---

## ✏️ Sanitización condicional

Sólo se sanitizan los campos presentes en `req.cambios`:

- Elimina espacios innecesarios.
- Convierte algunos campos a minúsculas.
- Convierte algunos campos numéricos a Number.

---

## ✅ Validaciones

- **nombre**: obligatorio si está presente, entre 3 y 30 caracteres.
- **edad**: si existe, debe ser sólo números.
- **colorOjos**: máximo 20 caracteres.
- **colorPelo**: máximo 20 caracteres.
- **altura**: debe ser un número válido.
- **peso**: debe ser un número válido.
- **oficio**: máximo 50 caracteres.
- **biografia**: máximo 500 caracteres.
- **categoria**: obligatorio si está presente y debe ser uno de los valores válidos: `héroe`, `villano`, `neutral`, `anti-héroe`.
- **condicion**: obligatorio si está presente y debe ser uno de los valores válidos: `vivo`, `muerto`, `desaparecido`, `desconocido`.
- **primeraAparicion**: obligatorio si está presente.
- **ultimaAparicion**: obligatorio si está presente.
- **picture**: si está en cambios, debe haber un archivo nuevo (`req.file`).

---

## 🚨 Respuesta en caso de error

Si hay errores, responde con:

```json
{
  "error": ["mensaje de error 1", "mensaje de error 2", "..."],
  "data": {
    "nombre": "...",
    "edad": "...",
    "colorOjos": "...",
    "colorPelo": "...",
    "altura": "...",
    "peso": "...",
    "oficio": "...",
    "biografia": "...",
    "categoria": "...",
    "condicion": "...",
    "primeraAparicion": "...",
    "ultimaAparicion": "...",
    "picture": "...",
    "id": "..."
  }
}

---

## 🎯 En caso de éxito
  next()