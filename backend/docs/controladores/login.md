# Controlador de Login

Este controlador maneja la autenticación de usuarios mediante verificación de contraseña y generación de un token JWT.

---

## 📌 `login`

Autentica a un usuario ya identificado previamente (por ejemplo, a través del middleware validarLogin que verifica el `email` o `userName`) y genera un token JWT.

### Requiere en `req.body`:
- `password`: la contraseña ingresada por el usuario

### Supone que en `req.user` ya se encuentra:
- Un objeto `user` con al menos: `_id`, `userName`, `email`, `rol`, `password`, `picture`

### Proceso de autenticación:
1. Compara la contraseña ingresada con la almacenada (encriptada) usando `bcrypt.compare`.
2. Si la contraseña no coincide, responde con error 401.
3. Si coincide, genera un token JWT válido por 1 hora usando `jwt.sign` y una `SECRET`.

### Respuesta exitosa:
```json
{
  "msj": "Login exitoso!",
  "token": "<jwt>",
  "user": {
    "id": "123abc",
    "userName": "usuario123",
    "email": "email@ejemplo.com",
    "rol": "admin",
    "picture": "imagen.png"
  }
}
```

### Errores posibles:
- 401: contraseña incorrecta
- 500: error interno del servidor (capturado con `next(error)`)

---

## 🛡️ Seguridad
- El token incluye: `id`, `userName`, `email`, `rol`, `picture`
- Expira en 1 hora (`expiresIn: '1h'`)