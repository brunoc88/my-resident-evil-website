🧪 UserInputField.jsx (test unitarios)
 Renderiza correctamente el label y el input

 Muestra el valor pasado por props (value)

 Ejecuta onChange cuando se escribe

 Muestra el ícono ✅ si isValid === true

 Muestra el mensaje de error ❌ si isValid === false con message

 No muestra nada si isValid === null

🧪 UserForm.jsx (test de integración)
 Renderiza todos los campos del formulario

 Simula cambios y actualiza el estado (user) correctamente

 Valida y muestra los errores correspondientes al escribir mal (ej: email con espacios, password cortos)

 No permite enviar si hay errores (a menos que el usuario confirme)

 Si no hay errores, llama a userPost con el FormData correcto

 Si userPost responde con msj, redirige y muestra mensaje

 Si userPost falla, llama a setError

