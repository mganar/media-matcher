
const express = require('express')
const app = express()
const mongoose = require('mongoose')


mongoose.connect('mongodb+srv://test2:BElLVc5JkU1uONKl@media-match.scccma6.mongodb.net/')



const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connection to Database Successful!'))

app.use(express.json())

const mediaRouter = require('./routes/media')
app.use('/media', mediaRouter)

const userRouter = require('./routes/user')
app.use('/user', userRouter)



app.listen(3000, () => console.log('Server Started'))
