const app = require('./app')
//const { PORT } = require('./utils/config')
const logger = require('./utils/loggers')
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
    logger.info(`Escuchando puerto: ${PORT}`)
})