# Backend - Configuración y Arranque

## Configuración principal

- El archivo **app.js** configura express, rutas, middlewares y conexión a MongoDB.
- Usa variables de entorno en `utils/config.js` (ejemplo: `MONGODB_URI`, `PORT`).
- Usa `mongoose` para conectar con MongoDB, con manejo de logs para éxito o error.
- Usa middleware para:
  - Servir archivos estáticos en `/uploads`
  - Parsear JSON
  - Extraer token con `tokenExtractor`
  - Logger de peticiones `morgan` (solo en `dev`)


## Manejo de errores y endpoints desconocidos

- Middleware `unknownEndpoint` para rutas no encontradas.
- Middleware `errorHandler` para manejo centralizado de errores.

---

## Arranque del servidor (`index.js`)

- Importa `app` de `app.js`
- Escucha en puerto definido en `utils/config.js` (`PORT`)
- Logs con `logger` indicando el puerto activo

---


## 📦 Dependencias (dependencies)

Estas son las dependencias principales usadas en producción y desarrollo para la funcionalidad de la app.

- **bcrypt**  
  Librería para hashear contraseñas, agregando seguridad en el almacenamiento.

- **dotenv**  
  Permite cargar variables de entorno desde un archivo `.env`, para configuración segura.

- **express**  
  Framework web para Node.js, facilita la creación de APIs REST.

- **jsonwebtoken**  
  Implementa tokens JWT para autenticación y autorización.

- **mongoose**  
  ODM para MongoDB, permite modelar y consultar la base de datos de forma sencilla.

- **multer**  
  Middleware para manejar la subida de archivos multipart/form-data, usado para subir imágenes.

- **validator**  
  Funciones para validar y sanitizar datos como emails, URLs, etc.

- **cors**
  middleware para poder permitir que el frontend de react consuma la el backend que esta en un servidor diferente
---

## 📦 Dependencias de Desarrollo (devDependencies)

Estas dependencias se usan solo en el entorno de desarrollo y testing para facilitar la productividad y calidad del código.

- **cross-env**  
  Permite definir variables de entorno en los scripts de `package.json` de forma compatible entre sistemas operativos (Windows, Linux, macOS).  
  Ejemplo: establecer `NODE_ENV=dev` antes de arrancar el servidor.

- **jest**  
  Framework de testing para JavaScript.  
  Usado para escribir y ejecutar tests unitarios e integración.  
  Aquí se usa para tests backend con soporte para asíncrono y mocks.

- **morgan**  
  Middleware para logging de peticiones HTTP en desarrollo.  
  Muestra en consola las rutas y tiempos de respuesta, muy útil para debugging.

- **nodemon**  
  Herramienta que reinicia automáticamente el servidor Node.js cuando detecta cambios en el código.  
  Facilita el desarrollo porque no hay que reiniciar manualmente.

- **supertest**  
  Biblioteca para hacer pruebas HTTP en Node.js.  
  Permite testear las rutas de Express simulando peticiones y validando respuestas, ideal para integración.

---

## 📋 Scripts en package.json

- `start`: Ejecuta el servidor en modo producción (`NODE_ENV=start`).
- `dev`: Ejecuta el servidor en modo desarrollo con `nodemon` y logging extendido (`NODE_ENV=dev`).
- `test`: Ejecuta todos los tests con Jest en modo verbose (`NODE_ENV=test`).
- `test:u`: Ejecuta tests específicos de usuarios y mensajes.
- `test:l`: Ejecuta tests específicos de login.
- `test:p`: Ejecuta tests específicos de personajes.
- `test:d`: Ejecuta tests específicos de denuncias.
- `test:watch`: Ejecuta Jest en modo watch para tests continuos mientras se desarrolla.

---

## 🔧 Archivos principales

- `index.js`: Punto de entrada que levanta el servidor.
- `app.js`: Configura la app Express con middlewares, rutas y conexión a MongoDB.
- `/router/`: Contiene los archivos de rutas para login, usuarios, personajes y denuncias.
- `/middlewares/`: Middlewares para manejo de errores, autenticación y rutas no definidas.
- `/utils/`: Utilidades como configuración de variables y loggers.

---

## 🛠 Configuración de la app (`app.js`)

- Se conecta a MongoDB usando la URI de configuración.
- Middleware para servir archivos estáticos (`/uploads`).
- Middleware para parsing JSON.
- Middleware para extraer y validar token JWT.
- Uso condicional de `morgan` solo en desarrollo.
- Monta routers para distintas rutas:
  - `/` para login
  - `/user` para usuarios
  - `/personaje` para personajes
  - `/denuncias` para denuncias
- Middlewares para manejar rutas desconocidas y errores.

---

## 🚀 Inicio del servidor (`index.js`)

- Importa la app Express configurada.
- Levanta el servidor en el puerto definido en configuración.
- Loguea mensaje confirmando el puerto.

---




