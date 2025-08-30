
# Manejo de errores en Mongoose y Express

## 1. ValidationError (validación fallida en mongoose schema)

Cuando falla una validación de Mongoose (ej: campo requerido, minLength, enum), el error se ve así:

```json
{
  "name": "ValidationError",
  "errors": {
    "email": {
      "message": "El email es obligatorio",
      "path": "email",
      "kind": "required",
      "value": null
    },
    "password": {
      "message": "La contraseña debe tener mínimo 6 caracteres",
      "path": "password",
      "kind": "minlength",
      "value": "123"
    }
  }
}
```

👉 En este caso, `error.errors` es un **objeto** cuyas **keys** son los nombres de los campos (`email`, `password`) y cuyos **values** son objetos con info detallada del error.  

- `Object.keys(error.errors)` → `["email", "password"]`  
- `Object.values(error.errors)` → `[ {message: 'El email es obligatorio', ...}, {message: 'La contraseña debe...'} ]`  

Por eso se usa `Object.values(error.errors).map(e => e.message)` → obtenés solo los mensajes.

---

## 2. error.code === 11000 (clave duplicada de MongoDB)

Cuando intentás guardar un valor duplicado en un campo `unique: true`, el error se ve así:

```json
{
  "name": "MongoServerError",
  "code": 11000,
  "keyValue": {
    "email": "test@mail.com"
  }
}
```

👉 Acá `error.keyValue` es un objeto donde:  
- **key** → nombre del campo (`email`)  
- **value** → valor duplicado (`"test@mail.com"`)  

Entonces:  
- `Object.keys(error.keyValue)` → `["email"]`  
- `Object.values(error.keyValue)` → `["test@mail.com"]`  

Si usás `Object.keys`, podés armar un mensaje dinámico tipo:  
`El email 'test@mail.com' ya está registrado`.  

Si recorrieras con `Object.values`, solo tendrías los valores duplicados, pero perderías qué campo los generó.

---

## 3. CastError (ID inválido)

Cuando mandás un `ObjectId` inválido:

```json
{
  "name": "CastError",
  "kind": "ObjectId",
  "value": "abc123",
  "path": "_id"
}
```

👉 Acá directamente accedés a `error.value` (el ID inválido).

---

## Resumen

- **keys** = nombres de propiedades (`email`, `password`, etc.)  
- **values** = los valores asociados a esas keys (`test@mail.com`, `{ message: ... }`)  
