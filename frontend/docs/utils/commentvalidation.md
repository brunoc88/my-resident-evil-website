# Validaciones para hacer un comentario en Personaje

## 📌 Descripción general

Esta validacion se utiliza para comprobar que el comentario cumpla las requisitos para ser enviado y ser visto en la seccion de comentarios del personaje.

--- 

## 🔹 `comentValidation`

```js
export const comentValidation = {
    required: 'Escriba un comentario!',
    maxLength: { value: 200, message: 'Máximo 200 caracteres' }
}
```
- `required`: El comentario es obligatorio.
- `maxLength`: Limita la longitud del comentario a un maximo de 200 caracteres.

---

## 📌 Uso en `react-hook-form`

```js
<textarea {...register('mensaje', comentValidation)} id="mensaje" placeholder="ingresa un comentario..."></textarea>

                <div className={styles.formFooter}>
                    <button type="submit">Enviar</button>
                    <span>{mensaje.length}/200</span>
                </div>
```

- Se utiliza la función `register` de `react-hook-form` para aplicar estas validaciones a los campos del formulario.
- Si el usuario no cumple con las reglas, se mostrará automáticamente el mensaje de error definido en cada validación.