const express = require('express')
const router = express.Router()
const Media = require('../models/media')

//Retrieves all media
router.get('/', async (req, res) => {
    try {
        const medias = await Media.find()
        res.json(medias)

    } catch (err) {
        res.json({ message: err.message })
    }
})
//Retieves one media by id
router.get('/:id', getMediaInfo, (req, res) => {
    //Displays the contents of Media
    res.send(res.media.title)
    res.send(res.media.id)
})
//Create a new media
router.post('/', async (req, res) => {
    const media = new Media({
        id: req.params.id,
        title: req.body.title,
        genre: req.body.genre,
        description: req.body.description,
        background: req.body.background,
        avg_vote: req.body.avg_vote
    })

    try {
        const newMedia = await media.save()
        res.json(newMedia)
    } catch (err) {
        res.json({ message: "Cannot create new Media" })

    }
//Updating by ID
    router.patch('/:id', async (req, res) => {
        res.medi
    })

//Deleting by ID
    router.delete('/:id',  (req, res) => {
    })

})

async function getMediaInfo(req, res, next)
{
    let media
    try{

        media = await Media.findById(req.params.id)
        if (media == null) {
            return res.json({ message: 'Cannot find Media' })
        }
    } catch (err) {
        res.json({ message: err.message })
    }
    res.media = media
    next()
}

module.exports = router
