## 🛄 Validación de contraseña

Archivo: `utils/validarLogin.js`

```js
const validarPassword = (password) => {
    let error = { password: '', flag: false }

    if (password) {
        if (password.length < 5) {
            error.password = 'Password inválido!'
            error.flag = true
            return error
        }
        if (/\s/.test(password)) {
            error.password = 'El password no debe contener espacios'
            error.flag = true
            return error
        }
    }

    return error
}
```

- Valida que el `password` tenga al menos 5 caracteres y no contenga espacios.
- Devuelve un objeto con el mensaje de error y una bandera (`flag`) que indica si hubo fallo.

