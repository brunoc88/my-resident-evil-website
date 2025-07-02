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

describe('PATCH /personaje/:id/like', () => {
    test('Dar like personaje', async () => {
        const personajes = await getPersonajes()
        const id = personajes[0].id
        
        const res = await api
        .patch(`/personaje/${id}/like`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
    })
})

describe('PATCH /personaje/:id/like', () => {
    test('Quitar like personaje', async () => {
        const personajes = await getPersonajes()
        const id = personajes[0].id

        //primero le doy like 
        const res = await api
        .patch(`/personaje/${id}/like`)
        .set('Authorization', `Bearer ${token}`)

        //luego se lo quito
        const res2 = await api
        .patch(`/personaje/${id}/unlike`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)
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