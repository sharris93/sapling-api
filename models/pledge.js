import mongoose from 'mongoose'

const pledgeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  donationAmount: { type: Number, required: true }
}, {
  timestamps: true
})

const Pledge = mongoose.model('Pledge', pledgeSchema)

export default Pledge