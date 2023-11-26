require('dotenv').config()

const express = require('express')
const app = express()
const mongoose = require('mongoose')

mongoose.connect(process.env.DATABASE_URL)
const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connection to Database Successful!'))

app.use(express.json())

const mediaRouter = require('./routes/media')
app.use('/media', mediaRouter)



app.listen(3000, () => console.log('Server Started'))