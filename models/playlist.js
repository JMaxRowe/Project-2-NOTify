import mongoose from "mongoose";

const playlistSchema = new mongoose.Schema({
    title:{type: String, required: true},
    songs: {type: String, required: true},
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    bookmarkedByUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',},],
})

const Playlist = mongoose.model('Playlist', playlistSchema)

export default Playlist 