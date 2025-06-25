const User = require('../models/user')

const getUsers = async () => {
  const users = await User.find({})
  return users.map((user) => user.toJSON())
}

module.exports = {
  getUsers
}