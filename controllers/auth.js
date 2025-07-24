import express from 'express'
import User from '../models/user.js'
import bcrypt from 'bcrypt'

const router = express.Router()

router.get('/sign-up', (req, res)=>{
    res.render('user/sign-up.ejs')
})

router.get('/sign-in', (req, res)=>{
    res.render('user/sign-in.ejs')
})


router.post('/sign-up', async (req, res)=>{
    try {
        const {username, password, confirmPassword} = req.body

        if (username.trim() === '')  {
            req.session.message = ('Please provide a username.')
            return res.redirect('/auth/sign-up')
        }
        if (password.trim() === '') {
            req.session.message = ('Please provide a password.')
            return res.redirect('/auth/sign-up')
        }

        const existingUser = await User.findOne({ username: username })
        if (existingUser)  {
            req.session.message = ('Username already taken')
            return res.redirect('/auth/sign-up')
        }

        const user = await User.create(req.body)

        req.session.user = {
            _id: user._id,
            username: user.username
        }

        req.session.save(() => {
            return res.redirect('/')
        })
    } catch (error) {
        return res.send(error.message)
    }
})

router.post('/sign-in', async (req, res) => {
    try {
        const { username, password } = req.body

        const existingUser = await User.findOne({ username: username })
        if (!existingUser) {
            req.session.message = ('Invalid credentials provided.')
            return res.redirect('/auth/sign-in')
        }

        if (!bcrypt.compareSync(password, existingUser.password)) {
            req.session.message = ('Invalid credentials provided.')
            return res.redirect('/auth/sign-in')
        }

        req.session.user = {
            _id: existingUser._id,
            username: existingUser.username
        }

        req.session.save(() => {
            return res.redirect('/')
        })

    } catch (error) {
        return res.send(error.message)
    }
})

router.get('/sign-out', (req, res) => {
    try {
        req.session.destroy(() => {
        res.redirect('/auth/sign-in')
        })
    } catch (error) {
        console.log(error)
        return res.send(error.message)
    }
})


export default router