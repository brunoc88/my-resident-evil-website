import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from "react-router-dom"
import { expect, vi } from 'vitest'
import Login from "../../pages/Login"
import login from '../../services/login'

const mockSetToken = vi.fn()
const mockSetUser = vi.fn()
const mockedUsedNavigate = vi.fn()

beforeEach(() => {
    render(
        <MemoryRouter>
            {/* necesitamos simular las props ya que el login las necesita para funcionar*/}
            <Login setToken={mockSetToken} setUser={mockSetUser}/> 
        </MemoryRouter>
    )
})



vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useNavigate: () => mockedUsedNavigate
    }

})

// simulamos un login exitoso que devuelve el json con un objeto con propiedades token & user
// Emulando la respuesta del backend
// por lo que cada vez que se haga uso de la funcion login va ser en caso de exito
vi.mock('../../services/login', () => ({
    default: vi.fn(() => Promise.resolve({ token: 'fake-token', user: { userName: 'bruno' } }))
}))


describe('Login', () => {
    test('Renderizado de campos', () => {
        // Obtenemos los valores por medio del label

        const inputUser = screen.getByLabelText(/usuario/i)
        const inputPassword = screen.getByLabelText(/password/i)
        const btnLogin = screen.getByRole('button', { name: /login/i })
        const btnRegistrarse = screen.getByRole('button', { name: /registrarse/i })

        // Verificamos si estan en el DOM

        expect(inputUser).toBeInTheDocument()
        expect(inputPassword).toBeInTheDocument()
        expect(btnLogin).toBeInTheDocument()
        expect(btnRegistrarse).toBeInTheDocument()
        //screen.debug()

    })

    test('Atributos correspondientes al campo', () => {
        expect(screen.getByLabelText(/usuario/i)).toHaveAttribute('type', 'text')
        expect(screen.getByLabelText(/password/i)).toHaveAttribute('type', 'password')
    })

    test('Actualizacion de estado', () => {
        const inputUser = screen.getByLabelText(/usuario/i)
        const inputPassword = screen.getByLabelText(/password/i)

        fireEvent.change(inputUser, { target: { value: 'admin@admin.com' } })
        fireEvent.change(inputPassword, { target: { value: '123' } })

        expect(inputUser.value).toBe('admin@admin.com')
        expect(inputPassword.value).toBe('123')
    })

    test('Validación de formato & muestreo en tiempo real mientras se escribe', () => {
        const inputPassword = screen.getByLabelText(/password/i)

        //fireEvent.change(inputPassword, { target: { value: 'abc 123' } })
        fireEvent.change(inputPassword, { target: { value: 'abc1' } })

        // const mensajeError = screen.getByText(/El password no debe contener espacios/i)
        const mensajeError2 = screen.getByText(/Password invalido!/i)
        //expect(mensajeError).toBeInTheDocument()
        expect(mensajeError2).toBeInTheDocument()
    })

    test('Llamdo a la funcion Login exitoso', async () => {
        const userInput = screen.getByPlaceholderText(/usuario/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)

        fireEvent.change(userInput, { target: { value: 'bruno' } })
        fireEvent.change(passwordInput, { target: { value: '123456' } }) //mandar un password valido
        fireEvent.click(screen.getByRole('button', { name: /login/i }))

        await waitFor(() => {
            expect(login).toHaveBeenCalledWith({ user: 'bruno', password: '123456' })
        })

    })

    test('Submit con password invalido', () => {
        const userInput = screen.getByPlaceholderText(/usuario/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)

        fireEvent.change(userInput, { target: { value: 'bruno' } })
        fireEvent.change(passwordInput, { target: { value: 'abc 123' } })

        fireEvent.click(screen.getByRole('button', { name: /login/i }))

        const msj = screen.getByText(/Ingresar un password valido/i)
        expect(msj).toBeInTheDocument()
    })

    test('Muestra mensaje de backend en caso de error', async () => {
        // Mockear que la función login lance un error
        login.mockRejectedValueOnce(new Error('Usuario no encontrado'))

        const userInput = screen.getByPlaceholderText(/usuario/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)

        fireEvent.change(userInput, { target: { value: 'usuario' } })
        fireEvent.change(passwordInput, { target: { value: 'administrador' } })
        fireEvent.click(screen.getByRole('button', { name: /login/i }))

        // Esperar que el mensaje de error aparezca en el DOM
        const mensaje = await screen.findByText(/Usuario no encontrado/i)

        expect(login).toHaveBeenCalledWith({ user: 'usuario', password: 'administrador' })
        expect(mensaje).toBeInTheDocument()
    })

    test('Navegar a registrarse', () => {
        const btnRegistrarse = screen.getByRole('button',{name:/registrarse/i})

        fireEvent.click(btnRegistrarse)

        expect(mockedUsedNavigate).toHaveBeenCalled()
    })

})