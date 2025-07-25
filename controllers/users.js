import express from 'express'
import Playlist from '../models/playlist.js'
import isSignedIn from '../middleware/isSignedIn.js'
import Song from '../models/song.js'

const router = express.Router()

router.get('/profile',isSignedIn, async (req, res, next)=>{
    try {
        const loggedInUser = req.session.user._id
        const playlistsOwned = await Playlist.find({
            owner: loggedInUser
        }).populate('owner')
        const bookmarkedPlaylists = await Playlist.find({
            userBookmarks: loggedInUser
        }).populate('owner')
        const songsOwned = await Song.find({
            owner: loggedInUser
        }).populate('owner')
        const playlists = await Playlist.find().populate('owner')
        return res.render('user/profile.ejs', {
            playlistsOwned,
            playlists,
            DEFAULT_PLAYLIST_COVER: process.env.DEFAULT_PLAYLIST_COVER,
            songsOwned,
            bookmarkedPlaylists
        })
    } catch (error) {
        next(error)
    }
})


export default router