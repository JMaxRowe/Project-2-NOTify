import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    title:{type: String, required: true},
    description: {type: String, required: true},
    songs: [
        {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Song',
        }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bookmarkedByUsers: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',},],
    coverArt : {type: String},
}) 

const Playlist = mongoose.model('Playlist', playlistSchema)

export default Playlist 