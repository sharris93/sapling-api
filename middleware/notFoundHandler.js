import { NotFound } from '../utils/errors.js'

const notFoundHandler = (req, res, next) => {
  try {
    throw new NotFound('Page not found')
  } catch (error) {
    next(error)
  }
}

export default notFoundHandler