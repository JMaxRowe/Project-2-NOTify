import express from 'express'
import Playlist from '../models/playlist.js'
import isSignedIn from '../middleware/isSignedIn.js'

const router = express.Router()

router.get('/profile',isSignedIn, async (req, res, next)=>{
    try {
        const loggedInUser = req.session.user._id
        const playlistsOwned = await Playlist.find({
            owner: loggedInUser
        })
        return res.render('user/profile.ejs', {
            playlistsOwned
        })
    } catch (error) {
        next(error)
    }
})


export default router