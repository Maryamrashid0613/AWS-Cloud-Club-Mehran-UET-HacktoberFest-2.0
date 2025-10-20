// routes/auth.js
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const authMiddleware = require('../middlewares/authMiddleware')

const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_with_env_secret'
const JWT_EXPIRES_IN = '7d' // or '1h' depending on your choice

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body
    console.log(name, email, password)

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' })
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password should be at least 6 characters' })
    }

    // check existing
    const existing = await User.findOne({ email })
    if (existing) return res.status(409).json({ message: 'Email already registered' })

    // hash password
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash(password, salt)

    const user = new User({ name, email, password: hashed })
    await user.save()

    // generate jwt
    const payload = { id: user._id, email: user.email }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })

    // do NOT return password
    const safeUser = { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }

    return res.status(201).json({ user: safeUser, token })
  } catch (err) {
    console.error('Register error', err)
    return res.status(500).json({ message: 'Server error' })
  }
})


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })

    const user = await User.findOne({ email })
    if (!user) return res.status(401).json({ message: 'Invalid credentials' })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(401).json({ message: 'Invalid credentials' })

    const payload = { id: user._id, email: user.email }
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN })
    const safeUser = { id: user._id, name: user.name, email: user.email, createdAt: user.createdAt }

    return res.json({ user: safeUser, token })
  } catch (err) {
    console.error('Login error', err)
    return res.status(500).json({ message: 'Server error' })
  }
})



router.get('/me', authMiddleware, async (req, res) => {
  // authMiddleware already attached req.user (without password)
  return res.json({ user: req.user })
})

module.exports = router
