## ✍️ Middleware: validarCambios

Este middleware analiza los cambios enviados en el `req.body` y determina si efectivamente se modificó información respecto al usuario registrado en la base de datos. En caso afirmativo, guarda los cambios en `req.cambios` para que el siguiente middleware los valide.

---

### ℹ️ Requisitos previos
- El usuario debe estar autenticado (viene en `req.user`).
- El `id` del usuario a editar debe venir por `req.params.id`.

---

### 📁 Proceso general

1. **Buscar al usuario en la base de datos:**
   - Si no se encuentra o está inactivo (`estado === false`), responde con error 404 o 403.
   - Si el usuario autenticado no coincide con el del `id`, lanza error 403 (sin permisos).

2. **Comparar campo por campo:**
   - `userName`, `email`, `pregunta`, `respuesta`, `sobreMi`: se agregan a `cambios` si son distintos.
   - `password`: se compara usando `bcrypt.compare()`. Si cambió, se hashea y se guarda.
   - `picture`: si se cargó un nuevo archivo y el nombre es distinto, se actualiza.

3. **Verificar si hay cambios:**
   - Si no hay diferencias detectadas, responde con error 400: `"No hay cambios!"`.

4. **Pasar al siguiente middleware:**
   - Si hay cambios, los guarda en `req.cambios` y llama a `next()`.

---

### ⚠️ Posibles errores

- `404`: Usuario no encontrado.
- `403`: Usuario inactivo o no autorizado.
- `400`: No se enviaron cambios reales.

---

### 🔄 En caso de éxito
El objeto `req.cambios` estará disponible para los siguientes middlewares de validación.

---

Este middleware mejora la eficiencia del sistema evitando validaciones y escritura innecesarias si no hubo cambios reales en los datos del usuario.

