## 📅 Middleware: validarRegistro

Este middleware valida el cuerpo de la solicitud de registro de usuario antes de que llegue al controlador. Garantiza que los datos sean coherentes, completos y sanitizados.

---

### ✏️ Sanitización inicial

```js
data.userName = data.userName?.trim()
data.email = data.email?.trim().toLowerCase()
data.password = data.password?.trim()
data.pregunta = data.pregunta?.trim()
data.respuesta = data.respuesta?.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
```

- Se eliminan espacios en blanco y se normaliza la respuesta para evitar problemas con acentos o mayúsculas a la hora de compararla más adelante.

---

### ✉️ Validaciones aplicadas

#### 1. **Campos obligatorios:**

- Verifica que todos los campos requeridos estén presentes: `userName`, `email`, `password`, `pregunta`, `respuesta`.

#### 2. **userName:**

- Debe tener entre 5 y 10 caracteres.
- No debe contener espacios.

#### 3. **email:**

- No debe contener espacios.
- Debe tener formato válido.

#### 4. **password:**

- Mínimo 5 caracteres.
- No debe contener espacios.

#### 5. **respuesta:**

- Entre 5 y 60 caracteres.
- Se guarda sanitizada para facilitar su comparación segura.

#### 6. **sobreMi (opcional):**

- Si está presente, no debe superar los 150 caracteres.

---

### 🔒 Salida de error

- Si se detecta al menos un error, devuelve:

```json
{
  "error": ["mensaje 1", "mensaje 2", ...],
  "data": {
    ...campos recibidos...
  }
}
```

- **Status:** `400`

---

### 🔀 En caso de éxito

Si todas las validaciones se cumplen, ejecuta:

```js
next()
```

y deja continuar al controlador de registro.

---

Este middleware mejora la seguridad y consistencia de los datos de entrada y previene errores comunes antes de interactuar con la base de datos.

