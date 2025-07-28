// 1. MOCK de useOutletContext
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useOutletContext: () => ({ setNotification: vi.fn() })
  }
})

// 2. MOCK del servicio con datos de dummy.js
vi.mock('../../../services/character.js', async () => {
  const { characters } = await import('../dummy.js')
  return {
    characterList: vi.fn().mockResolvedValue({
      personajes: characters // importante: debe ser 'personajes' para el uso en CharacterIndex
    })
  }
})

// 3. IMPORTS normales (después de los mocks)
import { vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from '../../../context/AuthContext'
import CharacterIndex from '../../../pages/character/CharacterIndex.jsx' // Ojo: la ruta es 'characters', no 'character'

describe('CharacterIndex', () => {
  test('Renderiza los personajes del dummy', async () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <CharacterIndex />
        </AuthProvider>
      </MemoryRouter>
    )
    // Esperar a que los personajes se muestren
    expect(await screen.findByText('Leon Kennedy')).toBeInTheDocument()
    expect(await screen.findByText('Jill Valentine')).toBeInTheDocument()
    // También puedes chequear el título
    expect(screen.getByText('Lista de Personajes')).toBeInTheDocument()
    screen.debug()
  })
})