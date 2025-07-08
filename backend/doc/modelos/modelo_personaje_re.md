## 📄 Modelo de Personaje (`Personaje`)

El modelo `Personaje` define la estructura de los documentos de personajes en la base de datos. Incluye información física, biográfica y metadatos sobre su participación en la saga Resident Evil. Además, permite funcionalidades como likes y comentarios.

---

### 📟 Campos del esquema:

#### `nombre`

- **Tipo:** `String`
- **Requerido:** Sí
- **Único:** Sí
- **Restricciones:** Mínimo 3 y máximo 30 caracteres
- **Descripción:** Nombre completo del personaje. No se permite repetir nombres.

---

#### `fechaNacimiento`

- **Tipo:** `Date`
- **Descripción:** Fecha de nacimiento del personaje (opcional).

---

#### `edad`

- **Tipo:** `String`
- **Descripción:** Edad del personaje, almacenada como string para mayor flexibilidad (por ejemplo, "Desconocida" o rangos como "25-30").

---

#### `colorOjos` / `colorPelo`

- **Tipo:** `String`
- **Restricciones:** Máximo 20 caracteres
- **Descripción:** Color de ojos y color de pelo del personaje.

---

#### `altura` / `peso`

- **Tipo:** `Number`
- **Descripción:** Altura (en cm) y peso (en kg) del personaje. Opcionales.

---

#### `categoria`

- **Tipo:** `String`
- **Requerido:** Sí
- **Descripción:** Clasificación del personaje (por ejemplo: "Héroe", "Villano", "Infectado").

---

#### `oficio`

- **Tipo:** `String`
- **Restricciones:** Máximo 50 caracteres
- **Descripción:** Profesion, rol o función dentro de la saga. Campo opcional.

---

#### `condicion`

- **Tipo:** `String`
- **Requerido:** Sí
- **Descripción:** Estado actual del personaje (vivo, muerto, infectado, etc).

---

#### `primeraAparicion` / `ultimaAparicion`

- **Tipo:** `String`
- **Requerido:** Sí
- **Descripción:** Nombre del juego o entrega donde el personaje aparece por primera y última vez.

---

#### `fechaCU`

- **Tipo:** `Date`
- **Valor por defecto:** `Date.now`
- **Descripción:** Fecha de creación del personaje en la base de datos (para ordenamiento o control).

---

#### `picture`

- **Tipo:** `String`
- **Requerido:** Sí
- **Descripción:** Ruta o nombre del archivo de imagen del personaje.

---

#### `biografia`

- **Tipo:** `String`
- **Restricciones:** Máximo 500 caracteres
- **Descripción:** Descripción libre de la historia del personaje. Campo opcional.

---

#### `estado`

- **Tipo:** `Boolean`
- **Valor por defecto:** `true`
- **Descripción:** Indica si el personaje está activo o ha sido deshabilitado.

---

#### `likes`

- **Tipo:** `[ObjectId]`
- **Referencias:** Modelo `User`
- **Descripción:** Lista de usuarios que han dado "me gusta" al personaje. Sirve para conteo y para evitar que un mismo usuario de like más de una vez.

---

#### `comentarios`

- **Tipo:** Subdocumento embebido (`comentarioSchema`)
- **Descripción:** Comentarios hechos por otros usuarios sobre el personaje.

---

### 🔐 Seguridad en la respuesta JSON

El modelo redefine `toJSON` para ocultar información interna al devolver los datos:

```js
returnedObject.id = returnedObject._id.toString()
delete returnedObject._id
delete returnedObject.__v
```

Esto permite trabajar con `id` directamente en el frontend, sin exponer campos internos innecesarios.

