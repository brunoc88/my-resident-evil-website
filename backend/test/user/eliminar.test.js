const app = require('../../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
//const bcrypt = require('bcrypt')
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

describe('PATCH /user/eliminar/:id', () => {
    test('Usuario no encontrado', async () => {
        // genero un ObjectId válido que se que no está en la base
        const nonExistingId = new mongoose.Types.ObjectId()

        const res = await api
            .patch(`/user/eliminar/${nonExistingId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect('Content-Type', /application\/json/)
            .expect(404)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Usuario no encontrado')
    })

    test('La cuenta ya está inactiva', async () => {
        const users = await getUsers()
        const id = users[2].id

        const res = await api
            .patch(`/user/eliminar/${id}`)
            .set('Authorization', `Bearer ${token}`)//este el token de admin
            .expect('Content-Type', /application\/json/)
            .expect(400)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('La cuenta ya está inactiva')
    })

    test('Sin autorización!', async () => {

        const users = await getUsers()
        const id = users[0].id //id de un admin

        const res = await api
            .patch(`/user/eliminar/${id}`)
            .set('Authorization', `Bearer ${token2}`)//este el token de un user comun
            .expect('Content-Type', /application\/json/)
            .expect(403)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Sin autorización!')
    })

    test('No puedes eliminar un usuario con tu mismo rol', async () => {

        const users = await getUsers()
        const id = users[3].id //id de un admin

        const res = await api
            .patch(`/user/eliminar/${id}`)
            .set('Authorization', `Bearer ${token}`)//este el token otro admin
            .expect('Content-Type', /application\/json/)
            .expect(403)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('No puedes eliminar un usuario con tu mismo rol')
    })

    test('Cuenta eliminada!', async () => {

        const users = await getUsers()
        const id = users[0].id //id de un admin

        const res = await api
            .patch(`/user/eliminar/${id}`)
            .set('Authorization', `Bearer ${token}`)//token del admin
            .expect('Content-Type', /application\/json/)
            .expect(200)

        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain('Cuenta eliminada!')

        // Comprobar que estado es false en la base
        const userUpdated = await User.findById(id)
        expect(userUpdated.estado).toBe(false)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})