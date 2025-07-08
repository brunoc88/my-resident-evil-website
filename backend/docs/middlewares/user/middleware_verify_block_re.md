## 🔐 Middleware: verifyBlock

Este middleware se encarga de validar si hay bloqueo entre usuarios antes de permitir acciones como enviar mensajes o interactuar entre ellos.

---

### 🤜 Propósito

- Verifica si el usuario emisor o el receptor están bloqueados entre sí.
- Evita interacciones no deseadas entre usuarios que se hayan bloqueado mutuamente.

---

### ⚡ Flujo de validación

1. **Obtener IDs:**

```js
const emisorId = req.user.id
const receptorId = req.params.id
```

- El emisor es el usuario logueado (`req.user` previamente extraído).
- El receptor es el ID recibido por `params`.

2. **Buscar ambos usuarios en la BD:**

```js
const emisor = await User.findById(emisorId)
const receptor = await User.findById(receptorId)
```

3. **Validar existencia del receptor:**

- Si no existe o tiene `estado === false`, devuelve:

```json
{ "error": "Usuario no encontrado o eliminado" }
```

- **Status:** `404`

4. **Validar bloqueos mutuos:**

- Si el receptor bloqueó al emisor: `403 Forbidden`

```json
{ "error": "El usuario <userName> no está disponible" }
```

- Si el emisor bloqueó al receptor: `400 Bad Request`

```json
{ "error": "Tienes bloqueado a <userName>" }
```

5. **Si todo está correcto:**

```js
next()
```

---

### 📄 Contexto de uso

Usado antes de rutas como:

```js
router.post('/mensaje/:id', verifyBlock, userController.mandarMensaje)
```

---

Este middleware ayuda a mantener una experiencia de usuario respetuosa y evita conflictos al respetar los bloqueos definidos por los propios usuarios.

