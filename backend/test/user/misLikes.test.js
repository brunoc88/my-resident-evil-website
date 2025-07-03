const app = require('../../app')
const mongoose = require('mongoose')
const supertest = require('supertest')
const User = require('../../models/user')
const { getUsers, upLoadUsers } = require('../test_helper')

const api = supertest(app)

let token = null

beforeEach(async () => {
    await User.deleteMany({})

    await upLoadUsers()

    const users = await getUsers()
    const user = users[0]

    const res = await api.post('/').send({ user: user.userName, password: 'sekret' })

    token = res.body.token

})

describe('GET /user/allLikes', () => {
    test.only('Mis likes a personajes', async () => {
        await api
            .get('/user/allLikes')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})