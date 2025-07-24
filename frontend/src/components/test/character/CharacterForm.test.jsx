import { describe, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import CharacterForm from '../../../pages/character/CharacterForm'
import { AuthProvider } from '../../../context/AuthContext'


//const mockNavigate = vi.fn()
const mockSetNotification = vi.fn()

vi.mock('../../../services/character.js', () => {
  return {
    characterPost: vi.fn() // definido inline
  }
})

import { characterPost } from '../../../services/character'



vi.mock('../../../context/AuthContext', async () => {
    const actual = await vi.importActual('../../../context/AuthContext')
    return {
        ...actual, // importa lo que no estés sobreescribiendo
        useAuth: () => ({ navigate: vi.fn() }),
        AuthProvider: ({ children }) => <>{children}</> // mock del provider
    }
})

vi.mock('react-router-dom', async (importOriginal) => {
    const actual = await importOriginal()
    return {
        ...actual,
        useOutletContext: () => ({ setNotification: mockSetNotification }),
    }
})

vi.mock('../../../services/token', () => ({
    getToken: () => 'Bearer test-token'
}))


beforeEach(() => {
    render(
        <MemoryRouter>
            <AuthProvider>
                <CharacterForm />
            </AuthProvider>
        </MemoryRouter>
    )
})


/*
describe('Renderizado & ingreso de datos', () => {
    test('Verifacar presencia de campos', () => {

        // Inputs 
        const inputNombre = screen.getByLabelText(/nombre/i)
        const inputEdad = screen.getByLabelText(/edad/i)
        const inputFechaNacimiento = screen.getByLabelText(/fecha/i)
        const inputAltura = screen.getByLabelText(/altura/i)
        const inputPeso = screen.getByLabelText(/peso/i)
        const inputColorOjos = screen.getByLabelText(/ojos/i)
        const inputColorPelo = screen.getByLabelText(/pelo/i)
        const inputOficio = screen.getByLabelText(/oficio/i)
        const inputPicture = screen.getByLabelText(/imagen/i)
        const texAreaBiografia = screen.getByLabelText(/biografia/i)

        // Select 

        const selectCategoria = screen.getByLabelText(/categoria/i)
        const selectCondicion = screen.getByLabelText(/condicion/i)
        const selectPrimeraAparicion = screen.getByLabelText(/primera/i)
        const selectUltimaAparicion = screen.getByLabelText(/última aparición/i)

        // options

        const options = screen.getAllByRole('option', { name: /resident evil/i })


        // buttons

        const btnEnviar = screen.getByRole('button', { name: /enviar/i })
        const btnVolver = screen.getByRole('button', { name: /volver/i })


        expect(inputNombre).toBeInTheDocument()
        expect(inputEdad).toBeInTheDocument()
        expect(inputFechaNacimiento).toBeInTheDocument()
        expect(inputAltura).toBeInTheDocument()
        expect(inputPeso).toBeInTheDocument()
        expect(inputColorOjos).toBeInTheDocument()
        expect(inputColorPelo).toBeInTheDocument()
        expect(inputOficio).toBeInTheDocument()
        expect(inputPicture).toBeInTheDocument()
        expect(texAreaBiografia).toBeInTheDocument()
        expect(selectCategoria).toBeInTheDocument()
        expect(selectCondicion).toBeInTheDocument()
        expect(selectPrimeraAparicion).toBeInTheDocument()
        expect(selectUltimaAparicion).toBeInTheDocument()
        expect(options).toHaveLength(20) // <-- options de primera & ultima aparicion
        expect(btnEnviar).toBeInTheDocument()
        expect(btnVolver).toBeInTheDocument()



    })

    test('Ingresar datos a los inputs y selects', () => {
        // Inputs 
        const inputNombre = screen.getByLabelText(/nombre/i)
        const inputEdad = screen.getByLabelText(/edad/i)
        const texAreaBiografia = screen.getByLabelText(/biografia/i)

        // Select 
        const selectPrimeraAparicion = screen.getByLabelText(/primera/i)


        fireEvent.change(inputNombre, { target: { value: 'Leon s Kennedy' } })
        fireEvent.change(inputEdad, { target: { value: '27' } })
        fireEvent.change(texAreaBiografia, { target: { value: 'Agente del FBI' } })
        fireEvent.change(selectPrimeraAparicion, { target: { value: 'Resident Evil 2 (1998)' } })

        expect(inputNombre).toHaveValue('Leon s Kennedy')
        expect(inputEdad).toHaveValue('27')
        expect(texAreaBiografia).toHaveValue('Agente del FBI')
        expect(selectPrimeraAparicion).toHaveValue('Resident Evil 2 (1998)') //<--- debe coincidir con el del form
    })
})

describe('Ingreso de datos invalidos', () => {
    test('Datos ausentes o mal formados', () => {
        // Inputs 
        const inputNombre = screen.getByLabelText(/nombre/i)
        const inputEdad = screen.getByLabelText(/edad/i)
        const inputAltura = screen.getByLabelText(/altura/i)
        const inputPeso = screen.getByLabelText(/peso/i)
        const inputColorOjos = screen.getByLabelText(/ojos/i)


        // Select 

        const selectCategoria = screen.getByLabelText(/categoria/i)

        const selectPrimeraAparicion = screen.getByLabelText(/primera/i)

        fireEvent.change(inputNombre, { target: { value: '' } })
        fireEvent.change(inputEdad, { target: { value: 'abc' } })
        fireEvent.change(inputPeso, { target: { value: 'abc' } })
        fireEvent.change(inputAltura, { target: { value: 'abc' } })
        fireEvent.change(inputColorOjos, { target: { value: 'xxxxxxxxxxxxxxxxxxxxx' } })
        fireEvent.change(selectCategoria, { target: { value: '' } })
        fireEvent.change(selectPrimeraAparicion, { target: { value: '' } })


        expect(screen.findByText(/nombre requerido/i))
        expect(screen.findByText(/Edad inválida/i))
        expect(screen.findByText(/Peso: debe ser un número válido/i))
        expect(screen.findByText(/Altura: debe ser un número válido/i))
        expect(screen.findByText(/Máximo 20 caracteres/i))
        expect(screen.findByText(/Categoría inválida o no seleccionada!/i))
        expect(screen.findByText(/Seleccione primera aparición!/i))


    })
})

*/
describe('Ingreso datos validos & llamando a la funcion post', () => {
    test('envía el formulario y llama a characterPost y setNotification', async () => {
        // 🧪 simulamos éxito en la llamada
        characterPost.mockResolvedValue({ msj: 'Personaje creado con éxito' })

        fireEvent.change(screen.getByLabelText(/nombre/i), {
            target: { value: 'Leon Kennedy' }
        })
        fireEvent.change(screen.getByLabelText(/categoria/i), {
            target: { value: 'héroe' }
        })
        fireEvent.change(screen.getByLabelText(/condicion/i), {
            target: { value: 'vivo' }
        })
        fireEvent.change(screen.getByLabelText(/primera aparición/i), {
            target: { value: 'Resident Evil 2 (1998)' }
        })
        fireEvent.change(screen.getByLabelText(/última aparición/i), {
            target: { value: 'Resident Evil 4 (2005)' }
        })
        fireEvent.change(screen.getByLabelText(/imagen/i), {
            target: { files: [new File(['img'], 'leon.jpg', { type: 'image/jpg' })] }
        })


        fireEvent.click(screen.getByRole('button', { name: /enviar/i }))

        await waitFor(() => {
            expect(characterPost).toHaveBeenCalledOnce()
        })

    })
})

