const app = require('../../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const path = require('path') // Necesario para ruta a la imagen
const fs = require('fs')
const uploadDir = path.join(__dirname, '../../public/uploads')
const Personaje = require('../../models/personaje')
const User = require('../../models/user')
const { upLoadUsers, getUsers } = require('../test_helper')
const api = supertest(app)

let token = null

beforeEach(async () => {
    await Personaje.deleteMany({})
    await User.deleteMany({})

    //cargo los usuarios
    await upLoadUsers()
    //los obtengo
    const users = await getUsers()
    //me logeo para obtener token para poder hacer POST
    const res = await api.post('/').send({ user: users[0].userName, password: 'sekret' })
    token = res.body.token
})

describe('POST /personaje/alta', () => {

    test('crear personaje exitosamente', async () => {
        const res = await api
            .post('/personaje/alta')
            .set('Authorization', `Bearer ${token}`)
            .field('nombre', 'Leon S. Kennedy')
            .field('fechaNacimiento', '1977-02-15')
            .field('edad', '27')
            .field('colorOjos', 'azul')
            .field('colorPelo', 'castaño')
            .field('altura', 180)
            .field('peso', 70)
            .field('categoria', 'héroe')
            .field('oficio', 'héroe')
            .field('condicion', 'vivo')
            .field('primeraAparicion', 'Resident Evil 2')
            .field('ultimaAparicion', 'Resident Evil 4 Remake')
            .field('biografia', 'Un clásico de la saga.')
            .attach('picture', path.join(__dirname, 'fixtures', 'test-imagen.png'))
            .expect('Content-Type', /application\/json/)
            .expect(201)

        expect(res.body.msj).toBe('Éxito, personaje creado!')
    })

    test('Falta de campos obligatorios', async () => {
        const personaje = {
            nombre: '',
            categoria: '',
            condicion: '',
            primeraAparicion: '',
            ultimaAparicion: '',
            picture: ''
        }

        const res = await api
            .post('/personaje/alta')
            .set('Authorization', `Bearer ${token}`)
            .send(personaje)
            .expect('Content-Type', /application\/json/)
            .expect(400)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Ingrese un nombre!')
        expect(res.body.error).toContain('Categoría inválida o no seleccionada!')
        expect(res.body.error).toContain('Seleccione primera aparición!')
        expect(res.body.error).toContain('Seleccione última aparición!')
        expect(res.body.error).toContain('Debe subir una imagen!')

    })

    test('Validacion de longitud', async () => {
        const personaje = {
            nombre: 'xx',
            edad:'aeiou',
            colorOjos:'color verde aceituna, mas verdes que un lago',
            colorPelo:'color como la rojo, tan rojo como la sangre',
            altura: 'abcde',
            peso:'efgh',
            oficio:'Investigador bioquímico especializado en mutaciones virales clandestinas',
            biografia: 'Leon S. Kennedy es un agente del gobierno estadounidense con un pasado oscuro y una valentía sin igual. Desde su primer día como policía en Raccoon City, se vio envuelto en el horror provocado por la Corporación Umbrella. Su determinación lo llevó a enfrentarse a múltiples amenazas bioterroristas alrededor del mundo. A lo largo de los años, Leon ha demostrado una y otra vez su compromiso inquebrantable con la justicia, sacrificando su bienestar personal por el bien de la humanidad. Su experiencia, inteligencia táctica, habilidades de combate y empatía lo han convertido en un símbolo de esperanza en un mundo asolado por el caos. A pesar de las pérdidas, sigue adelante.',
            categoria: '',
            condicion: '',
            primeraAparicion: '',
            ultimaAparicion: '',
            picture: ''
        }

        const res = await api
            .post('/personaje/alta')
            .set('Authorization', `Bearer ${token}`)
            .send(personaje)
            .expect('Content-Type', /application\/json/)
            .expect(400)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Nombre: Debe tener entre 3 y 30 caracteres')
        expect(res.body.error).toContain('Edad: Debe ingresar solo números')
        expect(res.body.error).toContain('Color de ojos: máximo 20 caracteres')
        expect(res.body.error).toContain('Color de pelo: máximo 20 caracteres')
        expect(res.body.error).toContain('Altura: debe ser un número válido')
        expect(res.body.error).toContain('Altura: debe ser un número válido')
        expect(res.body.error).toContain('Peso: debe ser un número válido')
        expect(res.body.error).toContain('Oficio: máximo 50 caracteres')
        expect(res.body.error).toContain('Biografía: máximo 500 caracteres')

    })
})


afterEach(() => {
    // Limpias la carpeta uploads para que no acumule imágenes de tests
    fs.readdirSync(uploadDir).forEach(file => {
        if (file !== 'default.png') {
            fs.unlinkSync(path.join(uploadDir, file))
        }
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})
