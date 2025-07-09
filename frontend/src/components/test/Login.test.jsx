import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Login from '../../pages/Login'
import { vi } from 'vitest'

//  Creamos mocks vacíos de setError y setMsj
const setError = vi.fn()
const setMsj = vi.fn()


vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useOutletContext: () => ({ setError, setMsj })
    }
})

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
    test('Renderizado básico de inputs user & password', () => {

        //screen.debug() < -- para ver el componente en consola
        const userInput = screen.getByPlaceholderText(/usuario/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)

        fireEvent.change(userInput, { target: { value: 'admin@admin.com' } })
        fireEvent.change(passwordInput, { target: { value: '123' } })

        expect(userInput.value).toBe('admin@admin.com')
        expect(passwordInput.value).toBe('123')
    })
})
