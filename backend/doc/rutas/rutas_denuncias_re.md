## 🔄 Rutas de Denuncias (`/api/denuncias`)

Este conjunto de rutas permite a los usuarios crear denuncias y a los administradores gestionarlas. Todas las rutas están protegidas mediante middlewares para garantizar que solo los usuarios autenticados y con el rol adecuado puedan acceder a ellas.

---

### ✅ Middleware aplicado globalmente:

#### `userExtractor`
- Aplica a **todas las rutas** de este archivo.
- Garantiza que el usuario esté autenticado y extrae la información del token.

#### `verifyRole('admin')`
- Aplica a **todas las rutas posteriores a su declaración**.
- Permite el acceso solo a usuarios con rol `admin`.

---

### ✉️ Crear una denuncia (usuario logueado)

#### `POST /`
- **Controlador:** `crearDenuncia`
- **Acceso:** Usuario autenticado (cualquier rol)
- **Descripción:** Permite crear una nueva denuncia indicando el tipo de entidad (`User` o `Personaje`), su ID, motivo y un mensaje.

---

### 📊 Ver todas las denuncias activas (admin)

#### `GET /`
- **Controlador:** `obtenerDenuncias`
- **Acceso:** Solo `admin`
- **Descripción:** Devuelve todas las denuncias cuyo estado sea `true` (pendientes).

---

### 🔎 Ver el detalle de una denuncia por ID (admin)

#### `GET /:id`
- **Controlador:** `detalleDenuncia`
- **Acceso:** Solo `admin`
- **Descripción:** Devuelve los detalles de una denuncia en particular, incluyendo denunciante, entidad denunciada y mensaje.

---

### ✅ Marcar una denuncia como resuelta (admin)

#### `PATCH /:id/resolver`
- **Controlador:** `marcarResuelta`
- **Acceso:** Solo `admin`
- **Descripción:** Cambia el estado de la denuncia a `false` (resuelta).

---

Estas rutas permiten mantener un sistema de moderación eficiente, asegurando que los usuarios puedan reportar contenido y los administradores actuar en consecuencia.

