import express from 'express'
import Playlist from '../models/playlist.js'
import isSignedIn from '../middleware/isSignedIn.js'

const router = express.Router()

router.get('/', async (req, res, next)=>{
    try {
        const playlists = await Playlist.find().populate('owner')
        return res.render('music/listPlaylists.ejs', { playlists })
    } catch (error) {
        next (error)
    }
})

router.get('/newPlaylist', isSignedIn, (req, res, next)=>{
    try {
        return res.render('music/createPlaylist.ejs')
    } catch (error) {
        next(error)
    }
})

router.post('/', isSignedIn, async (req, res, next)=>{
    try {
        req.body.owner = req.session.user._id;
        const newPlaylist = await Playlist.create(req.body)
        return res.redirect (`/playlists/${newPlaylist._id}`)
    } catch (error) {
        next(error)
    }
})

export default router