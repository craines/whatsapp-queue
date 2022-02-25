const express = require('express')
const { Queue } = require ('bullmq');
const app = express()
const port = 3020
require('dotenv').config()

app.use(express.json())

app.get('/', async (req, res) => {
    res.send('OK')
})

app.post('/queue', async (req, res) => {
    console.log('NOVA MENSAGEM RECEBIDA NA FILA')
    const myQueue = new Queue(req.body.bot, {
        connection: {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_POST
        }
    });
    await myQueue.add(req.body.method, { delay: req.body.delay, data: req.body.data });
    res.send(req.body)
})

app.listen(port, () => {
    console.log('Server is running in port: ', port)
})