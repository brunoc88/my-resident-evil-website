const express = require('express')
const app = express()
const { MONGODB_URI } = require('./utils/config')
const logger = require('./utils/loggers')
const path = require('path')
const mongoose = require('mongoose')
const morgan = require('morgan')
const errorHandler = require('./middlewares/errorHandler')
const unknownEndpoint = require('./middlewares/unknowEndpoint')
const userRouter = require('./router/user')


// conectando a la DB
mongoose.set('strictQuery', false)

logger.info('Conectando a Base de datos: ', MONGODB_URI)

mongoose.connect(MONGODB_URI)
    .then(() => {
        logger.info('Conexion a Base de datos exitosa!')
    })
    .catch((error) => {
        logger.error('Error al conectar a Base de datos: ', error.message)
    })

// middlewares
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))
app.use(express.json())

// Solo usar morgan en desarrollo
if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'))
}

app.use('/user', userRouter)

app.use(unknownEndpoint)
app.use(errorHandler)


module.exports = app