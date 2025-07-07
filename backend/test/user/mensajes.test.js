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
    //logeo un tercer user
    const res3 = await api.post('/').send({ user: users[3].userName, password: 'sekret' })

    //token user admin
    token = res.body.token
    //token user comun
    token2 = res2.body.token
    //token user 3
    token3 = res3.body.token


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

        const users = await getUsers()
        const idEmisor = users[0].id
        const idReceptor = users[1].id

        console.log(await User.findById(idEmisor))
        console.log(await User.findById(idReceptor))

        // Paso 1: El usuario 0 envía mensaje a usuario 1
        const msj = {
            mensaje: 'Hola, me llamo Bruno!',
            replyTo: null
        }

        const res1 = await api
            .post(`/user/mensaje/${idReceptor}`)
            .send(msj)
            .set('Authorization', `Bearer ${token}`)

        const mensajeId = res1.body.mensajeId // ✅ este es el ID del mensaje original

        // Paso 2: Usuario 1 responde al mensaje recibido
        const msjRes = {
            mensaje: 'Hola, mucho gusto!',
            replyTo: mensajeId // ✅ ahora sí está respondiendo al mensaje
        }

        const res2 = await api
            .post(`/user/mensaje/${idEmisor}`)
            .send(msjRes)
            .set('Authorization', `Bearer ${token2}`) // Usuario 1 responde al Usuario 0
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(res2.body).toHaveProperty('msj')
        expect(res2.body.msj).toContain('Mensaje Enviado!')
    })

    test('Mensaje a un usuario que me bloqueo', async () => {
        const users = await getUsers()
        const emisor = users[1].id //usuario comun
        const receptor = users[0].id //usuario admin

        // el receptor me bloquea
        await api.post(`/user/bloquear/${emisor}`).expect(200).set('Authorization', `Bearer ${token}`)

        // le mando un msj
        const msj = {
            mensaje: 'Desbloqueame!',
            replyTo: null
        }
        const res = await api
            .post(`/user/mensaje/${receptor}`)
            .send(msj)
            .set('Authorization', `Bearer ${token2}`)
            .expect(403)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe(`El usuario ${users[0].userName} no está disponible`)

    })

    test('Mensaje a un usuario que yo bloquie', async () => {
        const users = await getUsers()
        const emisor = users[0].id //usuario admin
        const receptor = users[1].id //usuario comun

        // el emisor bloquea al receptor
        await api.post(`/user/bloquear/${receptor}`).expect(200).set('Authorization', `Bearer ${token}`)

        // le mando un msj
        const msj = {
            mensaje: 'No quiero!',
            replyTo: null
        }

        const res = await api
            .post(`/user/mensaje/${receptor}`)
            .send(msj)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toBe(`Tienes bloqueado a ${users[1].userName}`)
    })

    test('Hilo de conversación entre dos usuarios', async () => {
        const users = await getUsers()
        const idA = users[0].id // admin
        const idB = users[1].id // comun

        // Paso 1: A envía mensaje a B
        const res1 = await api.post(`/user/mensaje/${idB}`)
            .send({ mensaje: 'Hola, soy A!', replyTo: null })
            .set('Authorization', `Bearer ${token}`)
            .expect(201)

        const mensajeAId = res1.body.mensajeId

        // Paso 2: B responde a A
        const res2 = await api.post(`/user/mensaje/${idA}`)
            .send({ mensaje: 'Hola A, soy B!', replyTo: mensajeAId })
            .set('Authorization', `Bearer ${token2}`)
            .expect(201)

        const mensajeBId = res2.body.mensajeId

        // Paso 3: A responde a B
        const res3 = await api.post(`/user/mensaje/${idB}`)
            .send({ mensaje: '¡Qué bueno, B!', replyTo: mensajeBId })
            .set('Authorization', `Bearer ${token}`)
            .expect(201)

        const mensajeFinal = res3.body.mensajeId

        // Verificar que se hayan generado los mensajes correctamente
        const receptor = await User.findById(idB)

        // El último mensaje en la lista del receptor debería ser el de A
        const ultimoMensaje = receptor.mensajes.find(m => m._id.toString() === mensajeFinal)

        expect(ultimoMensaje).toBeDefined()
        expect(ultimoMensaje.mensaje).toBe('¡Qué bueno, B!')
        expect(ultimoMensaje.replyTo.toString()).toBe(mensajeBId)
    })

})

