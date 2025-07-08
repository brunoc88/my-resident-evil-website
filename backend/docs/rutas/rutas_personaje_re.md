## 🔄 Rutas de Personajes (`/api/personajes`)

Este conjunto de rutas permite visualizar, registrar, editar, eliminar y comentar personajes del universo Resident Evil. Incluye funcionalidades de likes, comentarios, validaciones y carga de imagenes.

---

### 🔍 Rutas públicas

#### `GET /all`
- **Controlador:** `all`
- **Acceso:** Público
- **Descripción:** Devuelve todos los personajes activos (estado `true`).

#### `GET /:id`
- **Controlador:** `getPersonaje`
- **Acceso:** Público
- **Descripción:** Devuelve los datos completos de un personaje específico según su ID.

---

### 🔒 Rutas protegidas (usuario logueado)

Middleware aplicado:
- `userExtractor`: Verifica que el usuario esté autenticado.

---

#### `POST /alta`
- **Middlewares:** `upload.single('picture')`, `validarRegistroPersonaje`
- **Controlador:** `alta`
- **Descripción:** Permite registrar un nuevo personaje con una imagen. Valida datos antes de persistir.

---

#### `PUT /editar/:id`
- **Middlewares:** `upload.single('picture')`, `validarCambiosPersonaje`, `validarEdicionPersonaje`
- **Controlador:** `editar`
- **Descripción:** Permite editar un personaje. La imagen puede actualizarse y se validan los cambios ingresados.

---

#### `PATCH /eliminar/:id`
- **Middleware:** `verifyRole('admin')`
- **Controlador:** `eliminar`
- **Descripción:** Solo un administrador puede eliminar un personaje. Se cambia su estado a `false`.

---

### 🔍 Likes

#### `PATCH /:id/like`
- **Controlador:** `like`
- **Descripción:** El usuario logueado da like al personaje. Solo una vez por usuario.

#### `PATCH /:id/unlike`
- **Controlador:** `unlike`
- **Descripción:** Elimina el like previamente dado por el usuario al personaje.

---

### 💬 Comentarios

#### `POST /:id/comentario`
- **Controlador:** `postearComentario`
- **Descripción:** Agrega un comentario al personaje por parte del usuario logueado.

#### `PUT /:id/comentario/:idComentario`
- **Controlador:** `editarComentario`
- **Descripción:** Permite editar un comentario propio.

#### `PATCH /:id/comentario/:idComentario`
- **Controlador:** `eliminarComentario`
- **Descripción:** Marca un comentario como inactivo (eliminado) sin borrarlo de la base de datos.

#### `GET /:id/comentarios`
- **Controlador:** `getComentarios`
- **Descripción:** Devuelve todos los comentarios activos de un personaje en particular.

---

Este conjunto de rutas habilita toda la lógica necesaria para gestionar personajes dentro de la aplicación, integrando seguridad, validaciones, archivos multimedia y feedback de los usuarios.

