# Controlador de Usuarios

Este archivo contiene todas las funciones relacionadas con la gestión de usuarios: creación, autenticación, edición, perfil, mensajes, bloqueos y administración.

---

## ✍️ `altaUser`

Crea un nuevo usuario común.

### Campos requeridos en `req.body`:
- `userName`
- `email`
- `password`
- `pregunta` (de seguridad)
- `respuesta` (de seguridad)
- `sobreMi` (opcional)

### Archivos:
- Imagen opcional: `picture` (middleware `upload.single('picture')`)

### Características:
- Convierte `userName` y `email` a minúsculas.
- Hashea la contraseña antes de guardar.
- Si no hay imagen, asigna `default.png`.

### Ejemplo de respuesta exitosa:
```json
{
  "msj": "Usuario creado con éxito",
  "user": { /* objeto usuario creado */ }
}
```

---

## ✍️ `altaUserAdmin`

Crea un nuevo usuario con rol admin.

### Campos requeridos en req.body:
- Igual que altaUser

- Además, secreto: clave secreta para validar permiso admin

### Validaciones:
- La clave secreta debe coincidir con CLAVE_SECRETA_ADMIN.

- No se permiten espacios en la clave secreta.

### Ejemplo de respuesta exitosa:
```json
{
  "msj": "Usuario creado con éxito",
  "user": { /* objeto usuario admin creado */ }
}
```
---

## 👤 `perfil`
- Obtiene el perfil público de un usuario por su userName.

### Parámetros:
- userName en la URL (req.params.userName)

### Respuesta en caso de éxito:
```json
{
  "user": { /* objeto perfil público */ }
}
```

### Error si no existe o está inactivo:
```json
{
  "error": "Usuario no encontrado o cuenta eliminada"
}
```

---

## 👤 `miPerfil`
-Obtiene el perfil del usuario autenticado.

### Uso:
-Toma el usuario directamente de req.user.

### Respuesta en caso de éxito:
```json
{
  "user": { /* objeto perfil propio */ }
}
```

---

## 🗑️ `eliminarCuenta`
- Permite eliminar (desactivar) la cuenta propia o de un usuario común (solo admins pueden eliminar otras cuentas).

### Parámetros:
- id en la URL (req.params.id)

### Validaciones:
- Solo el dueño o admin pueden eliminar.

- Un admin no puede eliminar a otro admin.

- La cuenta debe estar activa.

### Respuesta en caso de éxito:
```json
{
  "msj": "Cuenta eliminada!"
}
```

### Errores posibles:
```json
{
  "error": "Usuario no encontrado"
}
{
  "error": "La cuenta ya está inactiva"
}
{
  "error": "Sin autorización!"
}
{
  "error": "No puedes eliminar un usuario con tu mismo rol"
}
```
--- 

## 🛠️ `reactivarCuenta`
- Permite a un admin reactivar una cuenta desactivada.

### Parámetros:
- id en la URL (req.params.id)

### Validaciones:
- Solo cuentas inactivas pueden reactivarse.

### Respuesta en caso de éxito:
```json
{
  "msj": "Cuenta reactivada!"
}
```

### Errores posibles:
```json
{
  "error": "Usuario no encontrado"
}
{
  "error": "La cuenta ya está activa"
}
```
---

## 📋 `listaDeBaneados`
- Obtiene una lista de usuarios con estado false (baneados).

- Solo accesible por admins.

### Respuesta exitosa:
```json
[
  { /* usuario baneado 1 */ },
  { /* usuario baneado 2 */ }
]
```
---

## 🔐 `recuperarPassword`
- Permite recuperar la contraseña validando pregunta y respuesta de seguridad.

### Campos en req.body:
- email

- pregunta

- respuesta

### Flujo:
- Verifica que el usuario exista y esté activo.

- Valida la pregunta y respuesta.

- Genera y guarda una nueva contraseña hasheada.

