import express from 'express'
import User from '../models/user.js'
import { InvalidData, Unauthorized } from '../utils/errors.js'
import bcrypt from 'bcrypt'
import { generateToken } from '../utils/tokens.js'
import verifyToken from '../middleware/verifyToken.js'

const router = express.Router()

// * Starting path: /api/auth

// * Sign up
router.post('/sign-up', async (req, res, next) => {
  try {
    // Ensure passwords match
    if (req.body.password !== req.body.passwordConfirmation) {
      throw new InvalidData('Passwords do not match.', 'passwordConfirmation')
    }

    // Attempt to create new user
    const newUser = await User.create(req.body)

    // Generate the token
    const token = generateToken(newUser)
    // Response
    return res.status(201).json({ token: token })
  } catch (error) {
    next(error)
  }
})

// * Sign in
router.post('/sign-in', async (req, res, next) => {

  const { identifier, password } = req.body

  try {
    // Search the user by username OR email
    const foundUser = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier }
      ]
    })
    
    if (!foundUser) {
      throw new Unauthorized('User does not exist.')
    }

    // compare the hash against the provided plain text password
    if (!bcrypt.compareSync(password, foundUser.password)) {
      throw new Unauthorized('Passwords do not match.')
    }

    // Generate the token
    const token = generateToken(foundUser)

    // Response
    return res.json({ token: token })
  } catch (error) {
    next(error)
  }
})

// * Profile
router.get('/profile', verifyToken, async (req, res, next) => {
  try {
    const profile = await User.findById(req.user._id)
      .populate(['ownedProjects', 'pledgesMade'])

    return res.json(profile)
  } catch (error) {
    next(error)
  }
})

export default router