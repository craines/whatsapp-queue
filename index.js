const express = require('express')
const { Queue } = require ('bullmq');
const Redis = require('ioredis');
let client;
let subscriber;
const app = express()
const port = 3020
require('dotenv').config()

app.use(express.json())

const opts = {
    connection: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_POST
    },
    // redisOpts here will contain at least a property of connectionName which will identify the queue based on its name
    createClient: function (type, redisOpts) {
        switch (type) {
            case 'client':
                if (!client) {
                    client = new Redis(process.env.REDIS_HOST, redisOpts);
                }
                return client;
            case 'subscriber':
                if (!subscriber) {
                    subscriber = new Redis(process.env.REDIS_HOST, redisOpts);
                }
                return subscriber;
            case 'bclient':
                return new Redis(process.env.REDIS_HOST, redisOpts);
            default:
                throw new Error('Unexpected connection type: ', type);
        }
    }
}

app.get('/', async (req, res) => {
    res.send('OK')
})

app.post('/queue', async (req, res) => {
    console.log('NOVA MENSAGEM RECEBIDA NA FILA')
    const myQueue = new Queue(req.body.bot, opts);
    await myQueue.add(req.body.method, { delay: req.body.delay, data: req.body.data });
    await myQueue.close()
    res.send(req.body)
})

app.listen(port, () => {
    console.log('Server is running in port: ', port)
})
