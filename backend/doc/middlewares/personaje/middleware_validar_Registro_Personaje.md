
# Middleware: validarRegistroPersonaje

Este middleware valida y sanitiza los datos enviados para registrar un nuevo personaje en la base de datos.

---

## Sanitización

- Se eliminan espacios en los campos de texto (`trim`).
- Los colores de ojos y pelo se convierten a minúsculas para uniformidad.
- Los campos numéricos (`altura`, `peso`) se convierten a tipo número si son válidos.

---

## Validaciones

### Campos obligatorios

- **nombre**: obligatorio, entre 3 y 30 caracteres.
- **categoria**: obligatorio, debe ser uno de los siguientes valores: `"héroe"`, `"villano"`, `"neutral"`, `"anti-héroe"`.
- **condicion**: obligatorio, valores válidos: `"vivo"`, `"muerto"`, `"desaparecido"`, `"desconocido"`.
- **primeraAparicion**: obligatorio.
- **ultimaAparicion**: obligatorio.
- **picture**: obligatorio subir una imagen (archivo).

### Validaciones adicionales

- **edad**: si está presente, solo debe contener dígitos.
- **colorOjos** y **colorPelo**: máximo 20 caracteres.
- **altura** y **peso**: deben ser números válidos si se proporcionan.
- **oficio**: máximo 50 caracteres.
- **biografia**: máximo 500 caracteres.

---

## Respuesta en caso de error

- Devuelve un arreglo con todos los errores encontrados.
- Código HTTP: `400 Bad Request`.
- Retorna también los datos sanitizados para facilitar la corrección desde el cliente.

Ejemplo:

```json
{
  "error": [
    "Nombre: Debe tener entre 3 y 30 caracteres",
    "Debe subir una imagen!"
  ],
  "data": {
    "nombre": "Ju",
    "categoria": "héroe",
    "edad": "25",
    "...": "..."
  }
}
```

---

## En caso de éxito

Continúa con el siguiente middleware o controlador mediante `next()`.

---
