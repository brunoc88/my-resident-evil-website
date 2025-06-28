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

    //subo los usuario a la DB Test
    await upLoadUsers()
    //obtengo los users
    const users = await getUsers()
    //logeo al admin
    const res = await api.post('/').send({ user: users[0].userName, password: 'sekret' })
    //logeo al user Comun
    const res2 = await api.post('/').send({ user: users[1].userName, password: 'sekret' })
    //token user admin
    token = res.body.token
    //token user comun
    token2 = res2.body.token
})

describe('PATCH /user/reActivar/:id', () => {
    test('Usuario no encontrado', async () => {

        const nonExistingId = new mongoose.Types.ObjectId()

        const res = await api
            .patch(`/user/reActivar/${nonExistingId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /application\/json/)
            .expect(404)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Usuario no encontrado')
    })

    test('La cuenta ya está activa', async () => {

        const users = await getUsers()
        const id = users[1].id//id user comun activo

        const res = await api
            .patch(`/user/reActivar/${id}`)
            .set('Authorization', `Bearer ${token}`)//user admin
            .expect('Content-Type', /application\/json/)
            .expect(400)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('La cuenta ya está activa')
    })

    test('Acceso denegado: permisos insuficientes', async () => {

        const users = await getUsers()
        const id = users[2].id //id user comun desactivado

        const res = await api
            .patch(`/user/reActivar/${id}`)
            .set('Authorization', `Bearer ${token2}`)//user comun
            .expect('Content-Type', /application\/json/)
            .expect(403)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Acceso denegado: permisos insuficientes')
    })

    test('Cuenta reactivada!', async () => {

        const users = await getUsers()
        const id = users[2].id //id user comun desactivado

        const res = await api
            .patch(`/user/reActivar/${id}`)
            .set('Authorization', `Bearer ${token}`)//user admin
            .expect('Content-Type', /application\/json/)
            .expect(200)

        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain('Cuenta reactivada!')
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})