## 🔐 Middleware: validarLogin

Este middleware valida y filtra los datos de acceso antes de que lleguen al controlador de login. Se asegura de que los campos estén presentes y el usuario exista y no esté desactivado.

---

### 🔄 Flujo de validación

#### 1. Sanitización
```js
req.body.user = req.body.user?.trim()
req.body.password = req.body.password?.trim()
```
Se eliminan espacios en blanco al inicio y fin de ambos campos.

#### 2. Verificación de presencia
- Si faltan ambos campos: devuelve `400` con mensaje general.
- Si falta `user`: devuelve `400` con mensaje correspondiente.
- Si falta `password`: idem anterior.

#### 3. Búsqueda en la base de datos
```js
const checkUser = await User.findOne({
  $or: [ { userName: user }, { email: user } ]
})
```
Permite que el usuario inicie sesión tanto con `userName` como con `email`.

- Si no se encuentra el usuario: `404 Usuario no encontrado`
- Si el estado del usuario es `false` (baneado/desactivado): `400 Cuenta eliminada o baneada`

#### 4. Paso al siguiente middleware o controlador
- Si todo es correcto, se almacena el usuario encontrado en `req.user` para que el controlador de login pueda usarlo directamente.

---

### 🔒 Salidas esperadas
- `400`: Campos incompletos o cuenta inactiva.
- `404`: Usuario inexistente.
- `next()`: Si pasa todas las validaciones.

---

Este middleware permite mantener el controlador de login limpio y enfocado solo en la lógica de generación de token y comparación de contraseña.

