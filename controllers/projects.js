import express from 'express'
import Project from '../models/project.js'
import verifyToken from '../middleware/verifyToken.js'

// Custom errors
import { NotFound, Forbidden } from '../utils/errors.js'

const router = express.Router()

// Starting path for this router: /api/projects

// * Create
router.post('', verifyToken, async (req, res, next) => {
  try {
    req.body.owner = req.user._id
    const project = await Project.create(req.body)
    return res.status(201).json(project)
  } catch (error) {
    next(error)
  }
})

// * Index
router.get('', async (req, res, next) => {
  try {
    const projects = await Project.find()
    return res.json(projects)
  } catch (error) {
    next(error)
  }
})

// * Show
router.get('/:projectId', async (req, res, next) => {
  try {
    const { projectId } = req.params
    const project = await Project.findById(projectId).populate('pledges')
    if (!project) throw new NotFound('Project not found')

    return res.json(project)
  } catch (error) {
    next(error)
  }
})

// * Update
router.put('/:projectId', verifyToken, async (req, res, next) => {
  try {
    const { projectId } = req.params
    const project = await Project.findById(projectId)
    if (!project) throw new NotFound('Project not found')

    if (!project.owner.equals(req.user._id)) throw new Forbidden()

    const updatedProject = await Project.findByIdAndUpdate(projectId, req.body, { returnDocument: 'after' })

    return res.json(updatedProject)
  } catch (error) {
    next(error)
  }
})

// * Delete
router.delete('/:projectId', verifyToken, async (req, res, next) => {
  try {
    const { projectId } = req.params
    const project = await Project.findById(projectId)
    if (!project) throw new NotFound('Project not found')

    if (!project.owner.equals(req.user._id)) throw new Forbidden()

    await Project.findByIdAndDelete(projectId)

    return res.sendStatus(204)
  } catch (error) {
    next(error)
  }
})

export default router