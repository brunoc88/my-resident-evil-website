## ❓ Middleware: unknownEndpoint

Este middleware captura todas las solicitudes realizadas a rutas que no existen en la API y devuelve una respuesta estandarizada al cliente.

---

### 🧠 Propósito
- Evita que el servidor responda con mensajes genéricos de error cuando el usuario accede a una ruta inválida.
- Brinda una respuesta clara y controlada: `404 Not Found`.

---

### ⚙️ Implementación
```js
const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: 'Endpoint no encontrado' });
};

module.exports = unknownEndpoint;
```

---

### ✅ Resultado
- **Código de estado:** `404`
- **Respuesta JSON:**
```json
{
  "error": "Endpoint no encontrado"
}
```

---

### 🧩 Ubicación recomendada en la app
Debe usarse *después* de todas las rutas definidas, y *antes* del middleware de manejo de errores:

```js
app.use(unknownEndpoint);
app.use(errorHandler);
```

---

Este middleware es útil para mantener una API profesional, robusta y clara ante solicitudes incorrectas por parte del cliente o del frontend.

