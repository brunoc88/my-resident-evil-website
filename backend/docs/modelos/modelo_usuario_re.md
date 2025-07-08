## 📄 Modelo de Usuario (`User`)

El modelo `User` define la estructura de los documentos de usuario dentro de la base de datos MongoDB. Utiliza Mongoose para definir validaciones y relaciones. A continuación se detalla cada campo:

---

### 📟 Campos del esquema:

#### `userName`

- **Tipo:** `String`
- **Requerido:** Sí
- **Único:** Sí
- **Restricciones:** Mínimo 5 caracteres, máximo 10
- **Descripción:** Nombre de usuario visible en el sistema.

---

#### `email`

- **Tipo:** `String`
- **Requerido:** Sí
- **Único:** Sí
- **Validación:** Email válido (usando `validator.isEmail`)
- **Descripción:** Correo electrónico asociado al usuario.

---

#### `password`

- **Tipo:** `String`
- **Requerido:** Sí
- **Restricciones:** Mínimo 5 caracteres
- **Descripción:** Contraseña del usuario (encriptada antes de guardar).

---

#### `rol`

- **Tipo:** `String`
- **Asignación:** Se establece desde el controlador al momento del registro según la ruta.
- **Valores posibles:** `"admin"` o `"comun"`
- **Descripción:** Define los permisos del usuario dentro de la plataforma.

---

#### `pregunta`

- **Tipo:** `String`
- **Requerido:** Sí
- **Descripción:** Pregunta secreta seleccionada desde un menú desplegable (`<select>`), utilizada para recuperación de contraseña.

---

#### `respuesta`

- **Tipo:** `String`
- **Requerido:** Sí
- **Restricciones:** Mínimo 5 y máximo 60 caracteres
- **Descripción:** Respuesta secreta vinculada a la pregunta para recuperar contraseña.

---

#### `sobreMi`

- **Tipo:** `String`
- **Requerido:** No
- **Restricciones:** Máximo 150 caracteres
- **Descripción:** Campo opcional donde el usuario puede escribir una breve descripción sobre sí mismo. Si se deja vacío, se asigna `"sin descripción"` desde el controlador.

---

#### `estado`

- **Tipo:** `Boolean`
- **Valor por defecto:** `true`
- **Descripción:** Indica si la cuenta está activa (`true`) o desactivada/baneada (`false`). Este campo se utiliza para restringir el acceso a funcionalidades.

---

#### `picture`

- **Tipo:** `String`
- **Valor por defecto:** `"default.png"`
- **Descripción:** Imagen de perfil del usuario. Si no se proporciona una, se asigna una imagen por defecto.

---

#### `fechaCreacion`

- **Tipo:** `Date`
- **Valor por defecto:** Fecha actual (`Date.now`)
- **Descripción:** Fecha en la que se creó la cuenta. Se utiliza para calcular la antigüedad del usuario.

---

#### `bloqueos`

- **Tipo:** `[ObjectId]`
- **Referencias:** Modelo `User`
- **Descripción:** Lista de usuarios que el usuario ha bloqueado. Esto evita el envío y recepción de mensajes entre ellos.

---

#### `mensajes`

- **Tipo:** Subdocumento embebido (`mensajeSchema`)
- **Descripción:** Lista de mensajes recibidos por el usuario. Cada mensaje incluye campos como texto, fecha y remitente (ver definición del subdocumento `mensajes`).

---

### 🔐 Seguridad en la respuesta JSON

El modelo redefine `toJSON` para ocultar información sensible al devolver los datos al cliente:

```js
delete returnedObject._id
delete returnedObject.__v
delete returnedObject.password
```

Además, se agrega un campo `id` con el valor de `_id` como string para facilitar su uso en el frontend.

