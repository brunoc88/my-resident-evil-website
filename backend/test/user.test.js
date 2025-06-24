const app = require('../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const User = require('../models/user')
const path = require('path') // Necesario para ruta a la imagen
const fs = require('fs')
const uploadDir = path.join(__dirname, '../public/uploads')
const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
        userName: 'bruno88',
        email: 'brunocerutti88@gmail.com',
        rol: 'admin',
        password: passwordHash,
        pregunta: 'Resident Evil Favorito?',
        respuesta: 'Resident Evil 2'
    })

    await user.save()
})

//user comunes
describe('POST /user/registro', () => {
    test('Creando usuario sin imagen', async () => {
        const user = {
            userName: 'aldi22',
            email: 'aldi22@gmail.com',
            password: 'renatta',
            pregunta: 'Resident Evil Favorito?',
            respuesta: 'Resident Evil 5'
        }

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('msj')
        expect(res.body.msj).toContain('Usuario creado con éxito')
        expect(res.body).toHaveProperty('user')
        expect(res.body.user.userName).toBe('aldi22')
        expect(res.body.user).toMatchObject({
            userName: 'aldi22',
            email: 'aldi22@gmail.com',
            rol: 'comun'
        })

    })

    test('Creando usuario con imagen', async () => {
        const res = await api
            .post('/user/registro')
            .field('userName', 'usuarioImg')
            .field('email', 'imguser@example.com')
            .field('password', 'miPassword123')
            .field('pregunta', 'Resident Evil Favorito?')
            .field('respuesta', 'RE3 Nemesis')
            .attach('picture', path.join(__dirname, 'fixtures', 'test-imagen.png')) // nombre del campo debe coincidir con el de multer
            .expect(201)
            .expect('Content-Type', /application\/json/)

        expect(res.body.user.picture).not.toBe('default.png')
        
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
