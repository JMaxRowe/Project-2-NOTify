import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import methodOverride from 'method-override'
import morgan from 'morgan'
import session from 'express-session'
import MongoStore from "connect-mongo"
import passUserToView from './middleware/passUserToView.js'

import authRouter from './controllers/auth.js'
import userRouter from './controllers/users.js'
import playlistsRouter from './controllers/playlists.js'

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


app.get('/', (req, res)=>{
    res.render('index.ejs')
})

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/playlists', playlistsRouter)



app.use((req, res)=>{
    return res.render('errors/404.ejs')
})

app.use((err, req, res, next)=>{
    res.render('errors/error.ejs', err)
})

mongoose.connect(process.env.MONGODB_URI, {dbName : process.env.DB_NAME})
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.listen(port, ()=>{
    console.log(`The express app is ready on port ${port}!`)
})