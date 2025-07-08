
# ⚙️ Archivo de configuración `config.js`

Este archivo se encuentra dentro de la carpeta `util/` y centraliza todas las variables de entorno necesarias para el correcto funcionamiento del proyecto.

---

## 📦 ¿Qué hace?

Importa y expone variables desde el archivo `.env` mediante `dotenv`, y las adapta dependiendo del entorno en el que se ejecute la aplicación.

---

## 🔍 Explicación línea por línea

```js
require('dotenv').config()
```
- Carga las variables de entorno definidas en un archivo `.env` al `process.env`.

---

```js
const MONGODB_URI = process.env.NODE_ENV === 'dev'
  ? process.env.MONGODB_URI
  : process.env.MONGODB_URI_TEST
```
- Define la URI de conexión a MongoDB.
- Si el entorno (`NODE_ENV`) es de desarrollo (`dev`), usa `MONGODB_URI`.
- Si es de testeo u otro, usa `MONGODB_URI_TEST`.

---

```js
const PORT = process.env.PORT
```
- Puerto donde se ejecuta la aplicación (por ejemplo, `3001`).

---

```js
const SECRET = process.env.SECRET
```
- Clave secreta utilizada para firmar y verificar los tokens JWT.

---

```js
const CLAVE_SECRETA_ADMIN = process.env.CLAVE_SECRETA_ADMIN
```
- Clave que se debe ingresar en el formulario para registrarse como administrador.

---

## 📤 Exportación

```js
module.exports = {
  MONGODB_URI,
  PORT,
  SECRET,
  CLAVE_SECRETA_ADMIN
}
```

- Se exportan las variables para que estén disponibles en cualquier parte del proyecto mediante `require()`.

---

## ✅ Ventajas

- Centraliza la configuración.
- Facilita el cambio entre entornos (dev/test/prod).
- Mejora la seguridad al mantener secretos fuera del código fuente.

---


**Autor:** Bruno Cerutti  
**Fecha:** 2025
