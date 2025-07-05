const app = require('../../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../../models/user')
const { getUsers, upLoadUsers } = require('../test_helper')

const api = supertest(app)

let token = null
let token2 = null
let token3 = null

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
    //logeo otro user comun
    const res3 = await api.post('/').send({ user: users[3].userName, password: 'sekret' })
    //token user admin
    token = res.body.token
    //token user comun
    token2 = res2.body.token
    //token user 3 comun
    token3 = res3.body.token
})


describe('POST /user/bloquear/:id', () => {
    test('Bloquear usuario', async () => {
        const users = await getUsers()
        const id = users[1].id

        const res = await api
            .post(`/user/bloquear/${id}`)
            .expect(200)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain(`Usuario bloqueado!`)

    })

    test('Usuario Comun intentando bloquear Usuario Admin', async () => {
        const users = await getUsers()
        const id = users[0].id

        const res = await api
            .post(`/user/bloquear/${id}`)
            .expect(403)
            .set('Authorization', `Bearer ${token2}`)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain(`No puedes bloquear a un administrador!`)

    })

    test('Bloquear usuario ya bloqueado', async () => {
        const users = await getUsers()
        const id = users[1].id

        await api
            .post(`/user/bloquear/${id}`)
            .expect(200)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /application\/json/)

        const res = await api
            .post(`/user/bloquear/${id}`)
            .expect(400)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain(`Tienes bloqueado a ${users[1].userName}`)

    })

    test('Bloquear usuario que me tiene bloqueado', async () => {
        const users = await getUsers()
        const yo = users[1].id
        const userAbloquear = users[3].id

        //el usuario me bloquea primero
        await api
            .post(`/user/bloquear/${yo}`)
            .expect(200)
            .set('Authorization', `Bearer ${token3}`)
            .expect('Content-Type', /application\/json/)

        // ahora yo intento bloquearlo
        const res = await api
            .post(`/user/bloquear/${userAbloquear}`)
            .expect(403)
            .set('Authorization', `Bearer ${token2}`)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain(`El usuario ${users[3].userName} no está disponible`)

    })
})

describe('DELETE /user/desbloquear/:id', () => {
    test('Desbloquear usuario', async () => {
        //bloqueo a un usuario
        const users = await getUsers()
        const id = users[1].id

        await api
            .post(`/user/bloquear/${id}`)
            .expect(200)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /application\/json/)

        //ahora lo desbloqueo
        const res = await api
            .delete(`/user/desbloquear/${id}`)
            .expect(200)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain(`Usuario desbloqueado!`)
    })
})

describe('GET /user/bloqueados', () => {
    test('Lista de bloqueados', async() => {
        const users = await getUsers()
        const id = users[0].id

        
        const res = await api
        .get(`/user/bloqueados`)
        .expect(200)
        .set('Authorization', `Bearer ${token}`)
        .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('bloqueados')
    })
})
afterAll(async () => {
    await mongoose.connection.close()
})