import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import methodOverride from 'method-override'
import morgan from 'morgan'
import session from 'express-session'
import MongoStore from "connect-mongo"
import passUserToView from './middleware/passUserToView.js'
import passMessageToView from './middleware/passMessageToView.js'

import authRouter from './controllers/auth.js'
import userRouter from './controllers/users.js'
import playlistsRouter from './controllers/playlists.js'
import songsRouter from './controllers/songs.js'
import Playlist from './models/playlist.js'


const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({extended: false}))
app.use (methodOverride('_method'))
app.use(morgan('dev'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        dbName: process.env.DB_NAME
    })
}))
app.use(passUserToView)
app.use(express.static('public'))
app.use(passMessageToView)


app.get('/', async (req, res)=>{
    const playlists = await Playlist.find().populate('owner')
    res.render('index.ejs',{ 
            playlists,
            DEFAULT_PLAYLIST_COVER: process.env.DEFAULT_PLAYLIST_COVER
        })
})

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/playlists', playlistsRouter)
app.use('/songs', songsRouter)



app.use((req, res)=>{
    return res.status(404).render('errors/error.ejs', {
        status: 404,
        message: 'Page not found'
    })
})

app.use((err, req, res, next)=>{
    console.error(err)
    const status = err.status || 500
    res.status(status).render('errors/error.ejs', { status, message: err.message })
})

mongoose.connect(process.env.MONGODB_URI, {dbName : process.env.DB_NAME})
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.listen(port, ()=>{
    console.log(`The express app is ready on port ${port}!`)
})