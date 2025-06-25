require('dotenv').config()

const MONGODB_URI = process.env.NODE_ENV === 'dev'? process.env.MONGODB_URI : process.env.MONGODB_URI_TEST

const PORT = process.env.PORT

const SECRET = process.env.SECRET

const CLAVE_SECRETA_ADMIN = process.env.CLAVE_SECRETA_ADMIN

module.exports = {
    MONGODB_URI,
    PORT,
    SECRET,
    CLAVE_SECRETA_ADMIN
}