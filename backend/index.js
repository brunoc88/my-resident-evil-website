const app = require('./app')
const { PORT } = require('./utils/config')
const logger = require('./utils/loggers')

app.listen(PORT, () => {
    logger.info(`Escuchando puerto: ${PORT}`)
})