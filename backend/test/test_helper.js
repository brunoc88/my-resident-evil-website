const User = require('../models/user')
const bcrypt = require('bcrypt')

const getUsers = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

const upLoadUsers = async () => {
  const passwordHash = await bcrypt.hash('sekret', 10)
  const user1 = new User({
    userName: 'bruno88',
    email: 'brunocerutti88@gmail.com',
    rol: 'admin',
    sobreMi: 'amo resident evil!',
    password: passwordHash,
    pregunta: 'resident evil favorito?',
    respuesta: 'resident evil 2'
  })

  const user2 = new User({
    userName: 'unknow88',
    email: 'unkonw88@gmail.com',
    rol: 'comun',
    password: passwordHash,
    pregunta: 'resident evil favorito?',
    respuesta: 'resident evil 4'
  })

  const user3 = new User({
    userName: 'comunUser',
    email: 'comunuser@gmail.com',
    rol: 'comun',
    password: passwordHash,
    pregunta: 'resident evil favorito?',
    respuesta: 'resident evil 5',
    estado: false
  })

  const user4 = new User({
    userName: 'aldi22',
    email: 'aldi22@gmail.com',
    rol: 'admin',
    sobreMi: 'amo resident evil!',
    password: passwordHash,
    pregunta: 'resident evil favorito?',
    respuesta: 'resident evil 5'
  })
  await user1.save()
  await user2.save()
  await user3.save()
  await user4.save()
}

module.exports = {
  getUsers,
  upLoadUsers
}