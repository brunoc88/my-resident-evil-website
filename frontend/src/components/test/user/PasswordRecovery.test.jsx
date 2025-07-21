const setNotification = vi.fn()
const mockedUsedNavigate = vi.fn()

vi.mock("react-router-dom", async () => {
    const actual = await vi.importActual("react-router-dom")
    return {
        ...actual,
        useOutletContext: () => ({
            setNotification,
            notification: { error: "", exito: "" }
        }),
        useNavigate: () => mockedUsedNavigate
    }
})

vi.mock('../../../services/user', () => {
    return {
        passwordRecovery: vi.fn()
    }
})


import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import { expect, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import PasswordRecovery from "../../../pages/user/PasswordRecovery";
import { passwordRecovery } from "../../../services/user"


beforeEach(() => {
    setNotification.mockReset()
    passwordRecovery.mockReset()
    mockedUsedNavigate.mockReset()
    render(
        <MemoryRouter>
            <PasswordRecovery />
        </MemoryRouter>
    )
})

describe('Recuperar password', () => {
    test('Renderizado e ingreso de datos en los campos', () => {
        const inputEmail = screen.getByLabelText(/email/i)
        const selectPregunta = screen.getByLabelText(/pregunta/i)
        const inputRespuesta = screen.getByLabelText(/respuesta/i)

        fireEvent.change(inputEmail, { target: { value: 'bruno88@gmail.com' } })
        fireEvent.change(selectPregunta, { target: { value: 'RE Favorito?' } })
        fireEvent.change(inputRespuesta, { target: { value: 'Resident Evil 3' } })

        expect(inputEmail).toBeInTheDocument()
        expect(selectPregunta).toBeInTheDocument()
        expect(inputRespuesta).toBeInTheDocument()
        expect(inputEmail).toHaveValue('bruno88@gmail.com')
        expect(selectPregunta).toHaveValue('RE Favorito?')
        expect(inputRespuesta).toHaveValue('Resident Evil 3')
    })

    test('Ingreso de datos invalidos en los campos', () => {
        const inputEmail = screen.getByLabelText(/email/i)
        const selectPregunta = screen.getByLabelText(/pregunta/i)
        const inputRespuesta = screen.getByLabelText(/respuesta/i)

        fireEvent.change(inputEmail, { target: { value: 'bruno88' } })
        fireEvent.change(selectPregunta, { target: { value: '' } })
        fireEvent.change(inputRespuesta, { target: { value: '' } })

        expect(screen.findByText('Email inválido'))
        expect(screen.findByText('Selecciona una pregunta'))
        expect(screen.findByText('Respuesta requerida'))
    })

    test('Mandar formulario vacio', () => {
        const inputEmail = screen.getByLabelText(/email/i)
        const selectPregunta = screen.getByLabelText(/pregunta/i)
        const inputRespuesta = screen.getByLabelText(/respuesta/i)
        const btnEnviar = screen.getByRole('button', { name: /enviar/i })

        fireEvent.change(inputEmail, { target: { value: '' } })
        fireEvent.change(selectPregunta, { target: { value: '' } })
        fireEvent.change(inputRespuesta, { target: { value: '' } })
        fireEvent.click(btnEnviar)

        expect(screen.findByText('Email inválido'))
        expect(screen.findByText('Selecciona una pregunta'))
        expect(screen.findByText('Respuesta requerida'))
    })

})

describe("Recuperar password", () => {
    test("Comprobar que se llamon a la funcion recoveryPassword", async () => {
        const inputEmail = screen.getByLabelText(/email/i);
        const selectPregunta = screen.getByLabelText(/pregunta/i);
        const inputRespuesta = screen.getByLabelText(/respuesta/i);
        const btnEnviar = screen.getByRole("button", { name: /enviar/i })

        fireEvent.change(inputEmail, { target: { value: "bruno88@gmail.com" } })
        fireEvent.change(selectPregunta, { target: { value: "RE Favorito?" } })
        fireEvent.change(inputRespuesta, { target: { value: "Resident Evil 3" } })
        fireEvent.click(btnEnviar);

        await waitFor(() => {
            expect(passwordRecovery).toHaveBeenCalled();
        })
    })
})

describe("PasswordRecovery - notificaciones", () => {
  test("Muestra notificación de éxito y navega luego del submit exitoso", async () => {
    // Mock de respuesta exitosa
    passwordRecovery.mockResolvedValue({
      msj: "Contraseña enviada",
      nuevaPassword: "abc123"
    })

    // Rellenar formulario
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" }
    })
    fireEvent.change(screen.getByLabelText(/pregunta/i), {
      target: { value: "RE Favorito?" }
    })
    fireEvent.change(screen.getByLabelText(/respuesta/i), {
      target: { value: "Resident Evil 3" }
    })

    // Enviar formulario
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }))

    // Esperar que setNotification se haya llamado con mensaje de éxito
    await waitFor(() => {
      expect(setNotification).toHaveBeenCalledWith({
        error: "",
        exito: "Contraseña enviada + abc123"
      })
    })

    // Verificar que navegue a /login
    expect(mockedUsedNavigate).toHaveBeenCalledWith("/login")
  })

  test("Muestra notificación de error cuando falla el submit", async () => {
    // Mock que lanza error
    passwordRecovery.mockRejectedValue(new Error("Error en servidor"))

    // Rellenar formulario
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "user@example.com" }
    })
    fireEvent.change(screen.getByLabelText(/pregunta/i), {
      target: { value: "RE Favorito?" }
    })
    fireEvent.change(screen.getByLabelText(/respuesta/i), {
      target: { value: "Resident Evil 3" }
    })

    // Enviar formulario
    fireEvent.click(screen.getByRole("button", { name: /enviar/i }))

    // Esperar que setNotification se haya llamado con el error
    await waitFor(() => {
      expect(setNotification).toHaveBeenCalledWith({
        error: expect.any(Error)
      })
    })

    // Opcional: verificar que no navegue si hay error
    expect(mockedUsedNavigate).not.toHaveBeenCalled()
  })
})