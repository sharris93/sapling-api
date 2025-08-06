import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: ['Please provide a username.', true], 
    unique: true
  },
  email: { 
    type: String, 
    required: ['Please provide an email.', true], 
    unique: true 
  },
  password: { 
    type: String, 
    required: ['Please provide a password.', true] 
  }
}, {
  toJSON: { 
    virtuals: true, // Ensure virtual fields are able to be populated in responses to the client
    transform: (doc, objectToBeReturned) => { // the transform method allows us to transform the final user object that gets sent back to the client. Here, we're removing the password from the user whenever it is converted to JSON and sent to the client via res.json()
      delete objectToBeReturned.password
      delete objectToBeReturned.id
    }
  }
})


// ownedProjects
userSchema.virtual('ownedProjects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'owner'
})

// pledgesMade
userSchema.virtual('pledgesMade', {
  ref: 'Pledge',
  localField: '_id',
  foreignField: 'user'
})


// Hash the password just before saving a new user
userSchema.pre('save', function(next){
  if (this.isModified('password')){
    this.password = bcrypt.hashSync(this.password, 12)
  }
  next()
})


const User = mongoose.model('User', userSchema)

export default User