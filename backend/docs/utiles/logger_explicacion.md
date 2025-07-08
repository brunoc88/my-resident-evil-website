
# 🪵 Logger Utility (`logger.js`)

Este archivo se utiliza para centralizar la salida de logs en la consola, dependiendo del entorno de ejecución de la aplicación.

---

## 📦 ¿Qué hace?

Define dos funciones principales:

- `info`: para imprimir mensajes informativos
- `error`: para imprimir mensajes de error

Ambas funciones **solo mostrarán mensajes si el entorno no es de test** (`NODE_ENV !== 'test'`).

---

## 🔍 Código explicado

```js
const info = (...params) =>
  process.env.NODE_ENV !== 'test' ? console.log(...params) : ''
```
- Muestra mensajes informativos con `console.log`.
- Se omiten durante los tests para evitar ruido en la consola.

---

```js
const error = (...params) =>
  process.env.NODE_ENV !== 'test' ? console.error(...params) : ''
```
- Muestra mensajes de error con `console.error`.
- También se omiten si se está corriendo un test.

---

## 📤 Exportación

```js
module.exports = {
  info,
  error
}
```

- Permite usar `logger.info()` y `logger.error()` desde cualquier parte del proyecto.

---

## ✅ Ventajas

- Limpia la salida de consola durante tests automatizados.
- Facilita el seguimiento de eventos en desarrollo o producción.
- Centraliza el manejo de logs.

---


**Autor:** Bruno Cerutti  
**Fecha:** 2025
