import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import methodOverride from 'method-override'
import morgan from 'morgan'
import session from 'express-session'
import MongoStore from "connect-mongo"
import passUserToView from './middleware/passUserToView.js'

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
    mongoUrl: process.env.MONGODB_URI
    })
}))
app.use(passUserToView)


app.get('/', (req, res)=>{
    res.render('index.ejs')
})



mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
    console.log(`Connected to MongoDB ${mongoose.connection.name}.`)
})

app.listen(port, ()=>{
    console.log(`The express app is ready on port ${port}!`)
})