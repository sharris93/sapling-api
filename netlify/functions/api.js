import serverless from 'serverless-http'
import express from 'express'
import 'dotenv/config'
import morgan from 'morgan'
import mongoose from 'mongoose'
import cors from 'cors'

// Middlware
import notFoundHandler from '../../middleware/notFoundHandler.js'
import errorHandler from '../../middleware/errorHandler.js'

// Routers
import userRouter from '../../controllers/users.js'
import projectRouter from '../../controllers/projects.js'
import pledgeRouter from '../../controllers/pledges.js'

const app = express()

// * Middleware
app.use(cors())
app.use(morgan('dev'))

// * Routes
app.use('/api/auth', userRouter)
app.use('/api/projects', projectRouter)
app.use('/api/pledges', pledgeRouter)

// * Error handler routes
app.use(notFoundHandler)
app.use(errorHandler)

const startServers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log('🔒 Database connected')
  } catch (error) {
    console.log(error)
  }
}
startServers()

export const handler = serverless(app, {
  request: (req, event) => {
    if (typeof event.body === 'string') {
      try {
        req.body = JSON.parse(event.body);
      } catch (err) {
        req.body = {};
      }
    }
  }
});