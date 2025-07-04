const app = require('../../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../../models/user')
const { upLoadUsers, getUsers } = require('../test_helper')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    await upLoadUsers()
})

describe('POST /user/recuperar-password', () => {
    test('Usuario incorrecto o inexistente', async () => {
        const user = {
            email: 'pepitos99@mail.com',
            pregunta: 'resident evil favorito?',
            respuesta: 'resident evil favorito 6'
        }

        const res = await api
            .post('/user/recuperar-password')
            .send(user)
            .expect(404)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Usuario incorrecto o inexistente')

    })

    test('Usuario eliminado o inactivo', async () => {
        const user = {
            email: 'comunuser@gmail.com',
            pregunta: 'resident evil favorito?',
            respuesta: 'resident evil favorito 5',
        }

        const res = await api
            .post('/user/recuperar-password')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Usuario eliminado o inactivo')

    })

    test('Pregunta o respuesta incorrecta', async () => {
        const user = {
            email: 'unkonw88@gmail.com',
            pregunta: 'resident evil favorito?',
            respuesta: 'resident evil 5',
        }

        const res = await api
            .post('/user/recuperar-password')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Pregunta o respuesta incorrecta')

    })

    test('Password recuperado!', async () => {
        const user = {
            email: 'unkonw88@gmail.com',
            pregunta: 'resident evil favorito?',
            respuesta: 'resident evil 4'
        }

        const res = await api
            .post('/user/recuperar-password')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain('Password recuperado!')
        expect(res.body).toHaveProperty('nuevaPassword')
        console.log(res.body.error)
    })

    test('Falta email!', async () => {
        const user = {
            email: '',
            pregunta: 'resident evil favorito?',
            respuesta: 'resident evil 4'
        }

        const res = await api
            .post('/user/recuperar-password')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Falta email!')
    })
})
afterAll(async () => {
    await mongoose.connection.close()
})
