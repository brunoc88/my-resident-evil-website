const Login = () => {
    return (
        <>
            <div>
                <h2>Iniciar sesión</h2>
            </div>
            <div>
                <form action="" method="post">
                    <div>
                        <div>
                            Usuario: <input type="text"
                                placeholder="Ingrese Email o nombre de usuario"
                                name="user"
                            />
                            Password: <input type="password" placeholder="Ingrese password" name="password" />
                        </div>
                        <button type="submit">Login</button>
                    </div>
                </form>
            </div>
            <div>
                <p><a href="">No tienes cuenta?</a></p>
            </div>
            <div>
                <p><a href="">Olvidaste tu password?</a></p>
            </div>
        </>
    )
}

export default Login