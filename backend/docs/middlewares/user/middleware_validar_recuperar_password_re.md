## 🔐 Middleware: validarRecuperarPassword

Este middleware valida la solicitud para recuperar contraseña mediante email y respuesta secreta.

---

### ✏️ Sanitización inicial

```js
req.body.email = req.body.email?.trim().toLowerCase() || ''
req.body.respuesta = req.body.respuesta?.trim().toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || ''
```

- Se eliminan espacios, se convierten a minúsculas y se normaliza la respuesta para facilitar la comparación.

---

### ✉️ Validaciones aplicadas

- **Presencia de campos:**

  - `email` es obligatorio.
  - `respuesta` es obligatoria.

- **Validación de **``**:**

  - Longitud entre 5 y 60 caracteres.

- **Validación de **``**:**

  - No debe contener espacios.
  - Debe tener un formato válido (`nombre@dominio.com`).

---

### 🔒 Salida de error

Si hay errores, responde con:

```json
{
  "error": ["mensaje 1", "mensaje 2", ...]
}
```

- **Status:** `400`

---

### 🔄 En caso de éxito

Si todo está correcto:

```js
next()
```

---

Este middleware protege el proceso de recuperación de contraseña asegurando que los datos proporcionados tengan el formato correcto antes de consultar la base de datos.

