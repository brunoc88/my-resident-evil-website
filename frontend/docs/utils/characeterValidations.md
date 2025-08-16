# Validaciones para formulario de personaje

## 📌 Descripción general

Estas validaciones se utilizan en el formulario de personajes (`CharacterForm`) para asegurar que los campos obligatorios estén completos, que se respeten las opciones válidas y que no se exceda el límite de caracteres permitido.

---

## 🔹 `validarNombre`
```js
export const validarNombre = {
  required: 'Nombre requerido',
  minLength: { value: 3, message: 'Mínimo 3 caracteres' },
  maxLength: { value: 30, message: 'Máximo 30 caracteres' }
}
```
- `required`: El campo nombre es obligatorio.
- `minLength` / `maxLength`: Limita la longitud del nombre entre 3 y 30 caracteres.

---

## 🔹 `validarCategoria`
```js
export const validarCategoria = {
  required: 'Categoría inválida o no seleccionada!',
  validate: (value) =>
    CATEGORIAS_VALIDAS.includes(value) || 'Categoría inválida o no seleccionada!'
}
```
- `required`: El campo categoría es obligatorio.
- `validate`: Asegura que solo se pueda seleccionar una categoría válida.

---

## 🔹 `validarCondicion`
```js
export const validarCondicion = {
  required: 'Condición inválida o no seleccionada!',
  validate: (value) =>
    CONDICIONES_VALIDAS.includes(value) || 'Condición inválida o no seleccionada!'
}
```
- `required`: El campo condición es obligatorio.
- `validate`: Asegura que solo se pueda seleccionar una condición válida.

---

## 🔹 `validarPrimeraAparicion`
```js
export const validarPrimeraAparicion = {
  required: 'Seleccione primera aparición!'
}
```
- `required`: Obligatorio seleccionar la primera aparición del personaje.

---

## 🔹 `validarUltimaAparicion`
```js
export const validarUltimaAparicion = {
  required: 'Seleccione última aparición!'
}
```
- `required`: Obligatorio seleccionar la última aparición del personaje.

---

## 🔹 `validarImagen`
```js
export const validarImagen = {
  required: 'Debe subir una imagen!'
}
```
- `required`: Se requiere que el usuario suba una imagen del personaje.

---

## 🔹 `validarEdad`
```js
export const validarEdad = {
  validate: (value) => {
    if (!value) return true
    if (!/^\d+$/.test(value)) return 'Edad inválida, debe ingresar solo números'
    return true
  }
}
```
- `validate`: Campo opcional, pero si se ingresa un valor, debe ser solo números.

---

## 🔹 `validarColorDeOjos`
```js
export const validarColorDeOjos = {
  maxLength: { value: 20, message: 'Máximo 20 caracteres' }
}
```
- `maxLength`: Limita la longitud del color de ojos a 20 caracteres.

---

## 🔹 `validarColorDePelo`
```js
export const validarColorDePelo = {
  maxLength: { value: 20, message: 'Máximo 20 caracteres' }
}
```
- `maxLength`: Limita la longitud del color de pelo a 20 caracteres.

---

## 🔹 `validarAltura`
```js
export const validarAltura = {
  validate: (value) => {
    if (!value) return true
    if (isNaN(value)) return 'Altura: debe ser un número válido'
    return true
  }
}
```
- `validate`: Campo opcional, si se ingresa debe ser un número válido.

---

## 🔹 `validarPeso`
```js
export const validarPeso = {
  validate: (value) => {
    if (!value) return true
    if (isNaN(value)) return 'Peso: debe ser un número válido'
    return true
  }
}
```
- `validate`: Campo opcional, si se ingresa debe ser un número válido.

---

## 🔹 `validarOficio`
```js
export const validarOficio = {
  maxLength: { value: 50, message: 'Máximo 50 caracteres' }
}
```
- `maxLength`: Limita la longitud del oficio a 50 caracteres.

---

## 🔹 `validarBiografia`
```js
export const validarBiografia = {
  maxLength: { value: 500, message: 'Máximo 500 caracteres' }
}
```
- `maxLength`: Limita la longitud de la biografía a 500 caracteres.

---

## 📌 Uso en `react-hook-form`
```js
<input
  type="text"
  {...register('nombre', validarNombre)}
/>
<select {...register('categoria', validarCategoria)} />
<select {...register('condicion', validarCondicion)} />
<input type="number" {...register('edad', validarEdad)} />
<textarea {...register('biografia', validarBiografia)} />
```
- Se utiliza la función `register` de `react-hook-form` para aplicar estas validaciones a los campos del formulario.
- Si el usuario no cumple con las reglas, se mostrará automáticamente el mensaje de error definido en cada validación.

