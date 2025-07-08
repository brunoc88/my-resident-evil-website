## 📄 Subdocumento Mensaje (`mensajeSchema`)

Este subdocumento representa los mensajes enviados entre usuarios. Está embebido en el modelo `User` y permite funcionalidades como mensajería directa, respuestas y moderación.

---

### 📟 Campos del esquema:

#### `usuario`
- **Tipo:** `ObjectId`
- **Referencia:** `User`
- **Requerido:** Sí
- **Descripción:** Usuario que envía el mensaje.

---

#### `mensaje`
- **Tipo:** `String`
- **Requerido:** Sí
- **Restricciones:** Máximo 280 caracteres
- **Descripción:** Contenido del mensaje.

---

#### `fecha`
- **Tipo:** `Date`
- **Valor por defecto:** `Date.now`
- **Descripción:** Fecha en la que se envió el mensaje.

---

#### `estado`
- **Tipo:** `Boolean`
- **Valor por defecto:** `true`
- **Descripción:** Indica si el mensaje está activo (`true`) o fue eliminado/bloqueado (`false`).

---

#### `replyTo`
- **Tipo:** `ObjectId`
- **Valor por defecto:** `null`
- **Descripción:** ID del mensaje al que está respondiendo. Permite formar hilos de conversación.

---

Este subdocumento permite estructurar un sistema de mensajería entre usuarios, con posibilidad de respuesta directa y gestión de estado para ocultar o eliminar mensajes.

