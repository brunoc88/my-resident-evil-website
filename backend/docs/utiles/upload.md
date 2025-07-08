# Middleware de subida de archivos con Multer

Este middleware utiliza el paquete [`multer`](https://www.npmjs.com/package/multer) para manejar la subida de archivos en una aplicación Express. Su propósito es permitir la carga de imágenes (formatos `.jpeg`, `.jpg` y `.png`) con un límite de tamaño y configuración de almacenamiento en disco.

## 📁 Ubicación de almacenamiento

```js
destination (req, file, cb) {
  cb(null, 'public/uploads/')
}
```

- Todos los archivos subidos se almacenan en la carpeta `public/uploads/`.

## 📄 Nombre del archivo

```js
filename (req, file, cb) {
  const ext = path.extname(file.originalname)
  cb(null, Date.now() + ext)
}
```

- El nombre del archivo será un número basado en la hora actual (`Date.now()`) seguido de su extensión original.
- Esto evita conflictos por nombres repetidos.

## 📏 Límite de tamaño

```js
limits: { fileSize: 5 * 1024 * 1024 }
```

- El tamaño máximo permitido es de **5 MB**.
- Si se supera, Multer lanzará un error automáticamente.

## ✅ Filtro de tipo de archivo

```js
fileFilter (req, file, cb) {
  const allowedTypes = /jpeg|jpg|png/
  const ext = path.extname(file.originalname).toLowerCase()
  if (!allowedTypes.test(ext)) {
    return cb(new Error('Solo se permiten archivos JPEG, JPG y PNG'))
  }
  cb(null, true)
}
```

- Solo se aceptan archivos con extensiones `.jpeg`, `.jpg` y `.png`.
- Si se intenta subir otro tipo de archivo, se lanza un error personalizado:  
  `"Solo se permiten archivos JPEG, JPG y PNG"`.

## 🧠 Uso en rutas Express

En tu ruta de Express podés usar este middleware así:

```js
const upload = require('./middlewares/upload')

router.post('/subir-imagen', upload.single('imagen'), (req, res) => {
  res.json({ mensaje: 'Imagen subida correctamente', archivo: req.file })
})
```

- `upload.single('imagen')` indica que se espera un solo archivo con el campo `imagen` o en nuesto caso `picture` en el formulario.

## 🛡️ Manejo de errores

Podés capturar errores de Multer (por ejemplo, archivo muy grande o formato inválido) con un middleware de error:

```js
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message })
  } else if (err) {
    return res.status(400).json({ error: err.message })
  }
  next()
})
```