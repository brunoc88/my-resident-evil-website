---
# Validaciones para formulario de denuncias

## 📌 Descripción general

Estas validaciones se utilizan en los formularios de denuncia (`Complaint`) para asegurar que los campos obligatorios estén completos y que no se exceda el límite de caracteres permitido.

---

## 🔹 `motivoValidation`
```js
export const motivoValidation = {
    required: 'Escriba su Motivo!',
    maxLength: { value: 100, message: 'Máximo 100 caracteres' }
}
```
- `required`: El campo motivo es obligatorio.
- `maxLength`: Limita la longitud del motivo a 100 caracteres.

---

## 🔹 `mensajeValidation`
```js
export const mensajeValidation = {
    required: 'Escriba su denuncia!',
    maxLength: { value: 500, message: 'Máximo 500 caracteres' }
}
```
- `required`: El campo mensaje es obligatorio.
- `maxLength`: Limita la longitud del mensaje a 500 caracteres.

---

## 📌 Uso en `react-hook-form`
```js
<input
  type="text"
  {...register('motivo', motivoValidation)}
/>
<textarea
  {...register('mensaje', mensajeValidation)}
/>
```
- Se utiliza la función `register` de `react-hook-form` para aplicar estas validaciones a los campos del formulario.
- Si el usuario no cumple con las reglas, se mostrará automáticamente el mensaje de error definido en cada validación.

---

