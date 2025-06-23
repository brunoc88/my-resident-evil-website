const express = require('express')
const app = express()

app.get('/', (req, res)=>{
    res.send('Hola!')
})

app.listen(3000, ()=>{
    console.log('Escuchando pueto::', 3000)
})