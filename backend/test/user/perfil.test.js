const app = require('../../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const User = require('../../models/user')
const { getUsers } = require('../test_helper')

const api = supertest(app)

let token = null

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

    const res = await api.post('/').send({ user: 'bruno88', password: 'sekret' })
    token = res.body.token
})

describe('GET /user/perfil/:userName', () => {
    test('Obtener un perfil', async () => {
        const users = await getUsers()
        const userName = users[0].userName

        const res = await api
            .get(`/user/perfil/${userName}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toBeTruthy()
        expect(res.body).toHaveProperty('user')
    })

    test('Usuario no encontrado o cuenta eliminada', async () => {
        const res = await api
            .get('/user/perfil/usuarioInexistente123')
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Usuario no encontrado o cuenta eliminada')
    })


    test('Usuario no encontrado o cuenta eliminada p2', async () => {
        //creo usuario con estado falso
        const passwordHash = await bcrypt.hash('sekret', 10)
        const user = new User({
            userName: 'mari88',
            email: 'mari88@gmail.com',
            rol: 'admin',
            sobreMi: 'amo resident evil!',
            password: passwordHash,
            pregunta: 'Resident Evil Favorito?',
            respuesta: 'Resident Evil 2',
            estado: false
        })

        await user.save()

        const users = await getUsers()
        const userName = users[1].userName

        const res = await api
            .get(`/user/perfil/${userName}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Usuario no encontrado o cuenta eliminada')
    })
})

describe('GET /user/miPerfil', () => {
    test('Ver Mi perfil', async() => {

        const res = await api
            .get('/user/miPerfil')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toBeTruthy()
        expect(res.body).toHaveProperty('user')

    })
})

afterAll(async () => {
    await mongoose.connection.close()
})