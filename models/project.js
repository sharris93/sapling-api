import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' , required: true },
  description: { type: String, required: true },
  goalAmount: { type: Number, required: true, min: 1 },
  currentAmount: { type: Number, required: true, default: 0 },
  deadline: { type: Date, required: true }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
})

// This will create a field on the JSON response whenever we query this model
// It will contain an array of pledges whose `project` field matches the project we're querying
projectSchema.virtual('pledges', {
  ref: 'Pledge',
  localField: '_id',
  foreignField: 'project'
})

const Project = mongoose.model('Project', projectSchema)

export default Project