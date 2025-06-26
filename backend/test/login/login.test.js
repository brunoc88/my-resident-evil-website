const app = require('../../app')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../../models/user')

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
        userName: 'bruno88',
        email: 'brunocerutti88@gmail.com',
        rol: 'admin',
        sobreMi: 'amo resident evil!',
        password: passwordHash,
        pregunta: 'Resident Evil Favorito?',
        respuesta: 'Resident Evil 2'
    })

    await user.save()
})

describe('Login', () => {
    test('Login exitoso con userName', async () => {
        const user = {
            user: 'bruno88',
            password: 'sekret'
        }

        const res = await api
            .post('/')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toBeTruthy()// que no sea falso, que exista y contenga algo
        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain('Login exitoso')
        expect(res.body).toHaveProperty('token')
        expect(res.body).toHaveProperty('user')
    })

    test('Login exitoso con Email', async () => {
        const user = {
            user: 'brunocerutti88@gmail.com',
            password: 'sekret'
        }

        const res = await api
            .post('/')
            .send(user)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toBeTruthy()
        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain('Login exitoso')
        expect(res.body).toHaveProperty('token')
        expect(res.body).toHaveProperty('user')
    })

    test('Ingrese usuario o Email junto con un password', async () => {
        const user = {
            user: '',
            password: ''
        }

        const res = await api
            .post('/')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toBeTruthy()
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Ingrese usuario o Email junto con un password')
        expect(res.body).not.toHaveProperty('token')
        expect(res.body).not.toHaveProperty('user')
    })

    test('Ingrese su nombre de usuario o Email', async () => {
        const user = {
            user: '',
            password: 'sekret'
        }

        const res = await api
            .post('/')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toBeTruthy()
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Ingrese su nombre de usuario o Email')
    })

    test('Ingrese password', async () => {
        const user = {
            user: 'bruno88',
            password: ''
        }

        const res = await api
            .post('/')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toBeTruthy()
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Ingrese password')
    })

    test('Usuario no encontrado', async () => {
        const user = {
            user: 'jorge60',
            password: '123'
        }

        const res = await api
            .post('/')
            .send(user)
            .expect(404)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toBeTruthy()
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Usuario no encontrado')
    })

    test('Cuenta eliminada o baneada', async () => {

        // creo un usuario con estado false
        const passwordHash = await bcrypt.hash('sekret', 10)
        const falseUser = new User({
            userName: 'Mary88',
            email: 'mary@gmail.com',
            rol: 'admin',
            sobreMi: 'amo resident evil!',
            password: passwordHash,
            pregunta: 'Resident Evil Favorito?',
            respuesta: 'Resident Evil 4',
            estado: false
        })
        await falseUser.save()

        const user = {
            user: 'Mary88',
            password: 'sekret'
        }

        const res = await api
            .post('/')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toBeTruthy()
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Cuenta eliminada o baneada')
    })

    test('password incorrecto!', async () => {

        const user = {
            user: 'bruno88',
            password: '123456'
        }

        const res = await api
            .post('/')
            .send(user)
            .expect(401)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toBeTruthy()
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('password incorrecto!')
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})