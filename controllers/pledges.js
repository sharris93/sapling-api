import express from 'express'
import verifyToken from '../middleware/verifyToken.js'
import Pledge from '../models/pledge.js'

const router = express.Router()

// Starting path: /api/pledges

// * Create
router.post('', verifyToken, async (req, res, next) => {
  try {
    req.body.user = req.user._id

    const pledge = await Pledge.create(req.body)
    
    return res.status(201).json(pledge)
  } catch (error) {
    next(error)
  }
})

export default router