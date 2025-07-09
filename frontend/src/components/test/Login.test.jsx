import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../../pages/Login'
import login from '../../services/login' //funcion login
import { vi } from 'vitest'

//  Creamos mocks vacíos de setError y setMsj
const setError = vi.fn()
const setMsj = vi.fn()
const mockedUsedNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useOutletContext: () => ({ setError, setMsj }),
        useNavigate: () => mockedUsedNavigate
    }
})

// mockeamos la llamada de axios.post
vi.mock('../../services/login', () => ({
    default: vi.fn()
}))


// como todos los test de login va a usar el componente lo renderizo en cada prueba
// se obtienen test mas limpios
beforeEach(() => {
    vi.clearAllMocks()
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    )
})

describe('login', () => {
    test('Renderizado básico', () => {
        // ¿Se renderizan correctamente los inputs de usuario y contraseña?
        // ¿Existe el botón "Login" & demas inputs?

        const userInput = screen.getByPlaceholderText(/usuario/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)
        const loginBtn = screen.getByRole('button', { name: /login/i })

        expect(userInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
        expect(loginBtn).toBeInTheDocument()

    })

    test('Inputs controlados', () => {
        //"¿Al escribir en los inputs, se actualiza el estado (setUser, setPassword)?"

        //screen.debug() < -- para ver el componente en consola
        const userInput = screen.getByPlaceholderText(/usuario/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)

        fireEvent.change(userInput, { target: { value: 'admin@admin.com' } })
        fireEvent.change(passwordInput, { target: { value: '123' } })

        expect(userInput.value).toBe('admin@admin.com')
        expect(passwordInput.value).toBe('123')
    })

    describe('Submit exitoso', () => {
        test('Llamado a la función de login (axios.post)', () => {
            const userInput = screen.getByPlaceholderText(/usuario/i)
            const passwordInput = screen.getByPlaceholderText(/password/i)

            // simulo ingresar valores
            fireEvent.change(userInput, { target: { value: 'bruno' } })
            fireEvent.change(passwordInput, { target: { value: '123' } })
            // simulo hacer click
            fireEvent.click(screen.getByRole('button', { name: /login/i }))

            // confirmamos con que se llamo a la funcion de login
            expect(login).toHaveBeenCalledWith({ user: 'bruno', password: '123' })

        })

        test('redirigir a /home', async () => {
            const userInput = screen.getByPlaceholderText(/usuario/i)
            const passwordInput = screen.getByPlaceholderText(/password/i)

            // mock explícito de login para que devuelva algo exitoso
            login.mockResolvedValue({})

            fireEvent.change(userInput, { target: { value: 'bruno' } })
            fireEvent.change(passwordInput, { target: { value: '123' } })
            fireEvent.click(screen.getByRole('button', { name: /login/i }))

            expect(login).toHaveBeenCalledWith({ user: 'bruno', password: '123' })

            await waitFor(() => {
                expect(mockedUsedNavigate).toHaveBeenCalledWith('/home')
            })
        })

    })

    describe('Submit fallido', () => {
        test('Muestra mensaje de error cuando el backend responde con error', async () => {
            // Simulo valores
            fireEvent.change(screen.getByPlaceholderText(/usuario/i), {
                target: { value: 'bruno' },
            })
            fireEvent.change(screen.getByPlaceholderText(/password/i), {
                target: { value: 'incorrecto' },
            })

            // Mockeo la respuesta de login
            login.mockResolvedValueOnce({ error: 'Credenciales inválidas' })

            // Simulo submit
            fireEvent.click(screen.getByRole('button', { name: /login/i }))

            // Espero a que setError haya sido llamado
            await waitFor(() => {
                expect(setError).toHaveBeenCalledWith('Credenciales inválidas')
            })
        })

        test('No redirigir a /home cuando las credenciales son inválidas', async () => {
            // Simulo valores inválidos
            fireEvent.change(screen.getByPlaceholderText(/usuario/i), {
                target: { value: 'bruno' },
            })
            fireEvent.change(screen.getByPlaceholderText(/password/i), {
                target: { value: 'incorrecto' },
            })

            // Simulo respuesta con error
            login.mockResolvedValueOnce({ error: 'Credenciales inválidas' })

            // Simulo submit
            fireEvent.click(screen.getByRole('button', { name: /login/i }))

            // Afirmo que NO redirige
            await waitFor(() => {
                expect(mockedUsedNavigate).not.toHaveBeenCalled()
            })
        })

    })

    describe('Login - Limpieza de errores', () => {
        test('Limpia el error previo cuando se intenta un nuevo login', async () => {
            // Simular primer intento con error
            login.mockResolvedValueOnce({ error: 'Credenciales inválidas' })

            fireEvent.change(screen.getByPlaceholderText(/usuario/i), { target: { value: 'bruno' } })
            fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'incorrecto' } })
            fireEvent.click(screen.getByRole('button', { name: /login/i }))

            await waitFor(() => {
                expect(setError).toHaveBeenCalledWith('Credenciales inválidas')
            })

            // Simular nuevo intento: limpiar error antes de enviar nuevo login
            login.mockResolvedValueOnce({})

            fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: '123' } })
            fireEvent.click(screen.getByRole('button', { name: /login/i }))

            // Verificar que setError se llamó primero con null para limpiar el error anterior
            expect(setError).toHaveBeenCalledWith(null)

            // Y que luego se llamó login y navegación correctamente
            await waitFor(() => {
                expect(login).toHaveBeenCalledWith({ user: 'bruno', password: '123' })
                expect(mockedUsedNavigate).toHaveBeenCalledWith('/home')
            })
        })
    })
})

