import { beforeEach, expect, vi } from 'vitest'
import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../../context/AuthContext'
import CharacterForm from '../../../pages/character/CharacterForm'


beforeEach(() => {
    render(
        <MemoryRouter>
            <AuthProvider>
                <CharacterForm />
            </AuthProvider>
        </MemoryRouter>
    )
})

describe('Renderizado & ingreso de datos', () => {
    test('Verifacar presencia de campos', () => {
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
    })
}) 