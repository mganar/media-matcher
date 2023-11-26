const mongoose = require('mongoose')

const mediaSchema = new mongoose.Schema({
    id: 
    {
        type: Number,
        required: true
    },
    title: 
    {
        type: String,
        required: true
    },
    genre: 
    {
        type: String
    },
    description: 
    {
        type: String
    },
    background: 
    {
        type: String

    },
    avg_vote: 
    {
        type: Number
    }
 })
 
 module.exports = mongoose.model('Media', mediaSchema)


    