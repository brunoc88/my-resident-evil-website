const app = require('../../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../../models/user')
const { getUsers, upLoadUsers } = require('../test_helper')

let api = supertest(app)

let token = null
let token2 = null
let users = null
let yo = null
let userToFollow = null

beforeEach(async () => {
    await User.deleteMany({})

    await upLoadUsers()
    users = await getUsers()
    const res = await api.post('/').send({ user: users[0].userName, password: 'sekret' })
    const res2 = await api.post('/').send({ user: users[1].userName, password: 'sekret' })

    yo = await User.findById(res.body.user.id)
    userToFollow = await User.findById(res2.body.user.id)
    token = res.body.token
    token2 = res2.body.token // token userToFollow
})

describe('PATCH /user/seguir/:id', () => {
    test('Seguir un usuario', async () => {
        
        misSeguidos = await User.findById(yo.id)
        let misSeguidosAntes = misSeguidos.seguidos.length
        // id del usuario a seguir
        let id = userToFollow.id
        const res = await api
            .patch(`/user/seguir/${id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        misSeguidos = await User.findById(yo.id)
        let misSeguidosDespues = misSeguidos.seguidos.length

        expect(res.body).toBeTruthy()
        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain(`Ahora sigues a ${userToFollow.userName}`)
        expect(misSeguidosDespues).toBe(misSeguidosAntes + 1)
    })

    test('Usuario Bloqueado intenta seguirme', async () => {

        // bloqueo al usuario que me quiere seguir
        await api.post(`/user/bloquear/${userToFollow.id}`).set('Authorization', `Bearer ${token}`)

        // luego ese usuario me intenta seguir
        await api
            .patch(`/user/seguir/${yo.id}`)
            .set('Authorization', `Bearer ${token2}`)
            .expect(403)
            .expect('Content-Type', /application\/json/)
    })
    
})

describe('PATCH /user/dejarDeSeguir/:id', () => {
    test('Dejar de seguir un usuario', async () => {

        // sigo a un usuario
        await api.patch(`/user/seguir/${userToFollow.id}`).set('Authorization', `Bearer ${token}`)

        // ahora dejo de seguirlo
        const res = await api
        .patch(`/user/dejarDeSeguir/${userToFollow.id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain(`Ya no sigues a ${userToFollow.userName}`)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})
