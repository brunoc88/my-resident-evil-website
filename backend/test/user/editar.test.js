const app = require('../../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../../models/user')
const { getUsers, upLoadUsers } = require('../test_helper')

const api = supertest(app)

let token = null
let token2 = null

beforeEach(async () => {
    await User.deleteMany({})

    await upLoadUsers()

    const users = await getUsers()
    const user = users[0]
    const user2 = users[3]

    const res = await api.post('/').send({ user: user.userName, password: 'sekret' })
    const res2 = await api.post('/').send({ user: user2.userName, password: 'sekret' })

    token = res.body.token
    token2 = res2.body.token

    //console.log('User activo:', user.userName, 'Token:', token)
    //console.log('User inactivo:', user2.userName, 'Token:', token2)
})

describe('PUT /user/editar/:id', () => {
    test('Usuario no encontrado', async () => {
        // genero un ObjectId válido que se que no está en la base
        const nonExistingId = new mongoose.Types.ObjectId()

        const user = {
            email: 'bruno88@gmail.com'
        }

        const res = await api
            .put(`/user/editar/${nonExistingId}`)
            .send(user)
            .expect(404)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Usuario no encontrado')

    })

    test('Usuario inactivo o eliminado', async () => {
        const users = await getUsers()
        const id = users[2].id //user estado false

        const user = {
            email: 'bruno88@gmail.com'
        }

        const res = await api
            .put(`/user/editar/${id}`)
            .send(user)
            .expect(403)
            .set('Authorization', `Bearer ${token}`) //token de otro user
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Usuario inactivo o eliminado')

    })

    test('No tienes permiso!', async () => {
        const users = await getUsers()
        const id = users[3].id //user diferente

        const user = {
            email: 'bruno88@gmail.com'
        }

        const res = await api
            .put(`/user/editar/${id}`)
            .send(user)
            .expect(403)
            .set('Authorization', `Bearer ${token}`) //token de otro user
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('No tienes permiso!')

    })

    test('No hay cambios!', async () => {
        const users = await getUsers()
        const id = users[0].id //user id

        const user = {
            userName: 'bruno88',
            email: 'brunocerutti88@gmail.com',
            sobreMi: 'amo resident evil!',
            password: 'sekret',
            pregunta: 'resident evil favorito?',
            respuesta: 'resident evil 2'
        }

        const res = await api
            .put(`/user/editar/${id}`)
            .send(user)
            .expect(400)
            .set('Authorization', `Bearer ${token}`) //token del mismo usuario
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body).toHaveProperty('data')
        expect(res.body.error).toContain('No hay cambios!')

    })

    test('Falta el nombre de usuario', async () => {
        const users = await getUsers()
        const id = users[0].id //user id

        const user = {
            userName: ' ',
            email: ' '
        }

        const res = await api
            .put(`/user/editar/${id}`)
            .send(user)
            .expect(400)
            .set('Authorization', `Bearer ${token}`) //token del mismo usuario
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Falta el nombre de usuario')

    })
})

afterAll(async () => {
    await mongoose.connection.close()
})