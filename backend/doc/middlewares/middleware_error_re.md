## ⚠️ Middleware de Manejo de Errores

Este middleware captura errores lanzados durante el procesamiento de peticiones en el backend y devuelve respuestas coherentes al cliente. Centraliza la gestión de errores comunes como validaciones, duplicados y formatos inválidos.

---

### 🔒 Estructura del Middleware

```js
const errorHandler = (error, req, res, next) => { ... }
```
- Se define como middleware de Express con los cuatro parámetros (`error`, `req`, `res`, `next`).
- Se debe colocar al final del archivo principal para capturar errores de toda la aplicación.

---

### 🔀 Casos manejados

#### 1. `ValidationError`
- Provocado por mongoose al fallar una validación.
- Se devuelve un array con todos los mensajes de error individuales.
- **Status:** `400`

#### 2. `11000` (Error de clave duplicada)
- Provocado por campos `unique` como `email` o `userName` repetidos.
- Se devuelve un mensaje personalizado indicando el campo repetido.
- **Status:** `400`

#### 3. `CastError`
- Provocado por IDs mal formados (por ejemplo, al hacer `findById` con una string incorrecta).
- **Status:** `400`

#### 4. Cualquier otro error
- Respuesta genérica indicando "Error del servidor" con el detalle.
- **Status:** `500`

---

### 🔐 Datos incluidos
- En los errores de validación o duplicados, se incluye el cuerpo original enviado (`req.body`) como `data` para facilitar debugging desde el frontend.

---

Este middleware mejora la experiencia del desarrollador y del cliente al brindar mensajes claros y consistentes sobre errores ocurridos en la API.

