import { screen, render, fireEvent, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { expect, vi } from "vitest"
import { userPost } from "../../../services/user"
import { AuthProvider } from "../../../context/AuthContext"

// 👇 MOCK antes que el import del componente
const setNotification = vi.fn()
const mockedUsedNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom')
    return {
        ...actual,
        useOutletContext: () => ({
            setNotification,
            notification: { error: '', exito: '' } // <-- creo un objeto vacio para evitar errores
        }),
        useNavigate: () => mockedUsedNavigate
    }
})

vi.mock('../../../services/user.js', () => ({
    userPost: vi.fn().mockResolvedValue({ error: null }) // o { success: true }
}))

// 👇 Import después del mock
import UserForm from "../../../pages/user/userForm"

beforeEach(() => {
    // Renderizar componente con contextos necesarios
    render(
      <MemoryRouter>
        <AuthProvider>
            <UserForm />
        </AuthProvider>
      </MemoryRouter>
    )
  })

describe('Formulario de registro de usuario', () => {

    describe('Comprobacion de presencia, atributo & ingreso de datos', () => {

        test('Renderiza todos los campos del formulario', () => {
            expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument()
            expect(screen.getByPlaceholderText(/ingrese un password/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/pregunta/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/respuesta/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/confirmar password/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/imagen/i)).toBeInTheDocument()
            expect(screen.getByLabelText(/escribe un poco sobre ti/i)).toBeInTheDocument()
            expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument()
        })

        test('Cada campo tiene el atributo type correspondiente', () => {
            expect(screen.getByLabelText(/nombre de usuario/i)).toHaveAttribute('type', 'text')
            expect(screen.getByPlaceholderText(/ingrese un password/i)).toHaveAttribute('type', 'password')
            expect(screen.getByLabelText(/email/i)).toHaveAttribute('type', 'text')
            expect(screen.getByLabelText(/respuesta/i)).toHaveAttribute('type', 'text')
            expect(screen.getByLabelText(/confirmar password/i)).toHaveAttribute('type', 'password')
            expect(screen.getByLabelText(/imagen/i)).toHaveAttribute('type', 'file')
            expect(screen.getByRole('button', { name: /enviar/i })).toHaveAttribute('type', 'submit')
        })

        test('Simula ingreso de datos en campos de texto, select y textarea', () => {
            const inputUserName = screen.getByLabelText(/nombre de usuario/i)
            const inputPassword = screen.getByPlaceholderText(/password/i)
            const selectPregunta = screen.getByLabelText(/pregunta/i)
            const sobreMi = screen.getByLabelText(/sobre ti/i)

            fireEvent.change(inputUserName, { target: { value: 'bruno88' } })
            fireEvent.change(inputPassword, { target: { value: '123456' } })
            fireEvent.change(selectPregunta, { target: { value: 'RE Favorito?' } })
            fireEvent.change(sobreMi, { target: { value: 'Soy dev fanatico de RE' } })

            expect(inputUserName).toHaveValue('bruno88')
            expect(inputPassword).toHaveValue('123456')
            expect(selectPregunta).toHaveValue('RE Favorito?')
            expect(sobreMi).toHaveValue('Soy dev fanatico de RE')
        })

        test('El select de pregunta tiene las opciones correctas', () => {
            const options = screen.getAllByRole('option')
            expect(options).toHaveLength(4) // Cambiá el número si hay más o menos opciones
            expect(options[0]).toHaveTextContent('-- Elige una opción --')
            expect(options[1]).toHaveTextContent('RE Favorito?')
            expect(options[2]).toHaveTextContent('Personaje Favorito de RE?')
            expect(options[3]).toHaveTextContent('Cual fue tu Primer RE?')
        })
    })

    describe('Validaciones de Formulario', () => {
        test('Ingreso de datos invalidos', async () => {
            const inputUserName = screen.getByLabelText(/nombre de usuario/i)
            const inputPassword = screen.getByPlaceholderText(/password/i)
            const inputEmail = screen.getByLabelText(/email/i)

            fireEvent.change(inputUserName, { target: { value: 'abc' } })
            fireEvent.change(inputEmail, { target: { value: 'bru.com' } })
            fireEvent.change(inputPassword, { target: { value: '123' } })

            /* Si usás directamente getByText sin esperar, 
               estás buscando un nodo antes de que aparezca en el DOM, 
               lo cual lanza error porque no lo encuentra.
               aunque react - hook - form use onChange, 
               React puede tardar uno o dos renders en mostrar los errores.
             */

            await waitFor(() => {
                expect(screen.getByText(/Mínimo 5 caracteres/i)).toBeInTheDocument()
                expect(screen.getByText(/Mínimo 6 caracteres/i)).toBeInTheDocument()
                expect(screen.getByText(/Email inválido/i)).toBeInTheDocument()
            })
        })

        test('Contraseñas no coinciden', async () => {

            const password = screen.getByPlaceholderText(/password/i)
            const confirmPassword = screen.getByLabelText(/confirmar password/i)

            fireEvent.change(password, { target: { value: '123456' } })
            fireEvent.change(confirmPassword, { target: { value: '654321' } })

            await waitFor(() => {
                expect(screen.getByText(/las contraseñas no coinciden/i)).toBeInTheDocument()
            })
        })

        test('Respuesta con menos de 5 caracteres', async () => {

            const respuesta = screen.getByLabelText(/respuesta/i)
            fireEvent.change(respuesta, { target: { value: 'abc' } })

            await waitFor(() => {
                expect(screen.getByText(/mínimo 5 caracteres/i)).toBeInTheDocument()
            })
        })

        test('Pregunta sin seleccionar', async () => {

            const select = screen.getByLabelText(/selecciona una pregunta/i)
            fireEvent.change(select, { target: { value: '' } })

            await waitFor(() => {
                expect(screen.getByText(/selecciona una pregunta/i)).toBeInTheDocument()
            })
        })

        test('sobreMi supera el máximo de caracteres', async () => {

            const sobreMi = screen.getByLabelText(/escribe un poco sobre ti/i)
            const textoLargo = 'a'.repeat(160)

            fireEvent.change(sobreMi, { target: { value: textoLargo } })

            await waitFor(() => {
                expect(screen.getByText(/máximo 150 caracteres/i)).toBeInTheDocument()
            })
        })

        test('Hacer submit con datos invalidos o vacions', async () => {
            const inputUserName = screen.getByLabelText(/nombre de usuario/i)
            const inputPassword = screen.getByPlaceholderText(/password/i)
            const btnEnviar = screen.getByRole('button', { name: /enviar/i })

            fireEvent.change(inputUserName, { target: { value: '' } })
            fireEvent.change(inputPassword, { target: { value: '' } })
            fireEvent.click(btnEnviar)

            const msj = await screen.findByText(/Nombre requerido/i)
            const msj2 = await screen.findByText(/Contraseña requerida/i)

            await waitFor(() => {
                expect(msj).toBeInTheDocument()
                expect(msj2).toBeInTheDocument()
            })

        })
    })
})

