## 📄 Modelo de Denuncia (`Denuncia`)

El modelo `Denuncia` permite a los usuarios reportar contenido o cuentas que infrinjan las normas de la plataforma. Las denuncias pueden estar dirigidas a usuarios o personajes, e incluyen información relevante para su evaluación por parte del administrador.

---

### 📟 Campos del esquema:

#### `denunciante`
- **Tipo:** `ObjectId`
- **Referencia:** `User`
- **Requerido:** Sí
- **Descripción:** Usuario que realiza la denuncia.

---

#### `entidad`
- **Tipo:** Objeto embebido con dos propiedades:
  - `tipo`:
    - **Tipo:** `String`
    - **Valores posibles:** `'User'` o `'Personaje'`
    - **Requerido:** Sí
    - **Descripción:** Define si la denuncia está dirigida a un usuario o un personaje.
  - `id`:
    - **Tipo:** `ObjectId`
    - **Requerido:** Sí
    - **Descripción:** ID de la entidad denunciada.

---

#### `motivo`
- **Tipo:** `String`
- **Requerido:** Sí
- **Restricciones:** Máximo 100 caracteres
- **Descripción:** Razón principal de la denuncia. Debe ser clara y concisa.

---

#### `mensaje`
- **Tipo:** `String`
- **Restricciones:** Máximo 500 caracteres
- **Descripción:** Texto adicional donde el denunciante puede detallar la situación (opcional).

---

#### `estado`
- **Tipo:** `Boolean`
- **Valor por defecto:** `true`
- **Descripción:** Estado de la denuncia:
  - `true`: pendiente
  - `false`: resuelta

---

#### `fecha`
- **Tipo:** `Date`
- **Valor por defecto:** `Date.now`
- **Descripción:** Fecha en la que se realizó la denuncia.

---

Este esquema permite a los administradores gestionar denuncias de manera efectiva, filtrarlas por estado y tipo de entidad, y tomar acciones correspondientes (como deshabilitar cuentas o personajes).

