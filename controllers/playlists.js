import express from 'express'
import Playlist from '../models/playlist.js'
import Song from '../models/song.js' 
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

router.get('/:playlistId', async (req, res, next)=>{
    try {
        const {playlistId} = req.params
        const playlist = await Playlist.findById(playlistId).populate('owner').populate('songs')

        return res.render ('music/showPlaylist.ejs', {playlist})
    } catch (error) {
        next(error)
    }
})

router.delete('/:playlistId', isSignedIn, async (req, res, next)=>{
    try {
        const playlist = await Playlist.findById(req.params.playlistId)
        if(playlist.owner.equals(req.session.user._id)){
            await playlist.deleteOne()
            res.redirect('/playlists')
        }
    } catch (error) {
        next(error)
    }
})

router.get('/:playlistId/edit', isSignedIn, async (req, res, next)=>{
    try {
        const playlist = await Playlist.findById(req.params.playlistId).populate('owner').populate('songs')
        res.render('music/editPlaylist.ejs', { playlist })
    } catch (error) {
        next(error)
    }
})

router.post('/:playlistId/songs', isSignedIn, async (req, res, next) =>{
    try {
        req.body.owner = req.session.user._id
        const newSong = await Song.create(req.body)
        const playlist = await Playlist.findById(req.params.playlistId)
        playlist.songs.push(newSong._id)
        await playlist.save()
        res.redirect(`/playlists/${playlist._id}`)
    } catch (error) {
        next(error)
    }
})

router.delete('/:playlistId/songs/:songId', isSignedIn, async(req, res, next)=>{
    try {
        const playlist = await Playlist.findById(req.params.playlistId)
        if (playlist.owner.equals(req.session.user._id)){
            playlist.songs.pull(req.params.songId)
            await playlist.save()
        }
        return res.redirect(`/playlists/${req.params.playlistId}/edit`)
    } catch (error) {
        next(error)
    }
})

router.put('/:playlistId', isSignedIn, async (req, res, next)=>{
    
    try {
        const playlist = await Playlist.findById(req.params.playlistId)
    if(playlist.owner.equals(req.session.user._id)){
        await playlist.updateOne(req.body)
        console.log('updated')
        return res.redirect(`/playlists/${playlist._id}`)
    } else {
        return res.send("You don't have permission to do that.")
    }
    } catch (error) {
        next(error)
    }
})

export default router