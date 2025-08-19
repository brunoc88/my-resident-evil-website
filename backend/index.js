const app = require('./app')
const PORT = process.env.PORT || 4000;
const logger = require('./utils/loggers')

app.listen(PORT, () => {
    logger.info(`Escuchando puerto: ${PORT}`)
})