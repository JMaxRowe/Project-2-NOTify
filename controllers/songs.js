import express from 'express'
import Playlist from '../models/playlist.js'
import Song from '../models/song.js' 
import isSignedIn from '../middleware/isSignedIn.js'
import { upload } from '../utils/cloudinary.js'
import cloudinaryUpload from '../utils/cloudinaryUpload.js'

const router = express.Router()

router.get('/new',isSignedIn, (req, res, next)=>{
    try {
        return res.render('music/uploadSongs.ejs')
    } catch (error) {
        next(error)
    }
})

router.post('/new', isSignedIn, async (req, res, next)=>{
    try {
        const owner = req.session.user._id
        let songUrl
        if (req.file && req.file.path){
            songUrl = req.file.path
        }else if (req.file && req.file.buffer){
            const result = await cloudinaryUpload(req.file.buffer, 'video')
            songUrl = result.secure_url
        }
        const newSong = await Song.create({
            title: req.body.title,
            artist: req.body.artist,
            owner,
            fileName: songUrl
        })
        return res.redirect('/')
    } catch (error) {
        next(error)
    }
})

router.get('/show', async (req, res, next)=>{
    try {
        const songs = await Song.find().populate('owner')
        return res.render('music/listSongs.ejs', {songs})
    } catch (error) {
        next(error)
    }
})

export default router