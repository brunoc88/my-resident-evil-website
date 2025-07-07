const app = require('../../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const path = require('path') // Necesario para ruta a la imagen
const fs = require('fs')
const uploadDir = path.join(__dirname, '../../public/uploads')
const User = require('../../models/user')
const Personaje = require('../../models/personaje')
const Denuncia = require('../../models/denuncias')
const { upLoadUsers, getUsers } = require('../test_helper')

const api = supertest(app)

let tokenAdmin = null
let tokenUser = null

beforeEach(async () => {
    await User.deleteMany({})
    await Denuncia.deleteMany({})
    await upLoadUsers()
    const users = await getUsers()

    // Login admin
    const resAdmin = await api.post('/').send({ user: users[0].userName, password: 'sekret' })
    tokenAdmin = resAdmin.body.token

    // Login user comun
    const resUser = await api.post('/').send({ user: users[1].userName, password: 'sekret' })
    tokenUser = resUser.body.token

    //creamos personaje para denunciar
    await api
        .post('/personaje/alta')
        .set('Authorization', `Bearer ${tokenAdmin}`)
        .field('nombre', 'Jill Valentine')
        .field('fechaNacimiento', '1974-02-03')
        .field('edad', '29')
        .field('colorOjos', 'verde')
        .field('colorPelo', 'rubio')
        .field('altura', 170)
        .field('peso', 56)
        .field('categoria', 'héroe')
        .field('oficio', 'miembro de S.T.A.R.S.')
        .field('condicion', 'vivo')
        .field('primeraAparicion', 'Resident Evil')
        .field('ultimaAparicion', 'Resident Evil 3 Remake')
        .field('biografia', 'Miembro clave en la lucha contra Umbrella.')
        .attach('picture', path.join(__dirname, 'fixtures', 'test-imagen.png'))
})

describe('Denuncias', () => {
    test('Crear una denuncia válida', async () => {
        const users = await getUsers()

        const denuncia = {
            tipo: 'User',
            id: users[3].id,
            motivo: 'Comportamiento inadecuado',
            mensaje: 'El usuario me insultó en un mensaje.'
        }

        const res = await api
            .post('/denuncias')
            .send(denuncia)
            .set('Authorization', `Bearer ${tokenUser}`)
            .expect(201)

        expect(res.body.msj).toBe('Denuncia enviada correctamente')
    })

    test('Falla si falta un campo obligatorio', async () => {
        const res = await api
            .post('/denuncias')
            .send({ tipo: 'User', motivo: 'Mal uso' }) // falta id y mensaje
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .expect(400)

        expect(res.body).toHaveProperty('error')
    })

    test('Obtener todas las denuncias', async () => {
        // Primero crear una denuncia
        const users = await getUsers()
        await api.post('/denuncias').send({
            tipo: 'User',
            id: users[3].id,
            motivo: 'Motivo de prueba',
            mensaje: 'Descripción larga de la denuncia.'
        }).set('Authorization', `Bearer ${tokenAdmin}`)

        const res = await api
            .get('/denuncias')
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .expect(200)

        expect(res.body.denuncias).toHaveLength(1)
        expect(res.body.denuncias[0].denunciante).toHaveProperty('userName')
    })

    test('Detalle de una denuncia', async () => {
        const users = await getUsers()

        const crear = await api.post('/denuncias').send({
            tipo: 'User',
            id: users[3].id,
            motivo: 'Motivo test',
            mensaje: 'Mensaje test'
        }).set('Authorization', `Bearer ${tokenAdmin}`)

        // Validar que realmente se creó la denuncia
        expect(crear.status).toBe(201)

        const todas = await api.get('/denuncias').set('Authorization', `Bearer ${tokenAdmin}`)

        expect(todas.body.denuncias.length).toBeGreaterThan(0) // <= aseguremos que hay algo

        const denunciaId = todas.body.denuncias[0]._id

        const res = await api
            .get(`/denuncias/${denunciaId}`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .expect(200)

        expect(res.body.denuncia).toHaveProperty('motivo', 'Motivo test')
    })

    test('Marcar denuncia como resuelta', async () => {
        const users = await getUsers()
        await api.post('/denuncias').send({
            tipo: 'User',
            id: users[3].id,
            motivo: 'Motivo test',
            mensaje: 'Mensaje test'
        }).set('Authorization', `Bearer ${tokenAdmin}`)

        const todas = await api.get('/denuncias').set('Authorization', `Bearer ${tokenAdmin}`)
        const denunciaId = todas.body.denuncias[0]._id

        const res = await api
            .patch(`/denuncias/${denunciaId}/resolver`)
            .set('Authorization', `Bearer ${tokenAdmin}`)
            .expect(200)

        expect(res.body.msj).toBe('Denuncia marcada como resuelta')

        const actualizada = await Denuncia.findById(denunciaId)
        expect(actualizada.estado).toBe(false)
    })

    test('Crear denuncia contra un personaje', async () => {
        const personajes = await Personaje.find()
        const personajeId = personajes[0]._id

        const denuncia = {
            tipo: 'Personaje',
            id: personajeId,
            motivo: 'Información incorrecta',
            mensaje: 'La edad del personaje no es la correcta en esta entrega.'
        }

        const res = await api
            .post('/denuncias')
            .send(denuncia)
            .set('Authorization', `Bearer ${tokenUser}`)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('msj', 'Denuncia enviada correctamente')
    })
})

afterEach(() => {
    // Limpias la carpeta uploads para que no acumule imágenes de tests
    fs.readdirSync(uploadDir).forEach(file => {
        if (file !== 'default.png') {
            fs.unlinkSync(path.join(uploadDir, file))
        }
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})
