
# 📝 Explicación Middleware `validarCambiosPersonaje`

Este middleware se usa para validar y detectar cambios en los datos de un personaje antes de actualizarlo en la base de datos.

---

## 🔍 ¿Qué hace?

- Recibe los datos enviados en el cuerpo (`req.body`) y el `id` del personaje desde los parámetros (`req.params`).
- Busca en la base de datos el personaje correspondiente por su `id`.
- Si no existe o está marcado como eliminado (`estado === false`), responde con un error 404.
- Compara cada campo enviado con el valor actual en la base para detectar qué campos cambiaron.
- Si detecta algún cambio, guarda esos campos en un objeto `cambios`.
- Si no detecta ningún cambio, responde con un error 400 diciendo que no hay cambios.
- Si hay cambios, los añade a `req.cambios` para que el siguiente middleware o controlador pueda usarlos.
- Llama a `next()` para continuar la ejecución.

---

## ⚙️ Detalle por pasos

1. **Obtiene datos**  
   ```js
   const data = req.body
   const { id } = req.params
   ```

2. **Busca el personaje**  
   ```js
   const personajeDB = await Personaje.findById(id)
   ```

3. **Verifica existencia y estado**  
   ❌ Si no existe o está eliminado:  
   ```js
   return res.status(404).json({ error: 'Personaje inexistente o eliminado' })
   ```

4. **Compara cada campo con el actual**  
   - Solo añade a `cambios` los campos que realmente se modificaron.  
   - Ejemplo para nombre:  
   ```js
   if ('nombre' in data && data.nombre !== personajeDB.nombre) cambios.nombre = data.nombre
   ```
   - Para fechas, se comparan solo las partes relevantes (fecha sin hora):  
   ```js
   if ('fechaNacimiento' in data &&
       new Date(data.fechaNacimiento).toISOString().slice(0, 10) !==
       new Date(personajeDB.fechaNacimiento).toISOString().slice(0, 10)) {
     cambios.fechaNacimiento = data.fechaNacimiento
   }
   ```
   - Para números, convierte y compara:  
   ```js
   if ('altura' in data && Number(data.altura) !== personajeDB.altura) cambios.altura = Number(data.altura)
   ```

5. **Manejo de imagen**  
   - Si hay un archivo subido y es diferente a la imagen actual, actualiza:  
   ```js
   if (req.file && req.file.filename !== personajeDB.picture) {
     cambios.picture = req.file.filename
   }
   ```

6. **Si no hay cambios detectados**  
   ❌ Devuelve error 400:  
   ```js
   if (Object.keys(cambios).length === 0) {
     return res.status(400).json({ error: 'No hay cambios!', data: personajeDB })
   }
   ```

7. **Pasa los cambios para el siguiente middleware/controlador**  
   ```js
   req.cambios = cambios
   next()
   ```

---

## 🎯 Resumen

Este middleware:

- Evita actualizaciones innecesarias si no hay cambios reales.
- Valida que el personaje exista y esté activo.
- Prepara un objeto con solo los campos modificados para optimizar la actualización.
- Facilita el manejo de imágenes nuevas.

---

¡Así tu aplicación solo actualiza lo necesario! 🚀✨

---


