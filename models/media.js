const mongoose = require('mongoose')

const mediaSchema = new mongoose.Schema({
    id: 
    {
        type: Number,
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
    isLiked: 
    {
        type: Boolean

    }
 })
 
 module.exports = mongoose.model('Media', mediaSchema)


    