import jwt from 'jsonwebtoken'

// Erros
import { Unauthorized } from "../utils/errors.js"

// Models
import User from '../models/user.js'

const verifyToken = async (req, res, next) => {
  try {
    // 1. Verify an auth header has been provided
    const authHeader = req.headers.authorization
    if (!authHeader) throw new Unauthorized('No Authorization header provided (Bearer token)')
    
      // 2. Remove the "Bearer " from the auth header to get the token on its own
      const token = authHeader.split(' ')[1]
      if (!token) throw new Unauthorized('Authorization header format was invalid.')
      
      // 3. Verifying the JWT
      const payload = jwt.verify(token, process.env.TOKEN_SECRET)
      
      // 4. Check the user in the token payload still exists in our database
      const foundUser = await User.findById(payload.user._id)
      if (!foundUser) throw new Unauthorized('User does not exist.')
    
      // 5. Before passing the request to the controller, we will make the logged in user (that's the foundUser above) available on req.user
      req.user = foundUser

      // 6. Pass the request on to the controller
      next()

  } catch (error) {
    next(error)
  }
}

export default verifyToken