export const validateField = (field, value, user) => {
    let valid = true
    let errorMsj = ''

    // Si el campo está vacío, resetea la validación y el mensaje
    if (value.trim() === '') return { valid: null, errorMsj: '' }

    switch (field) {
        case 'userName':
            if (value.length < 5 || value.length > 10 || /\s/.test(value)) {
                valid = false
                errorMsj = 'Nombre de usuario inválido'
            }
            break
        case 'email':
            if (/\s/.test(value) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                valid = false
                errorMsj = 'Email inválido'
            }
            break
        case 'password':
            if (value.length < 5 || /\s/.test(value)) {
                valid = false
                errorMsj = 'Password inválido'
            } else if (user.password2 && value !== user.password2) {
                valid = false
                errorMsj = 'Las contraseñas no coinciden'
            }
            break
        case 'password2':
            if (value.length < 5 || /\s/.test(value)) {
                valid = false
                errorMsj = 'Password inválido'
            } else if (value !== user.password) {
                valid = false
                errorMsj = 'Las contraseñas no coinciden'
            }
            break
        case 'respuesta':
            if (value.length < 5) {
                valid = false
                errorMsj = 'La respuesta debe tener mínimo 5 letras'
            } else if (value.length > 60) {
                valid = false
                errorMsj = 'Límite de respuesta sobrepasado'
            }
            break
        case 'sobreMi':
            if (value.length > 150) {
                valid = false
                errorMsj = 'Límite de descripción sobrepasado'
            }
            break
    }

    return { valid, errorMsj }
}
