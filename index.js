const express = require('express')
const { Queue } = require ('bullmq');
const app = express()
const port = 3020

app.use(express.json())

app.post('/queue', async (req, res) => {
    const myQueue = new Queue(req.body.bot, {
        connection: {
            host: "0.0.0.0",
            port: 6379
        }
    });
    await myQueue.add(req.body.method, { delay: req.body.delay, data: req.body.data });
    res.send(req.body)
})

app.listen(port, () => {
    console.log('Server is running in port: ', port)
})