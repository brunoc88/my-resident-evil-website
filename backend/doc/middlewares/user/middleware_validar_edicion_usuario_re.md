## 📅 Middleware: validarEdicionUsuario

Este middleware valida los datos enviados por el usuario al editar su perfil. Las validaciones se realizan sobre los cambios detectados previamente en `req.cambios`.

---

### 📁 Requisitos previos

- `req.user` debe contener al usuario autenticado.
- `req.cambios` debe contener los datos a modificar, generados por un middleware anterior.

Si no existen cambios, responde con:

```json
{ "error": "No se detectaron cambios para validar" }
```

---

### ✏️ Sanitización condicional

Se sanitizan sólo los campos presentes:

```js
if ('userName' in data) ...
```

- Se eliminan espacios en blanco.
- Se normaliza la respuesta secreta para evitar errores por tildes y mayúsculas.

---

### ✉️ Validaciones por campo

#### userName

- Requerido si está presente.
- Entre 5 y 10 caracteres.
- No debe tener espacios.

#### email

- Requerido si está presente.
- Sin espacios y con formato válido.

#### password

- Mínimo 5 caracteres.
- Sin espacios.

#### pregunta

- Si se está modificando, no debe ser vacía.

#### respuesta

- Requerida si se modifica.
- Entre 5 y 60 caracteres.

#### sobreMi

- Si se incluye, no debe superar los 150 caracteres.

---

### 🔒 Salida de error

Si hay errores, responde con:

```json
{
  "error": ["mensaje 1", "mensaje 2", ...],
  "data": {
    id: req.user.id,
    userName, email, picture, sobreMi, pregunta, respuesta
  }
}
```

Usa datos de `req.cambios` o los recupera de la base de datos como fallback.

- **Status:** `400`

---

### 🔄 En caso de éxito

Ejecuta:

```js
next()
```

---

Este middleware asegura que sólo se apliquen cambios válidos en la edición del perfil de usuario, mejorando la seguridad y consistencia de la información.

