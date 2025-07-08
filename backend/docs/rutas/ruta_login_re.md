## 🔄 Ruta de Login (`/api/login`)

Esta ruta permite a los usuarios autenticarse en el sistema. Se aplica una validación previa para asegurar que se están enviando los datos correctamente.

---

### 🔐 Inicio de sesión

#### `POST /`
- **Middlewares:** `validarLogin`
- **Controlador:** `login`
- **Descripción:**
  - Recibe un objeto con `user` y `password`.
  - Verifica si el usuario existe y la contraseña es correcta.
  - Si es válido, devuelve un token JWT junto con información del usuario.

---

### ⚖️ Validación previa (`validarLogin`)

Este middleware asegura que:
- Los campos `user` y `password` estén presentes.
- Comprueba la existencia del usuario.

---

### 🔒 Respuesta exitosa incluye:
- `token`: JWT para futuras autenticaciones.
- `userName`, `rol`, `id`, `email`, `picture`: para usar en el frontend.

---

Esta ruta es fundamental para proteger el acceso a las funcionalidades del sistema. El token JWT devuelto debe enviarse luego en las cabeceras de autorización.

