## 📄 Subdocumento Comentario (`comentarioSchema`)

Este subdocumento es utilizado dentro del modelo `Personaje` para representar los comentarios que los usuarios realizan sobre un personaje. Cada comentario está vinculado a un usuario y cuenta con fecha y estado de visibilidad.

---

### 📟 Campos del esquema:

#### `usuario`
- **Tipo:** `ObjectId`
- **Referencia:** `User`
- **Requerido:** Sí
- **Descripción:** Usuario que escribió el comentario.

---

#### `mensaje`
- **Tipo:** `String`
- **Requerido:** Sí
- **Restricciones:** Máximo 280 caracteres
- **Descripción:** Contenido del comentario.

---

#### `fecha`
- **Tipo:** `Date`
- **Valor por defecto:** `Date.now`
- **Descripción:** Fecha en la que se realizó el comentario.

---

#### `estado`
- **Tipo:** `Boolean`
- **Valor por defecto:** `true`
- **Descripción:** Indica si el comentario está activo (`true`) o fue ocultado/moderado (`false`).

---

Este subdocumento permite gestionar comentarios asociados a personajes, incluyendo moderación (mediante el campo `estado`) y trazabilidad del autor (mediante la referencia a `User`).