describe('UserForm con setNotification', () => {
    test('Renderiza correctamente', () => {
        expect(screen.getByText(/formulario de usuario/i)).toBeInTheDocument()
    })

    test('Simula envío con datos válidos y llamado a Notificacion', async () => {
        fireEvent.change(screen.getByLabelText(/nombre de usuario/i), {
            target: { value: 'bruno88' }
        })
        fireEvent.change(screen.getByPlaceholderText(/password/i), {
            target: { value: '123456' }
        })
        fireEvent.change(screen.getByLabelText(/confirmar password/i), {
            target: { value: '123456' }
        })
        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'bruno@gmail.com' }
        })
        fireEvent.change(screen.getByLabelText(/pregunta/i), {
            target: { value: 'RE Favorito?' }
        })
        fireEvent.change(screen.getByLabelText(/respuesta/i), {
            target: { value: 'RESIDENT EVIL 3' }
        })
        fireEvent.change(screen.getByLabelText(/sobre ti/i), {
            target: { value: 'Fan de Resident Evil desde chico' }
        })

        // Imagen se puede simular así si hace falta
        const fileInput = screen.getByLabelText(/imagen/i)
        const file = new File(['(⌐□_□)'], 'avatar.png', { type: 'image/png' })
        fireEvent.change(fileInput, { target: { files: [file] } })

        const submitBtn = screen.getByRole('button', { name: /enviar/i })
        fireEvent.click(submitBtn)

        
        await waitFor(() => {
            expect(userPost).toHaveBeenCalled()
            expect(setNotification).toHaveBeenCalledWith({
                error: '',
                exito: 'Gracias por registrarte!'
            })
        })

    })

    test('Probar boton volver al Login', () => {
        const btnVolver = screen.getByRole('button', {name:/volver/i})

        fireEvent.click(btnVolver)
        
        expect(mockedUsedNavigate).toHaveBeenCalledWith('/login') 
    })
})