const app = require('../../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcrypt')
const User = require('../../models/user')
const { getUsers } = require('../test_helper')

const api = supertest(app)

let token = null 

beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({
        userName: 'bruno88',
        email: 'brunocerutti88@gmail.com',
        rol: 'admin',
        sobreMi: 'amo resident evil!',
        password: passwordHash,
        pregunta: 'Resident Evil Favorito?',
        respuesta: 'Resident Evil 2'
    })

    await user.save()

    const res = await api.post('/').send({user:'bruno88', password:'sekret'})    
    token = res.body.token
})

describe('GET /user/perfil/:id', () => {
    test('Obtener un perfil', async() => {
        const users = await getUsers()
        const id = users[0].id

        const res = await api
        .get(`/user/perfil/${id}`)
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

        expect(res.body).toBeTruthy()
        expect(res.body).toHaveProperty('user')
    })
})



afterAll(async () => {
    await mongoose.connection.close()
})