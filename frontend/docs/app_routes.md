# Documentación de Rutas – `App.js`

Este archivo define todas las rutas de la aplicación usando **React Router v6**. Se organiza con un **layout principal** y rutas públicas/protegidas.

## Estructura General

```jsx
<Routes>
  <Route path="/" element={<LayOut />}>
    ...
  </Route>
</Routes>
```

- `LayOut`: Componente que envuelve todas las rutas, contiene `NavBar`, `Notification` y el `<Outlet />`.
- `<Outlet />` permite renderizar el componente correspondiente según la ruta actual.

---

## Redirección de la raíz

```jsx
<Route index element={<Navigate to="personajes/index" replace />} />
```

- Redirige automáticamente `/` a `/personajes/index`.
- `replace`: evita que la ruta `/` quede en el historial del navegador.
- Evita que el usuario vea un fondo vacío o negro al entrar por primera vez.

---

## Rutas públicas

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/login` | `Login` | Página de login de usuario |
| `/registro` | `UserForm` | Registro de usuario normal |
| `/registroAdmin` | `UserForm` (con `isAdmin=true`) | Registro de administrador |
| `/recuperarPassword` | `PasswordRecovery` | Recuperación de contraseña |
| `/nosotros` | `Nosotros` | Información sobre la empresa |
| `/contactos` | `Contactanos` | Página de contacto |
| `/personajes/index` | `CharacterIndex` | Listado de personajes |
| `/personajes/:id` | `CharacterProfile` | Perfil de personaje específico |

---

## Rutas protegidas (`ProtectedRoutes`)

Se utilizan **rutas anidadas** protegidas, que solo renderizan contenido si el usuario está autenticado (`isAuth=true`).

### Usuario

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/user/editar` | `UserForm` | Editar perfil de usuario |
| `/user/miPerfil` | `Profile` | Perfil propio del usuario |
| `/user/perfil/:userName` | `Profile` | Perfil de otro usuario |
| `/user/followList` | `FollowList` | Lista de usuarios seguidos y seguidores |
| `/user/bloqueados` | `BlockList` | Lista de usuarios bloqueados |
| `/user/baneados` | `BannedList` | Lista de usuarios baneados (solo admin) |
| `/user/buscar` | `Searching` | Búsqueda de usuarios |
| `/user/mensajes/resumen` | `MessageList` | Bandeja de entrada de mensajes |
| `/user/mensajes/:id` | `Message` | Chat con un usuario específico |

### Personajes (protegido)

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/personajes/registro` | `CharacterForm` | Crear un personaje |
| `/personajes/editar/:id` | `CharacterForm` (con `editMode=true`) | Editar personaje existente |

### Denuncias (protegido)

| Ruta | Componente | Descripción |
|------|------------|-------------|
| `/denuncias/lista` | `ComplaintLinst` | Lista de denuncias |
| `/denuncias/info/:id` | `ComplaintInfo` | Información de una denuncia |
| `/denuncias/crear/usuario/:userName/:id` | `Complaint` | Crear denuncia contra un usuario |
| `/denuncias/crear/personaje/:personaje/:id` | `Complaint` | Crear denuncia contra un personaje |

---

## Ruta 404

```jsx
<Route path="*" element={<NotFound />} />
```

- Se renderiza para cualquier ruta no definida.
- No está dentro del `LayOut` para diferenciar visualmente la página de error.

---

## Observaciones

- `ProtectedRoutes`: Componente que valida `isAuth` y redirige a `/login` si el usuario no está autenticado.
- Uso de `<Navigate>` para redirecciones automáticas.
- Rutas anidadas permiten agrupar la lógica bajo un mismo layout y aplicar protección.

