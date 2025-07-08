## 🔐 Middleware de Autenticación y Autorización

Este archivo define tres middlewares esenciales para manejar la seguridad de rutas protegidas: extracción del token, validación de usuario autenticado y control de roles.

---

### 🏛️ `tokenExtractor`

#### Propósito:
- Extrae el token JWT del header `Authorization` en formato `Bearer <token>`.

#### Resultado:
- Almacena el token extraído en `req.token` para su uso posterior.

---

### 👤 `userExtractor`

#### Propósito:
- Verifica el token JWT extraído previamente.
- Si es válido, busca al usuario en la base de datos y lo asigna a `req.user`.

#### Respuestas posibles:
- `401` si no hay token o es inválido.
- `404` si el usuario no existe.

---

### ⚖️ `verifyRole(rolPermitido)`

#### Propósito:
- Middleware de autorización. Verifica que el usuario tenga el rol especificado (por ejemplo, `'admin'`).

#### Uso:
```js
router.use(verifyRole('admin'))
```

#### Respuesta:
- `403` si el usuario no tiene el rol requerido.

---

Estos middlewares son fundamentales para proteger rutas sensibles y asegurar que solo los usuarios autorizados puedan acceder a ciertas funcionalidades. Deben aplicarse en el orden correcto: `tokenExtractor` antes de `userExtractor`, y luego `verifyRole` si es necesario.