describe('PATCH /user/mensaje/:id', () => {
    test('Eliminar un mensaje', async () => {
        const users = await getUsers()
        const idReceptor = users[1].id

        const msj = { mensaje: 'Hola, me llamo Bruno!', replyTo: null }

        const res = await api
            .post(`/user/mensaje/${idReceptor}`)
            .send(msj)
            .set('Authorization', `Bearer ${token}`)

        const mensajeId = res.body.mensajeId


        const res2 = await api
            .patch(`/user/mensaje/${mensajeId}`)
            .set('Authorization', `Bearer ${token2}`)

        console.log('PATCH response:', res2.status, res2.body)

        expect(res2.status).toBe(200)
        expect(res2.body).toHaveProperty('msj')
        expect(res2.body.msj).toContain('Mensaje eliminado!')
    })
})

describe('GET /user/mensajes/chat/:id', () => {
    test('Obtener hilo de conversación entre dos usuarios', async () => {
        const users = await getUsers()
        const user1 = users[0] // admin
        const user2 = users[1] // comun

        // Usuario 1 (admin) envía un mensaje a usuario 2
        const res1 = await api.post(`/user/mensaje/${user2.id}`)
            .send({ mensaje: 'Hola, cómo estás?' })
            .set('Authorization', `Bearer ${token}`) // token del admin

        expect(res1.status).toBe(201)

        // Usuario 2 (comun) responde al mensaje recibido
        const res2 = await api.post(`/user/mensaje/${user1.id}`)
            .send({ mensaje: 'Todo bien! ¿y vos?', replyTo: res1.body.mensajeId })
            .set('Authorization', `Bearer ${token2}`) // token del user comun

        expect(res2.status).toBe(201)

        // Usuario 1 pide el hilo de conversación con usuario 2
        const hilo = await api.get(`/user/mensajes/chat/${user2.id}`)
            .set('Authorization', `Bearer ${token}`) // token del admin

        expect(hilo.status).toBe(200)
        expect(hilo.body).toHaveProperty('mensajes')
        expect(hilo.body.mensajes.length).toBeGreaterThanOrEqual(2)

        const mensajes = hilo.body.mensajes.map(m => m.mensaje)
        expect(mensajes).toContain('Hola, cómo estás?')
        expect(mensajes).toContain('Todo bien! ¿y vos?')
    })

})

describe('GET /user/mensajes/resumen', () => {
    test('Resumen de mensajes: muestra el último mensaje de cada emisor', async () => {
        const users = await getUsers()
        const idReceptor = users[1].id // Usuario que recibe los mensajes

        // Usuario 0 le envía dos mensajes al usuario 1
        await api.post(`/user/mensaje/${idReceptor}`)
            .send({ mensaje: 'Hola!', replyTo: null })
            .set('Authorization', `Bearer ${token}`)

        await api.post(`/user/mensaje/${idReceptor}`)
            .send({ mensaje: '¿Estás?', replyTo: null })
            .set('Authorization', `Bearer ${token}`)

        // Usuario 3 le envía un mensaje también
        await api.post(`/user/mensaje/${idReceptor}`)
            .send({ mensaje: 'Qué tal!', replyTo: null })
            .set('Authorization', `Bearer ${token3}`)

        // El usuario receptor (user[1]) pide el resumen
        const res = await api.get('/user/mensajes/resumen')
            .set('Authorization', `Bearer ${token2}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('mensajes')
        expect(Array.isArray(res.body.mensajes)).toBe(true)

        // Debería haber dos mensajes: uno del user 0 y otro del user 3
        expect(res.body.mensajes.length).toBe(2)

        const textos = res.body.mensajes.map(m => m.mensaje)
        expect(textos).toContain('¿Estás?') // último del user 0
        expect(textos).toContain('Qué tal!') // único del user 3
    })

})

afterAll(async () => {
    await mongoose.connection.close()
})