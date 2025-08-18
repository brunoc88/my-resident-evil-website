# Validaciones para registrar o editar un Usuario

## 📌 Descripción general

Este archivo contiene todas las validaciones utilizadas en los formularios de usuario.
Define restricciones de longitud, formato, campos obligatorios y validaciones personalizadas (como la coincidencia de contraseñas).

---

## 🔹 `userNameValidation`
```js
export const userNameValidation = {
  required: 'Nombre requerido',
  minLength: { value: 5, message: 'Mínimo 5 caracteres' },
  maxLength: { value: 10, message: 'Máximo 10 caracteres' },
  pattern: {
    value: /^[a-z0-9._-]+$/, // solo minúsculas, números, punto, guion bajo y guion
    message: 'Solo se permiten letras minúsculas, números, punto, guion y guion bajo'
  }
}
```
- `required`: El campo nombre es obligatorio.
- `minLength`: Liminte minimo para nombre de usuario es de 5 caracteres.
- `maxLength`: Liminte maximo para nombre de usuario es de 10 caracteres.
- `pattern(Formato permitido)`:

Letras minúsculas (a-z).

Números (0-9).

Punto (.), guion (-) y guion bajo (_).

---
## 🔹 `passwordValidation`

```js
export const passwordValidation = (isAuth) => ({
  required: !isAuth ?'Contraseña requerida':false,
  minLength: { value: 6, message: 'Mínimo 6 caracteres' }
})
```

- `required`: Si el usuario no esta autenticado es obligatorio el ingreso de un password. Opcional en edicion.
- `minLength`: Liminte minimo para el password es de 6 caracteres.

---

## 🔹 `password2Validation`

```js
export const password2Validation = (watch, isAuth) => ({
  required: !isAuth ? 'Confirma tu contraseña' : false,
  validate: value => {
    const password = watch('password')
    if (!isAuth && value !== password) return 'Las contraseñas no coinciden'
    if (isAuth && value && value !== password) return 'Las contraseñas no coinciden'
    return true
  }
})
```

- `required`: Sí, si no está autenticado (Confirma tu contraseña).confirmar la coincidencia entre las mismas. Opcional en edición.
- `validate(Validación personalizada)`:

Debe coincidir con el campo password.

En edición, si se ingresa un valor, también debe coincidir.

---

## 🔹 `emailValidation`

```js
export const emailValidation = {
  required: 'Email requerido',
  pattern: {
    value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/, // solo minúsculas permitidas
    message: 'Email inválido (solo minúsculas permitidas)'
  }
}
```
-`required`: Campo email obligatorio.
- `pattern`: Debe seguir el patrón de email válido solo en minúsculas.
Ejemplo válido: usuario.re@ejemplo.com
Ejemplo inválido: Usuario@Ejemplo.com

---

## 🔹 `preguntaValidation`

```js
export const preguntaValidation = {
  required: 'Selecciona una pregunta'
}
```

- `required`: Seleccion de pregunta obligatoria.

---

## 🔹 `sobreMiValidation`

```js
export const sobreMiValidation = {
  maxLength: {
    value: 150,
    message: 'Máximo 150 caracteres'
  }
}
```

- `maxLength`: La autodescripcion no debe superar los 150 caracteres. No es obligatoria.

---

## 🔹 `respuestaValidation`

```js
export const respuestaValidation = {
  required: 'Respuesta requerida',
  minLength: { value: 5, message: 'Mínimo 5 caracteres' },
  maxLength: { value: 60, message: 'Máximo 60 caracteres' }
}
```

- `required`: La respuesta es obligatoria.
- `minLength`: La respuesta debe tener un minimo de 5 caracteres.
- `maxLength`: La respuesta debe tener un maximo de 60 caracteres.

---

## 📌 Uso en `react-hook-form`

```js
        <div className="grid">
          <div className="campo">
            <label htmlFor="userName">Nombre de Usuario:</label>
            <input
              id="userName"
              type="text"
              placeholder="Ej: adawong88"
              {...register('userName', userNameValidation)}
            />
            <div className="contador">{userName.length}/10</div>
            {errors.userName && <span>{errors.userName.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              placeholder="Ingrese un password"
              {...register('password', passwordValidation(isAuth))}
            />
            {errors.password && <span>{errors.password.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="password2">Confirmar Password:</label>
            <input
              id="password2"
              type="password"
              {...register('password2', password2Validation(watch, isAuth))}
            />
            {errors.password2 && <span>{errors.password2.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="email">Email:</label>
            <input
              id="email"
              type="text"
              placeholder="Ej: capcom@gmail.com"
              {...register('email', emailValidation)}
            />
            {errors.email && <span>{errors.email.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="pregunta">Selecciona una Pregunta:</label>
            <select id="pregunta" {...register('pregunta', preguntaValidation)}>
              <option value="">-- Elige una opción --</option>
              <option value="RE Favorito?">RE Favorito?</option>
              <option value="Personaje Favorito de RE?">Personaje Favorito de RE?</option>
              <option value="Cual fue tu Primer RE?">Cual fue tu Primer RE?</option>
            </select>
            {errors.pregunta && <span>{errors.pregunta.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="respuesta">Respuesta:</label>
            <input
              id="respuesta"
              type="text"
              placeholder="Ej: Resident Evil 3 de 1998"
              {...register('respuesta', respuestaValidation)}
            />
            <div className="contador">{respuesta.length}/60</div>
            {errors.respuesta && <span>{errors.respuesta.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="sobreMi">Escribe un poco sobre ti:</label>
            <textarea
              id="sobreMi"
              placeholder="Ej: Amo jugar Resident Evil..."
              {...register('sobreMi', sobreMiValidation)}
            />
            <div className="contador">{sobreMi.length}/150</div>
            {errors.sobreMi && <span>{errors.sobreMi.message}</span>}
          </div>

          <div className="campo">
            <label htmlFor="picture">Imagen:</label>
            <input type="file" id="picture" accept="image/*" {...register('picture')} />
          </div>

          {isAdmin && (
            <div className="campo">
              <label htmlFor="secreto">Palabra Secreta (Solo admins):</label>
              <input
                id="secreto"
                type="password"
                placeholder="Ingrese palabra secreta para admin"
                {...register('secreto', { required: 'Ingrese palabra secreta!' })}
              />
              {errors.secreto && <span>{errors.secreto.message}</span>}
            </div>
          )}
        </div>
```

- Se utiliza la función `register` de `react-hook-form` para aplicar estas validaciones a los campos del formulario.
- Si el usuario no cumple con las reglas, se mostrará automáticamente el mensaje de error definido en cada validación.

---



