
# 🧟‍♂️ My Resident Evil Website

## 📖 Descripción

**My Resident Evil Website** es una plataforma pensada para fanáticos de la saga Resident Evil. Los usuarios pueden interactuar entre ellos, compartir opiniones sobre personajes, y participar activamente dentro del sitio mediante comentarios, likes/dislikes, denuncias, mensajes y más.

---

## 👥 Tipos de Usuarios

Hay dos tipos de usuarios en el sistema:

- 👤 **Usuario común**
- 🛡️ **Administrador**

El registro se realiza mediante formularios diferentes. Para registrarse como **administrador**, se debe ingresar una clave secreta que será validada por el sistema.

---

## 🔐 Acciones disponibles según el rol

| Funcionalidad                          | Usuario Común | Administrador |
|---------------------------------------|:-------------:|:-------------:|
| Editar su propio perfil               | ✅            | ✅            |
| Eliminar su cuenta                    | ✅            | ✅            |
| Eliminar cuentas ajenas               | ❌            | ✅ (excepto otros admins) |
| Ver perfiles (propios y ajenos)       | ✅            | ✅            |
| Dar like/dislike a personajes         | ✅            | ✅            |
| Ver personajes que le dio like        | ✅            | ✅            |
| Bloquear y desbloquear usuarios       | ✅ (no admins)| ✅            |
| Enviar mensajes (si no hay bloqueo)   | ✅            | ✅            |
| Reactivar cuentas eliminadas          | ❌            | ✅            |
| Realizar denuncias                    | ✅            | ✅            |
| Gestionar denuncias                   | ❌            | ✅            |
| Realizar comentarios                  | ✅            | ✅            |
| Editar comentarios                    | ✅            | ✅            |
| Eliminar comentarios                  | ✅            | ✅            |
| Eliminar comentarios de otros users   | ❌            | ✅            |

---

## 🧠 Lógica de negocio

- Usuarios no registrados **solo pueden ver personajes y sus perfiles**, no pueden interactuar con el sitio (comentar, dar like/dislike, enviar mensajes, etc).
- Los personajes pueden ser comentados, editados pero solo pueden ser eliminados por un administrador.
- En las denuncias, los usuarios deben especificar:
  - 🧾 Motivo
  - 💬 Mensaje explicativo
  - 🆔 ID del denunciante
  - 🆔 ID del denunciado o del personaje implicado
- Los administradores revisan cada denuncia y pueden:
  - ❌ Eliminar al usuario (ban)
  - 🗑️ Eliminar el personaje denunciado

---

## 🚫 Restricciones

- Un administrador **no puede eliminar a otro administrador**.
- Los mensajes solo se pueden enviar si **ninguno de los usuarios ha bloqueado al otro**.
- Las denuncias solo pueden ser gestionadas por administradores.
- Solo administradores pueden reactivar cuentas eliminadas.

---

> Proyecto desarrollado por Bruno Cerutti  
> Año: 2025
