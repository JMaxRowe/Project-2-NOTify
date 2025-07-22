import mongoose from "mongoose";



const songSchema = new mongoose.Schema({
    title:{type: String, required: true},
    artist: {type: String, required: true},
    duration: {type: Number, },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    likedByUsers: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',},],
})

const Song = mongoose.model('Song', songSchema)

export default Song 