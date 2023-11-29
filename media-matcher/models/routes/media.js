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

//Retieves Media by ID
router.get('/:id', getMediaInfo, (req, res) => {
    //Displays the contents of Media
    res.send(res.media)
})

//Create a new media
router.post('/', async (req, res) => {
    const media = new Media({
        id: req.params.id,
        title: req.body.title,
        genre: req.body.genre,
        description: req.body.description,
        isLiked: req.body.isLiked
    })

    try {
        const newMedia = await media.save()
        res.json(newMedia)
    } catch (err) {
        res.json({ message: "Cannot create new Media" })

    }
//Updating by ID
    router.patch('/:id', getMediaInfo, async (req, res) => {
        if (req.body.title != null){
            res.media.title = req.body.title
        }
        if (req.body.isLiked != null){
            res.media.isLiked = req.body.isLiked
        }
        if (req.body.genre != null){
            res.media.genre = req.body.genre
        }
        if (req.body.description != null){
            res.media.description = req.body.description
        }
        try {
            const newMedia = await res.media.save()
            res.json(newMedia)
        } catch (err) {
            res.json({ message: "Cannot update new Media" })
        }
    })

//Deleting by ID
router.delete('/:id', getMediaInfo, async (req, res) => {
    try {
      const media = await Media.findOneAndDelete({ _id: req.params.id });
      if (!media) {
        return res.json({ message: "Media not found" });
      }
      res.json({ message: "Media deleted successfully" });
    } catch (err) {
      res.json({ message: "Media unable to be deleted" });
    }
  })

})

//Middleware Function to Create Media Object
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
