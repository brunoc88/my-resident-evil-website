const app = require('../../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const path = require('path') // Necesario para ruta a la imagen
const fs = require('fs')
const uploadDir = path.join(__dirname, '../../public/uploads')
const Personaje = require('../../models/personaje')
const User = require('../../models/user')
const { upLoadUsers, getUsers, getPersonajes } = require('../test_helper')
const api = supertest(app)

let token = null
let token2 = null

beforeEach(async () => {
    await Personaje.deleteMany({})
    await User.deleteMany({})

    //cargo los usuarios
    await upLoadUsers()
    //los obtengo
    const users = await getUsers()
    //me logeo para obtener token para poder hacer POST
    const res = await api.post('/').send({ user: users[0].userName, password: 'sekret' })
    const res2 = await api.post('/').send({ user: users[1].userName, password: 'sekret' })
    token = res.body.token
    token2 = res2.body.token

    // Crear personaje para usar en tests de eliminación
    await api
        .post('/personaje/alta')
        .set('Authorization', `Bearer ${token}`)
        .field('nombre', 'Jill Valentine')
        .field('fechaNacimiento', '1974-02-03')
        .field('edad', '29')
        .field('colorOjos', 'verde')
        .field('colorPelo', 'rubio')
        .field('altura', 170)
        .field('peso', 56)
        .field('categoria', 'héroe')
        .field('oficio', 'miembro de S.T.A.R.S.')
        .field('condicion', 'vivo')
        .field('primeraAparicion', 'Resident Evil')
        .field('ultimaAparicion', 'Resident Evil 3 Remake')
        .field('biografia', 'Miembro clave en la lucha contra Umbrella.')
        .attach('picture', path.join(__dirname, 'fixtures', 'test-imagen.png'))
    
})

describe('POST /personaje/alta', () => {

    test('crear personaje exitosamente', async () => {
        const personajesInicio = await getPersonajes()

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

        const personajesFinal = await getPersonajes()
        expect(res.body.msj).toBe('Éxito, personaje creado!')
        expect(personajesFinal).toHaveLength(personajesInicio.length + 1)

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
            edad: 'aeiou',
            colorOjos: 'color verde aceituna, mas verdes que un lago',
            colorPelo: 'color como la rojo, tan rojo como la sangre',
            altura: 'abcde',
            peso: 'efgh',
            oficio: 'Investigador bioquímico especializado en mutaciones virales clandestinas',
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

describe('GET /personaje/all', () => {
    test('Obtener todos los personajes', async () => {

        const res = await api
            .get('/personaje/all')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toBeTruthy()
        expect(res.body).toHaveProperty('personajes')

    })
})

describe('GET /personaje/:id', () => {
    test('Perfil eliminar o no existente', async () => {
        // genero un ObjectId válido que se que no está en la base
        const nonExistingId = new mongoose.Types.ObjectId()
        const res = await api
            .get(`/personaje/${nonExistingId}`)
            .expect(404)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).not.toBeNull()
        expect(res.body.error).toContain('Personaje inexistente o eliminado!')
    })

    test('Perfil encontrado', async () => {
        const personajes = await getPersonajes()
        const id = personajes[0].id

        const res = await api
            .get(`/personaje/${id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })
})

describe('PATCH /personaje/eliminar/:id', () => {
    test('Eliminar personaje', async () => {
        const personajes = await getPersonajes()
        const id = personajes[0].id

        const res = await api
            .patch(`/personaje/eliminar/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain('Personaje eliminado!')
    })

    test('Intentanto eliminar usuario rol comun ', async () => {
        const personajes = await getPersonajes()
        const id = personajes[0].id

        const res = await api
            .patch(`/personaje/eliminar/${id}`)
            .set('Authorization', `Bearer ${token2}`)//token user comun
            .expect(403)
            .expect('Content-Type', /application\/json/)
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Acceso denegado: permisos insuficientes')
    })
})

describe('PUT /personaje/editar/:id', () => {
    test('No hay cambios!', async () => {
        const personajes = await getPersonajes()
        const id = personajes[0].id

        const per = {

        }

        const res = await api
            .put(`/personaje/editar/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(per)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('No hay cambios!')

    })

    test('No hay cambiosV2!', async () => {
        const personajes = await getPersonajes()
        const id = personajes[0].id
        const res = await api
            .put(`/personaje/editar/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .field('nombre', 'Jill Valentine')
            .field('fechaNacimiento', '1974-02-03')
            .field('edad', '29')
            .field('colorOjos', 'verde')
            .field('colorPelo', 'rubio')
            .field('altura', 170)
            .field('peso', 56)
            .field('categoria', 'héroe')
            .field('oficio', 'miembro de S.T.A.R.S.')
            .field('condicion', 'vivo')
            .field('primeraAparicion', 'Resident Evil')
            .field('ultimaAparicion', 'Resident Evil 3 Remake')
            .field('biografia', 'Miembro clave en la lucha contra Umbrella.')
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('No hay cambios!')

    })

    test('Valores obligatorios', async () => {
        const personajes = await getPersonajes()
        const id = personajes[0].id

        const per = {
            nombre: '',
            categoria: '',
            condicion: ''
        }

        const res = await api
            .put(`/personaje/editar/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(per)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Ingrese un nombre!')
        expect(res.body.error).toContain('Categoría inválida o no seleccionada!')
        expect(res.body.error).toContain('Condición inválida o no seleccionada!')
    })

    test('Cambiar imagen: Personaje actualizado!', async () => {
        const personajes = await getPersonajes()
        const id = personajes[0].id


        const res = await api
            .put(`/personaje/editar/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .attach('picture', path.join(__dirname, 'fixtures', 'test-change-imagen.png'))
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain('Personaje actualizado!')

    })

    test('Personaje actualizado!', async () => {
        const personajes = await getPersonajes()
        const id = personajes[0].id

        const user = {
            nombre: 'Jill mamasita Valentine'
        }

        const res = await api
            .put(`/personaje/editar/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain('Personaje actualizado!')

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
