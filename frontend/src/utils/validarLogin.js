const validarPassword = (password) => {
    let error = {password:'', flag: false}

    //validamos que el password respete las validaciones de formato
    if(password){
        if(password.length < 5) {
            error.password = 'Password invalido!'
            error.flag = true
            return error
        }
        if(/\s/.test(password)) {
            error.password = 'El password no debe contener espacios'
            error.flag = true
            return error
        }
    }
    return error
    
}

export {
    validarPassword
}