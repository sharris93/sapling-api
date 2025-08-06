const logError = (err) => {
  console.log('-------------------')
  console.log('🚨 Error 🚨')
  console.log('-------------------')
  console.log('Name:', err.name)
  console.log('Status:', err.status)
  console.log('Message:', err.message)
  console.log('-------------------')
  console.log('Stack:')
  console.log(err.stack)
  console.log('-------------------')
  console.log('The above error occurred during the below request:')
}

const errorHandler = (err, req, res, next) => {
  logError(err)

  // * Custom Validation Error (InvalidData)
  if (err.name === 'InvalidData') {
    return res.status(err.status).json(err.response)
  }

  // * Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const response = {}

    for(const keyName in err.errors) {
      response[keyName] = err.errors[keyName].properties.message
    }

    return res.status(400).json(response)
  }

  // * Unique constraints (field value already exists)
  if (err.name === 'MongoServerError' && err.code === 11000) {
    const [keyName, keyValue] = Object.entries(err.keyValue)[0]
    return res.status(400).json({
      [keyName]: `${keyName[0].toUpperCase() + keyName.slice(1)} "${keyValue}" already taken. Please try another.`
    })
  }

  // * Unauthorized 
  if (err.name === 'Unauthorized' || err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Unauthorized' })
  }


  // * Fallback response if no error has been identified
  return res.status(500).json({ message: 'Internal Server Error' })
}

export default errorHandler