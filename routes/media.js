const express = require('express')
const router = express.Router()
const Media = require('../models/media')


router.get('/', async (req, res) => {
    try {
        const media = await Media.find()
        res.json(media)

    } catch (err) {
        res.json({ message: err.message })
    }
    res.send('Hello, world')
})

router.get('/id', (req, res) => {
})



module.exports = router
