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

describe('POST /user/mensaje/:id', () => {
    test('Mandar un mensaje', async () => {
        const users = await getUsers()
        const id = users[1].id

        const msj = {
            mensaje: 'Hola, me llamo Bruno!',
            replyTo: null
        }
        const res = await api
            .post(`/user/mensaje/${id}`)
            .send(msj)
            .set('Authorization', `Bearer ${token}`)//token usuario 0
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain('Mensaje Enviado!')

    })

    test('Mensaje Vacio', async () => {
        const users = await getUsers()
        const id = users[1].id

        const msj = {
            mensaje: '',
            replyTo: null
        }
        const res = await api
            .post(`/user/mensaje/${id}`)
            .send(msj)
            .set('Authorization', `Bearer ${token2}`)//token usuario 0
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('¡Mensaje vacio!')

    })

    test('Responder un mensaje', async () => {
        //Mando un mensaje del user 0 al user 1
        const users = await getUsers()
        const id = users[0].id
        const id1 = users[1].id

        const msj = {
            mensaje: 'Hola, me llamo Bruno!',
            replyTo: null
        }
        await api.post(`/user/mensaje/${id1}`).send(msj).set('Authorization', `Bearer ${token}`)

        //el usuario 1 responde
        const msjRes = {
            mensaje: 'Hola, mucho gusto!',
            replyTo: null
        }
        const res = await api.post(`/user/mensaje/${id}`)
            .send(msjRes)
            .set('Authorization', `Bearer ${token2}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain('Mensaje Enviado!')
    })
})

describe('PATCH /user/mensaje/:id', () => {
    test.only('Eliminar un mensaje', async () => {
        const users = await getUsers()
        const idReceptor = users[1].id

        const msj = { mensaje: 'Hola, me llamo Bruno!', replyTo: null }

        const res = await api
            .post(`/user/mensaje/${idReceptor}`)
            .send(msj)
            .set('Authorization', `Bearer ${token}`)
        console.log('POST:', res.status, res.body)
        const mensajeId = res.body.mensajeId

        const usuarioReceptor = await User.findById(idReceptor)
        console.log('Mensajes receptor:', usuarioReceptor.mensajes.map(m => m._id.toString()))

        // LOG antes del PATCH
        console.log('PATCH URL:', `/user/mensaje/${mensajeId}`)
        console.log('Authorization:', token2)

        const res2 = await api
            .patch(`/user/mensaje/${mensajeId}`)
            .set('Authorization', `Bearer ${token2}`)

        console.log('PATCH response:', res2.status, res2.body)

        expect(res2.status).toBe(200)
        expect(res2.body).toHaveProperty('msj')
        expect(res2.body.msj).toContain('Mensaje eliminado!')
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})