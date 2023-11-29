const express = require('express')
const router = express.Router()
const User = require('./user')

router.post('/', async (req, res) => {
    const user = new User({
      identifier: req.params.identifier,
      title: req.body.title,
      genre: req.body.genre,
      description: req.body.description,
      isLiked: req.body.isLiked
    });
  
    try {
      const newUser = await user.save();
      res.json(newUser);
    } catch (err) {
      res.json({ message: "Cannot create new User" });
    }
  })

  async function getMediaInfo(req, res, next)
{
    let user
    try{

        media = await User.findById(req.params.id)
        if (user == null) {
            return res.json({ message: 'Cannot find User' })
        }
    } catch (err) {
        res.json({ message: err.message })
    }
    res.user = user
    next()
}

module.exports = router
