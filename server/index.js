import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
app.use(cors())
app.use(express.json({ limit: '1mb' }))

// Mongo connection
const uri = process.env.MONGODB_URI
if (!uri) {
  console.warn('MONGODB_URI not set. /api/profile will return 204 until configured.')
}

const PortfolioSchema = new mongoose.Schema(
  {
    name: String,
    brandName: String,
    role: String,
    siteName: String,
    siteUrl: String,
    about: {
      title: String,
      paragraphs: [String],
      resumeUrl: String,
    },
    location: String,
    email: String,
    phone: String,
    socials: Object,
    skills: [
      {
        name: String,
        level: Number,
        category: String,
      },
    ],
    projects: [
      {
        id: Number,
        title: String,
        description: String,
        image: String,
        tags: [String],
        demoUrl: String,
        githubUrl: String,
      },
    ],
  },
  { timestamps: true }
)

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema)

async function ensureMongo() {
  if (!uri) return false
  if (mongoose.connection.readyState === 1) return true
  await mongoose.connect(uri)
  // set up GridFS bucket when connected
  if (!global._resumeBucket) {
    global._resumeBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'resumes' })
  }
  return true
}

// Routes
app.get('/api/profile', async (req, res) => {
  try {
    const ok = await ensureMongo()
    if (!ok) return res.status(204).end()
    const doc = await Portfolio.findOne({}).sort({ updatedAt: -1 }).lean()
    if (!doc) return res.status(204).end()
    res.json(doc)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// Resume upload/download via GridFS
const upload = multer()

app.post('/api/resume', upload.single('file'), async (req, res) => {
  try {
    const ok = await ensureMongo()
    if (!ok) return res.status(500).json({ error: 'Mongo not configured' })
    if (!req.file) return res.status(400).json({ error: 'No file provided' })

    const { originalname, mimetype, buffer } = req.file
    const uploadStream = global._resumeBucket.openUploadStream(originalname || 'resume.pdf', {
      contentType: mimetype || 'application/pdf',
    })
    uploadStream.on('error', (err) => {
      console.error('Upload error:', err)
      if (!res.headersSent) res.status(500).json({ error: err.message })
    })
    uploadStream.on('finish', (file) => {
      if (!res.headersSent) res.json({ id: file._id, url: `/api/resume/${file._id}` })
    })
    uploadStream.end(buffer)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Upload failed' })
  }
})

app.get('/api/resume/:id', async (req, res) => {
  try {
    const ok = await ensureMongo()
    if (!ok) return res.status(500).json({ error: 'Mongo not configured' })
    const id = new mongoose.Types.ObjectId(req.params.id)
    // Try to set headers from files collection metadata
    const cursor = global._resumeBucket.find({ _id: id })
    const files = await cursor.toArray()
    if (!files || !files.length) return res.status(404).json({ error: 'Not found' })
    const file = files[0]
    if (file.contentType) res.set('Content-Type', file.contentType)
    res.set('Content-Disposition', `attachment; filename="${file.filename || 'resume.pdf'}"`)
    global._resumeBucket.openDownloadStream(id).pipe(res)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Download failed' })
  }
})

// Convenience: GET /api/resume -> stream the most recently uploaded resume
app.get('/api/resume', async (_req, res) => {
  try {
    const ok = await ensureMongo()
    if (!ok) return res.status(500).json({ error: 'Mongo not configured' })
    const cursor = global._resumeBucket.find({}).sort({ uploadDate: -1 }).limit(1)
    const files = await cursor.toArray()
    if (!files || !files.length) return res.status(404).json({ error: 'No resume uploaded yet' })
    const file = files[0]
    if (file.contentType) res.set('Content-Type', file.contentType)
    res.set('Content-Disposition', `attachment; filename="${file.filename || 'resume.pdf'}"`)
    global._resumeBucket.openDownloadStream(file._id).pipe(res)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch latest resume' })
  }
})

// Seed endpoint (protected by SEED_TOKEN)
app.post('/api/seed', async (req, res) => {
  try {
    if (!process.env.SEED_TOKEN || req.headers['x-seed-token'] !== process.env.SEED_TOKEN) {
      return res.status(401).json({ error: 'Unauthorized' })
    }
    const ok = await ensureMongo()
    if (!ok) return res.status(500).json({ error: 'Mongo not configured' })
    const payload = req.body || {}
    const created = await Portfolio.create(payload)
    res.json(created)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to seed profile' })
  }
})

// Serve Vite build only if it exists (production). In dev, just expose API.
const distDir = path.resolve(__dirname, '..', 'dist')
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir))
  app.get('*', (_req, res) => {
    res.sendFile(path.join(distDir, 'index.html'))
  })
} else {
  app.get('/', (_req, res) => res.type('text').send('API running'))
}

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`API running on http://localhost:${port}`))
