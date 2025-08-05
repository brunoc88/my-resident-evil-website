## 🔄 Rutas de Usuarios (`/api/usuarios`)

Este archivo de rutas maneja todo lo relacionado con usuarios: registro, autenticación, perfil, edición, mensajes, bloqueos y administración por parte de los `admin`.

---

### 👤 Registro y Recuperación (públicas)

#### `POST /registro`
- **Middlewares:** `upload.single('picture')`, `validarRegistro`
- **Controlador:** `altaUser`
- **Descripción:** Registra un nuevo usuario con imagen opcional.

#### `POST /registroAdmin`
- **Middlewares:** `upload.single('picture')`, `validarRegistro`
- **Controlador:** `altaUserAdmin`
- **Descripción:** Registra un nuevo usuario con rol admin. Sólo debería usarse en contexto controlado.

#### `POST /recuperar-password`
- **Middleware:** `validarRecuperarPassword`
- **Controlador:** `recuperarPassword`
- **Descripción:** Permite recuperar el password validando pregunta y respuesta de seguridad.

---

### 🔒 Rutas protegidas (usuario autenticado)

Middleware global:
- `userExtractor`

#### `GET /perfil/:userName`
- **Controlador:** `perfil`
- **Descripción:** Devuelve el perfil público de otro usuario por su userName.

#### `GET /miPerfil`
- **Controlador:** `miPerfil`
- **Descripción:** Devuelve el perfil del usuario autenticado.

#### `PATCH /eliminar/:id`
- **Controlador:** `eliminarCuenta`
- **Descripción:** Permite al propio usuario o a un admin desactivar la cuenta (estado `false`).

#### `PUT /editar/:id`
- **Middlewares:** `upload.single('picture')`, `validarCambios`, `validarEdicionUser`
- **Controlador:** `editarUsuario`
- **Descripción:** Edita los datos del usuario logueado.

#### `GET /allLikes`
- **Controlador:** `allLikes`
- **Descripción:** Devuelve todos los personajes que le han gustado al usuario autenticado.

---

### 🤜 Administración (solo admin)

#### `PATCH /reActivar/:id`
- **Middleware:** `verifyRole('admin')`
- **Controlador:** `reactivarCuenta`
- **Descripción:** Reactiva la cuenta de un usuario baneado.

#### `GET /baneados`
- **Middleware:** `verifyRole('admin')`
- **Controlador:** `listaDeBaneados`
- **Descripción:** Devuelve todos los usuarios con estado `false` (baneados).

---

### 📨 Mensajes

#### `POST /mensaje/:id`
- **Middleware:** `verifyBlock`
- **Controlador:** `mandarMensaje`
- **Descripción:** Envía un mensaje a otro usuario si no está bloqueado.

#### `PATCH /mensaje/:id`
- **Controlador:** `eliminarMensaje`
- **Descripción:** Elimina (oculta) un mensaje enviado.

#### `GET /mensajes`
- **Controlador:** `allMsj`
- **Descripción:** Devuelve todos los mensajes recibidos.

#### `GET /mensajes/chat/:id`
- **Controlador:** `getHiloConversacion`
- **Descripción:** Devuelve el hilo de conversación entre dos usuarios.

#### `GET /mensajes/resumen`
- **Controlador:** `resumenMensajes`
- **Descripción:** Devuelve una vista resumen del último mensaje por conversación.

---

### ❌ Bloqueos

#### `POST /bloquear/:id`
- **Middleware:** `verifyBlock`
- **Controlador:** `bloquear`
- **Descripción:** Bloquea al usuario indicado, impidiendo futuros mensajes.

#### `DELETE /desbloquear/:id`
- **Controlador:** `desbloquear`
- **Descripción:** Elimina el bloqueo hacia otro usuario.

#### `GET /bloqueados`
- **Controlador:** `listaBloqueados`
- **Descripción:** Devuelve la lista de usuarios que el usuario actual ha bloqueado.

---

## 👤 Seguimientos 

### 👤 Seguir Usuario

#### `PATCH /seguir/:id`
- **Middleware:** `verifyBlock`
- **Controlador:** `seguirUsuario`
- **Descripción:** Permite seguir a un usuario.

### 👤 Dejar de Seguir Usuario

#### `PATCH /dejarDeSeguir/:id`
- **Controlador:** `dejarDeSeguirUsuario`
- **Descripción:** Permite dejar de seguir a un usuario.

### 👤 Todos mis seguidos

#### `GET /misSeguidos`
- **Controlador:** `misSeguidos`
- **Descripción:** Permite obtener el listado de usuario que sigo.

### 👤 Todos mis seguidores

#### `GET /misSeguidores`
- **Controlador:** `misSeguidores`
- **Descripción:** Permite obtener el listado de usuario que me siguen.

Este archivo de rutas gestiona la mayor parte de la interacción entre usuarios, incluyendo mensajería, edición de perfiles, bloqueos y funciones administrativas.

