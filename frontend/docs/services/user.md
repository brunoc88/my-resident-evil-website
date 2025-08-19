
# 📄 Servicios de Usuario

Este archivo contiene funciones para interactuar con el backend relacionadas con usuarios, autenticación, perfiles, seguidores, bloqueos, mensajes y administración.

---

## 🔹 Importaciones

```js
import handleAxiosError from '../utils/handleAxiosError'
import { getToken } from './token'
import api from './api'
```

- **handleAxiosError**: Maneja errores de Axios.
- **getToken**: Obtiene el token JWT almacenado.
- **api**: Instancia de Axios configurada para el backend.

---

## 🔹 Funciones

### 1. `userPost(user)`
Registra un nuevo usuario estándar.

- **Parámetros**:  
  - `user` (Object): Datos del usuario a registrar.
- **Retorna**: Datos del usuario registrado.

### 2. `userAdminPost(user)`
Registra un nuevo usuario con permisos de administrador.

- **Parámetros**:  
  - `user` (Object): Datos del usuario administrador.
- **Retorna**: Datos del usuario registrado.

### 3. `passwordRecovery(data)`
Solicita la recuperación de contraseña.

- **Parámetros**:  
  - `data` (Object): Información requerida para recuperación.
- **Retorna**: Respuesta del servidor.

### 4. `myProfile()`
Obtiene los datos del perfil del usuario autenticado.

- **Parámetros**: Ninguno.
- **Retorna**: Datos del perfil.

### 5. `userEdit(id, data)`
Edita los datos de un usuario.

- **Parámetros**:  
  - `id` (String): ID del usuario a editar.  
  - `data` (Object): Nuevos datos del usuario.
- **Retorna**: Datos actualizados del usuario.

### 6. `myFollowers()`
Obtiene los seguidores del usuario autenticado.

- **Retorna**: Lista de seguidores.

### 7. `myFollowed()`
Obtiene los usuarios que el usuario autenticado sigue.

- **Retorna**: Lista de seguidos.

### 8. `userProfile(userName)`
Obtiene el perfil de otro usuario.

- **Parámetros**:  
  - `userName` (String): Nombre de usuario.
- **Retorna**: Datos del perfil.

### 9. `follow(id)`
Sigue a un usuario.

- **Parámetros**:  
  - `id` (String): ID del usuario a seguir.
- **Retorna**: Respuesta del servidor.

### 10. `unFollow(id)`
Deja de seguir a un usuario.

- **Parámetros**:  
  - `id` (String): ID del usuario a dejar de seguir.
- **Retorna**: Respuesta del servidor.

### 11. `deleteAccount(id)`
Elimina la cuenta del usuario (soft delete).

- **Parámetros**:  
  - `id` (String): ID de la cuenta.
- **Retorna**: Respuesta del servidor.

### 12. `block(id)`
Bloquea a un usuario.

- **Parámetros**:  
  - `id` (String): ID del usuario a bloquear.
- **Retorna**: Respuesta del servidor.

### 13. `unBlock(id)`
Desbloquea a un usuario.

- **Parámetros**:  
  - `id` (String): ID del usuario a desbloquear.
- **Retorna**: Respuesta del servidor.

### 14. `blockList()`
Obtiene la lista de usuarios bloqueados.

- **Retorna**: Lista de bloqueados.

### 15. `bannedList()`
Obtiene la lista de usuarios baneados.

- **Retorna**: Lista de baneados.

### 16. `getUsers()`
Obtiene todos los usuarios registrados.

- **Retorna**: Lista de usuarios.

### 17. `reactivateAccount(id)`
Reactiva una cuenta previamente eliminada.

- **Parámetros**:  
  - `id` (String): ID de la cuenta.
- **Retorna**: Respuesta del servidor.

### 18. `messageResumen()`
Obtiene un resumen de los mensajes del usuario.

- **Retorna**: Resumen de mensajes.

### 19. `sendMessage(id, data)`
Envía un mensaje a otro usuario.

- **Parámetros**:  
  - `id` (String): ID del destinatario.  
  - `data` (Object): Contenido del mensaje.
- **Retorna**: Respuesta del servidor.

### 20. `getChats(id)`
Obtiene el historial de chats con un usuario.

- **Parámetros**:  
  - `id` (String): ID del usuario.
- **Retorna**: Lista de mensajes.

### 21. `deleteMessage(id)`
Elimina un mensaje enviado o recibido.

- **Parámetros**:  
  - `id` (String): ID del mensaje.
- **Retorna**: Respuesta del servidor.

---

## 🔹 Exportaciones

```js
export {
  userPost,
  userAdminPost,
  passwordRecovery,
  myProfile,
  userEdit,
  myFollowers,
  myFollowed,
  userProfile,
  follow,
  unFollow,
  deleteAccount,
  block,
  unBlock,
  blockList,
  bannedList,
  getUsers,
  reactivateAccount,
  messageResumen,
  sendMessage,
  getChats,
  deleteMessage
}
```

**Nota**: Todas las funciones que requieren autenticación revisan el token y configuran los headers `Authorization`. Los errores se manejan centralizadamente con `handleAxiosError`.
