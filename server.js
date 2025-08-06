import express from 'express'
import 'dotenv/config'
import morgan from 'morgan'
import mongoose from 'mongoose'

// Middlware
import notFoundHandler from './middleware/notFoundHandler.js'
import errorHandler from './middleware/errorHandler.js'

// Routers
import userRouter from './controllers/users.js'
import projectRouter from './controllers/projects.js'
import pledgeRouter from './controllers/pledges.js'

const app = express()
const port = process.env.PORT || 3000

// * Middleware
app.use(express.json())
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
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}
startServers()