- Devuelve la nueva contraseña (solo para mostrar temporalmente en frontend).

### Respuesta exitosa:
```json
{
  "msj": "Password recuperado!",
  "nuevaPassword": "abc123xyz789"
}
```

### Errores posibles:
```json
{
  "error": "Usuario incorrecto o inexistente"
}
{
  "error": "Usuario eliminado o inactivo"
}
{
  "error": "Pregunta o respuesta incorrecta",
  "data": { "email": "...", "pregunta": "..." }
}
```
---

## ✏️ `editarUsuario`
- Edita datos del usuario según cambios validados.

### Parámetros:
- id en la URL (req.params.id)

### Cambios recibidos:
- En req.cambios (middleware previa valida y filtra)

### Respuesta exitosa:
```json
{
  "msj": "Usuario Actualizado!"
}
```
---

## ❤️ `allLikes`
- Obtiene todos los personajes que el usuario autenticado ha marcado con like.

### Respuesta exitosa:
```json
[
  { /* personaje 1 */ },
  { /* personaje 2 */ }
]
```

---

## ✉️ `Mensajes`
### `mandarMensaje`
-Envía un mensaje a otro usuario si no está bloqueado.

#### Parámetro: id usuario receptor (req.params.id)

#### Campos en body: mensaje, opcional replyTo para responder mensaje

#### Respuesta exitosa:
```json
{
  "msj": "Mensaje Enviado!",
  "mensajeId": "id-del-mensaje"
}
```
### `eliminarMensaje`
- Elimina (oculta) un mensaje propio.

#### Parámetro: id mensaje (req.params.id)

#### Respuesta exitosa:
```json
{
  "msj": "Mensaje eliminado!"
}
```

### `allMsj`
- Obtiene todos los mensajes activos del usuario autenticado.

#### Respuesta exitosa:
```json
{
  "mensaje": [ /* array de mensajes activos */ ]
}
```

### `getHiloConversacion`
- Devuelve el hilo completo de conversación entre el usuario autenticado y otro usuario.

- Parámetro: id otro usuario (req.params.id)

#### Respuesta exitosa:
```json
{
  "mensajes": [ /* array de mensajes ordenados por fecha */ ]
}
```

### `resumenMensajes`
- Devuelve un resumen con el último mensaje por cada usuario con quien ha interactuado.

#### Respuesta exitosa:
```json
{
  "mensajes": [
    {
      "_id": "id-mensaje",
      "de": {
        "id": "id-usuario",
        "userName": "usuario",
        "email": "email@ejemplo.com"
      },
      "mensaje": "Texto del mensaje",
      "fecha": "2025-07-08T12:00:00.000Z"
    }
  ]
}
```
---

## ⛔ `Bloqueo de usuarios`
### `bloquear`
- Bloquea a otro usuario (no puede bloquearse a sí mismo ni un admin si es común).

#### Parámetro: id usuario a bloquear (req.params.id)

#### Respuesta exitosa:
```json
{
  "msj": "Usuario bloqueado!"
}
```

### `desbloquear`
- Elimina el bloqueo a otro usuario.

#### Parámetro: id usuario a desbloquear (req.params.id)

#### Respuesta exitosa:
```json
{
  "msj": "Usuario desbloqueado!"
}
```

### `listaBloqueados`
- Obtiene la lista de usuarios bloqueados por el usuario autenticado.

#### Respuesta exitosa:
```json
{
  "bloqueados": [
    {
      "_id": "id-usuario",
      "userName": "usuario1",
      "email": "usuario1@ejemplo.com",
      "picture": "imagen.jpg"
    }
  ]
}
```

---

## 🔧 `Utilidades`
generarPasswordAleatoria
Genera una contraseña segura aleatoria de longitud definida (por defecto 12 caracteres).

--- 

##⚠️ `Seguridad`
- Solo usuarios autenticados pueden acceder a estas rutas.

- Verificación de roles (comun, admin) para funciones sensibles.


