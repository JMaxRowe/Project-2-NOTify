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

router.post('/new', isSignedIn, upload.single('song'), async (req, res, next)=>{
    try {
        req.body.owner = req.session.user._id

        let songUrl
        if (req.file && req.file.buffer){
            const result = await cloudinaryUpload(req.file.buffer, 'auto')
            songUrl = result.secure_url
        }
        const newSong = await Song.create({
            title: req.body.title,
            artist: req.body.artist,
            owner: req.body.owner,
            url: songUrl
        })
        return res.redirect('/songs/show')
    } catch (error) {
        next(error)
    }
})

router.get('/show', async (req, res, next)=>{
    try {
        const songs = await Song.find().populate('owner')
        const playlists = await Playlist.find({owner: req.session.user._id})
        return res.render('music/listSongs.ejs', {songs, playlists})
    } catch (error) {
        next(error)
    }
})

router.post('/:songId/add-to-playlist', isSignedIn, async(req, res, next)=>{
    try {
        const playlist = await Playlist.findById(req.body.playlistId)
        if (!playlist.owner.equals(req.session.user._id)){
            return res.send("You don't have permission")
        }
        if (!playlist.songs.includes(req.params.songId)){
            playlist.songs.push(req.params.songId)
            await playlist.save()
        }
        return res.redirect('/songs/show')
    } catch (error) {
        next(error)
    }
})

router.delete('/:songId/', isSignedIn, async(req, res, next)=>{
    try {
        const song = await Song.findById(req.params.songId)
        if (!song.owner.equals(req.session.user._id)) {
            return res.status(403).send("You don't have permission")
        }
        await song.deleteOne()
        await Playlist.updateMany(
            {songs: song._id},
            {$pull: { songs: song._id}}
        )
        return res.redirect(`/user/profile`)
    } catch (error) {
        next(error)
    }
})

export default router