const app = require('../../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const path = require('path') // Necesario para ruta a la imagen
const fs = require('fs')
const uploadDir = path.join(__dirname, '../../public/uploads')
const Personaje = require('../../models/personaje')
const User = require('../../models/user')
const { upLoadUsers, getUsers, getPersonajes } = require('../test_helper')

const api = supertest(app)

let token = null
let token2 = null

beforeEach(async () => {
    await Personaje.deleteMany({})
    await User.deleteMany({})
    await upLoadUsers()
    const users = await getUsers()

    const res = await api.post('/').send({ user: users[0].userName, password: 'sekret' })
    const res2 = await api.post('/').send({ user: users[1].userName, password: 'sekret' })
    token = res.body.token
    token2 = res2.body.token

    //creo un personaje
    await api
        .post('/personaje/alta')
        .set('Authorization', `Bearer ${token}`)
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

describe('POST /personaje/:id/comentario', () => {
    test('Hacer un comentario', async () => {
        //busco el id del personaje
        const personajes = await getPersonajes()
        const id = personajes[0].id

        const comentario = {
            mensaje: 'Gracias por subir la biografia!'
        }
        const res = await api
            .post(`/personaje/${id}/comentario`)
            .set('Authorization', `Bearer ${token}`)
            .send(comentario)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toBeTruthy()
        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain('Comentario agregado')
        expect(res.body).toHaveProperty('comentario')
        //checkeamos el populate
        expect(res.body.comentario).toHaveProperty('mensaje', comentario.mensaje)
        expect(res.body.comentario).toHaveProperty('usuario')
        expect(res.body.comentario.usuario).toHaveProperty('userName')

    })

    test('¡Escriba un comentario!', async () => {
        //busco el id del personaje
        const personajes = await getPersonajes()
        const id = personajes[0].id

        const comentario = {
            mensaje: '    '
        }
        const res = await api
            .post(`/personaje/${id}/comentario`)
            .set('Authorization', `Bearer ${token}`)
            .send(comentario)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toBeTruthy()
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('¡Escriba un comentario!')
    })

    test('No permite comentarios que superen los 280 caracteres', async () => {
        const personajes = await getPersonajes()
        const id = personajes[0].id

        const comentarioLargo = {
            mensaje: 'Estuve revisando el trabajo realizado en este personaje y realmente me sorprendió la profundidad con la que se desarrolló su historia. Desde la primera aparición hasta los últimos acontecimientos, se nota el esfuerzo y la dedicación puesta en cada detalle de su evolución. ¡Excelente labor!'
        }
        console.log('Largo del mensaje:', comentarioLargo.mensaje.length)

        const res = await api
            .post(`/personaje/${id}/comentario`)
            .set('Authorization', `Bearer ${token}`)
            .send(comentarioLargo)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('El comentario pasó el límite de caracteres permitido!')
    })
})

describe('PUT /personaje/:id/editarComentario/:idComentario', () => {
  test('Comentario actualizado', async () => {
    // Busco el id del personaje
    const personajes = await getPersonajes()
    const id = personajes[0].id

    // Hago un comentario
    const comentario = {
      mensaje: 'Gracias por subir la biografia!'
    }
    const res = await api
      .post(`/personaje/${id}/comentario`)
      .set('Authorization', `Bearer ${token}`)
      .send(comentario)
      .expect(201)

    // Busco el id del comentario
    const idNuevoComentario = res.body.comentario._id.toString()

    // Ahora lo voy a editar
    const nuevoComentario = {
      mensaje: 'Muy bueno!'
    }
    const res2 = await api
      .put(`/personaje/${id}/editarComentario/${idNuevoComentario}`)
      .set('Authorization', `Bearer ${token}`)
      .send(nuevoComentario)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(res2.body).toBeTruthy()
    expect(res2.body).toHaveProperty('msj')
    expect(res2.body.msj).toContain('Comentario actualizado')
    expect(res2.body).toHaveProperty('comentario')
    expect(res2.body.comentario).toHaveProperty('mensaje', nuevoComentario.mensaje)
  })

  test('No hay cambios', async () => {
    // Busco el id del personaje
    const personajes = await getPersonajes()
    const id = personajes[0].id

    // Hago un comentario
    const comentario = {
      mensaje: 'Gracias por subir la biografia!'
    }
    const res = await api
      .post(`/personaje/${id}/comentario`)
      .set('Authorization', `Bearer ${token}`)
      .send(comentario)
      .expect(201)

    // Busco el id del comentario
    const idNuevoComentario = res.body.comentario._id.toString()

    // Ahora lo voy a editar
    const nuevoComentario = {
      mensaje: 'Gracias por subir la biografia!'
    }
    const res2 = await api
      .put(`/personaje/${id}/editarComentario/${idNuevoComentario}`)
      .set('Authorization', `Bearer ${token}`)
      .send(nuevoComentario)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(res2.body).toBeTruthy()
    expect(res2.body).toHaveProperty('error')
    expect(res2.body.error).toContain('No hay cambios')

  })

  test('Acceso prohibido!', async () => {
    // Busco el id del personaje
    const personajes = await getPersonajes()
    const id = personajes[0].id

    // Hago un comentario
    const comentario = {
      mensaje: 'Gracias por subir la biografia!'
    }
    const res = await api
      .post(`/personaje/${id}/comentario`)
      .set('Authorization', `Bearer ${token2}`)
      .send(comentario)
      .expect(201)

    // Busco el id del comentario
    const idNuevoComentario = res.body.comentario._id.toString()

    // Ahora lo voy a editar
    const nuevoComentario = {
      mensaje: 'Gracias'
    }
    const res2 = await api
      .put(`/personaje/${id}/editarComentario/${idNuevoComentario}`)
      .set('Authorization', `Bearer ${token}`)
      .send(nuevoComentario)
      .expect(404)
      .expect('Content-Type', /application\/json/)

    expect(res2.body).toBeTruthy()
    expect(res2.body).toHaveProperty('error')

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
