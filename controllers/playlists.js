import express from 'express'
import Playlist from '../models/playlist.js'
import isSignedIn from '../middleware/isSignedIn.js'

const router = express.Router()

router.get('/', async (req, res, next)=>{
    try {
        const playlists = await Playlist.find().populate('owner')
        return res.render ('music/listPlaylists.ejs')
    } catch (error) {
        next (error)
    }
})

export default router