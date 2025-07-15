import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from "react-router-dom"
import { expect, vi } from 'vitest'
import Login from "../../pages/Login"

beforeEach(() => {
    render(
        <MemoryRouter>
            <Login />
        </MemoryRouter>
    )
})

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
})