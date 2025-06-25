const app = require('../../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const User = require('../../models/user')
const path = require('path') // Necesario para ruta a la imagen
const fs = require('fs')
const uploadDir = path.join(__dirname,'../../public/uploads')
const { getUsers } = require('../test_helper')

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

//validaciones de presencia & formato
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

    test.only('Creando usuario con imagen', async () => {

        const usersBefore = await getUsers()

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

        const usersAfter = await getUsers()

        expect(res.body.user.picture).not.toBe('default.png')
        expect(usersAfter).toHaveLength(usersBefore.length + 1)
    })

    test('Formulario incompleto', async () => {
        const user = {}

        const usersBefore = await getUsers()

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await getUsers()

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Formulario incompleto')
        expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('Falta el nombre de usuario', async () => {
        const user = {
            userName: '',
            email: 'aldi22@gmail.com',
            password: 'renatta',
            pregunta: 'Resident Evil Favorito?',
            respuesta: 'Resident Evil 5'
        }

        const usersBefore = await getUsers()

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await getUsers()

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Falta el nombre de usuario')
        expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('Falta el email', async () => {
        const user = {
            userName: 'aldi22',
            email: '',
            password: 'renatta',
            pregunta: 'Resident Evil Favorito?',
            respuesta: 'Resident Evil 5'
        }

        const usersBefore = await getUsers()

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await getUsers()

        expect(res.body).toHaveProperty('data')
        expect(res.body.data.email).toBe('')
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Falta el email')
        expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('Falta la contraseña', async () => {
        const user = {
            userName: 'aldi22',
            email: 'aldi22@gmail.com',
            password: '',
            pregunta: 'Resident Evil Favorito?',
            respuesta: 'Resident Evil 5'
        }

        const usersBefore = await getUsers()

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await getUsers()

        expect(res.body.data.password).toBe('')
        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Falta la contraseña')
        expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('Nombre de usuario menor a 5 caracteres', async () => {
        const user = {
            userName: 'aldi',
            email: 'aldi22@gmail.com',
            password: 'renatta',
            pregunta: 'Resident Evil Favorito?',
            respuesta: 'Resident Evil 5'
        }

        const usersBefore = await getUsers()

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await getUsers()

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('El nombre de usuario debe tener entre 5 y 10 caracteres')
        expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('Nombre de usuario mayor a 10 caracteres', async () => {
        const user = {
            userName: 'aldi1234567',
            email: 'aldi22@gmail.com',
            password: 'renatta',
            pregunta: 'Resident Evil Favorito?',
            respuesta: 'Resident Evil 5'
        }

        const usersBefore = await getUsers()

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await getUsers()

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('El nombre de usuario debe tener entre 5 y 10 caracteres')
        expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('Mandar nombre de usuario con solo espacio', async () => {
        const user = {
            userName: '     ',
            email: 'aldi22@gmail.com',
            password: 'renatta',
            pregunta: 'Resident Evil Favorito?',
            respuesta: 'Resident Evil 5'
        }

        const usersBefore = await getUsers()

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await getUsers()

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Falta el nombre de usuario')
        expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('El nombre de usuario no debe contener espacios', async () => {
        const user = {
            userName: 'aldi 22',
            email: 'aldi22@gmail.com',
            password: 'renatta',
            pregunta: 'Resident Evil Favorito?',
            respuesta: 'Resident Evil 5'
        }

        const usersBefore = await getUsers()

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await getUsers()

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('El nombre de usuario no debe contener espacios')
        expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('Mandar email con solo espacio', async () => {
        const user = {
            userName: 'aldi22',
            email: '      ',
            password: 'renatta',
            pregunta: 'Resident Evil Favorito?',
            respuesta: 'Resident Evil 5'
        }

        const usersBefore = await getUsers()

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await getUsers()

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Falta el email')
        expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('El email no debe contener espacios', async () => {
        const user = {
            userName: 'aldi22',
            email: 'aldi 22@gmail.com',
            password: 'renatta',
            pregunta: 'Resident Evil Favorito?',
            respuesta: 'Resident Evil 5'
        }

        const usersBefore = await getUsers()

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        const usersAfter = await getUsers()

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('El email no debe contener espacios')
        expect(usersAfter).toHaveLength(usersBefore.length)
    })

    test('El email no tiene un formato válido', async () => {
        const user = {
            userName: 'bruno123',
            email: 'usuario.com', // inválido
            password: 'pass123',
            pregunta: 'RE favorito?',
            respuesta: 'RE4'
        }

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('El email no tiene un formato válido')
    })

    test('Mandar password con espacios', async () => {
        const user = {
            userName: 'bruno123',
            email: 'bruno@gmail.com',
            password: '    ',
            pregunta: 'RE favorito?',
            respuesta: 'RE4'
        }

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('Falta la contraseña')
    })

    test('La contraseña debe tener al menos 5 caracteres', async () => {
        const user = {
            userName: 'bruno123',
            email: 'bruno@gmail.com',
            password: '1234',
            pregunta: 'RE favorito?',
            respuesta: 'RE4'
        }

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain('La contraseña debe tener al menos 5 caracteres')
    })
})

//validaciones de duplicado
describe('POST /user/registro', () => {
    test('Duplicado de userName', async () => {
        const user = {
            userName: 'bruno88', // Ya existente por el beforeEach
            email: 'otro@email.com',
            password: '123456',
            pregunta: 'Resident Evil Favorito?',
            respuesta: 'RE2'
        }

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body.error).toContain("El userName 'bruno88' ya está registrado")
        expect(res.body.error).toContain(`El userName '${user.userName}' ya está registrado`)
    })

    test('Duplicado de email', async () => {
        const user = {
            userName: 'jorge60', 
            email: 'brunocerutti88@gmail.com',// Ya existente por el beforeEach
            password: '123456',
            pregunta: 'Resident Evil Favorito?',
            respuesta: 'RE2'
        }

        const res = await api
            .post('/user/registro')
            .send(user)
            .expect(400)
            .expect('Content-Type', /application\/json/)

        expect(res.body).toHaveProperty('error')
        expect(res.body).toHaveProperty('data')
        expect(res.body.error).toContain("El email 'brunocerutti88@gmail.com' ya está registrado")
        expect(res.body.error).toContain(`El email '${user.email}' ya está registrado`)
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
