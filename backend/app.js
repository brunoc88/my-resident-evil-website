const express = require('express')
const app = express()
const cors = require('cors')
const { MONGODB_URI } = require('./utils/config')
const logger = require('./utils/loggers')
const path = require('path')
const mongoose = require('mongoose')
const morgan = require('morgan')
const errorHandler = require('./middlewares/errorHandler')
const unknownEndpoint = require('./middlewares/unknowEndpoint')
const { tokenExtractor } = require('./middlewares/authMiddleware')
const loginRouter = require('./router/login')
const userRouter = require('./router/user')
const personajeRouter = require('./router/personaje')
const denunciasRouter = require('./router/denuncias')

// conectando a la DB
mongoose.set('strictQuery', false)

logger.info('Conectando a Base de datos')

mongoose.connect(MONGODB_URI)
    .then(() => {
        logger.info('Conexion a Base de datos exitosa!')
    })
    .catch((error) => {
        logger.error('Error al conectar a Base de datos: ', error.message)
    })

// middlewares
app.use(express.static(path.join(__dirname, 'dist')))
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')))
app.use(cors())
app.use(express.json())
app.use(tokenExtractor)

// Solo usar morgan en desarrollo
if (process.env.NODE_ENV === 'dev') {
    app.use(morgan('dev'))
}

app.use('/', loginRouter)
app.use('/user', userRouter)
app.use('/personaje', personajeRouter)
app.use('/denuncias', denunciasRouter)


app.use(unknownEndpoint)
app.use(errorHandler)


module.exports = app