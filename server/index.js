import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import fs from 'fs'
import multer from 'multer'
import { fileURLToPath } from 'url'
import nodemailer from 'nodemailer'

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
    certifications: [
      {
        id: Number,
        title: String,
        issuer: String,
        issueDate: String, // ISO date string
        credentialId: String,
        credentialUrl: String,
        badgeImage: String,
      },
    ],
  },
  { timestamps: true }
)

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema)

async function ensureMongo() {
  try {
    if (!uri) return false
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(uri)
    }
    // set up GridFS bucket when connected (guard against undefined db)
    if (!global._resumeBucket) {
      const conn = mongoose.connection
      const db = conn.db || (conn.getClient ? conn.getClient().db(conn.name) : null)
      if (db) {
        global._resumeBucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'resumes' })
      } else {
        // If db is still unavailable, skip bucket init for now
        console.warn('Mongo connected but db not ready yet; deferring GridFS bucket init')
      }
    }
    return true
  } catch (err) {
    console.error('ensureMongo error:', err)
    return false
  }
}

// Eagerly create bucket when DB is ready
mongoose.connection.once('open', () => {
  try {
    if (!global._resumeBucket && mongoose.connection?.db) {
      global._resumeBucket = new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'resumes' })
      console.log('GridFS bucket initialized')
    }
  } catch (e) {
    console.warn('Failed to init GridFS bucket on open:', e?.message)
  }
})

// Routes
app.get('/api/profile', async (req, res) => {
  try {
    const ok = await ensureMongo()
    if (!ok) return res.status(204).end()
    // Return the most recently updated document (tie-breaker by _id)
    const doc = await Portfolio.findOne({}).sort({ updatedAt: -1, _id: -1 }).lean()
    if (!doc) return res.status(204).end()
    res.json(doc)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// Email: POST /api/contact -> send email to site owner
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {}
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing name, email, or message' })
    }

    // Determine recipient: env MAIL_TO or profile.email
    let to = process.env.MAIL_TO
    if (!to) {
      try {
        const ok = await ensureMongo()
        if (ok) {
          const doc = await Portfolio.findOne({}).sort({ updatedAt: -1, _id: -1 }).lean()
          if (doc?.email) to = doc.email
        }
      } catch {}
    }
    if (!to) return res.status(500).json({ error: 'No recipient configured (set MAIL_TO in .env or add email to profile doc)' })

    // Build transport: prefer SMTP env; else use Ethereal (dev-only)
    let transporter
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Boolean(process.env.SMTP_SECURE === 'true'),
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      })
    } else {
      // Ethereal fallback for free dev testing
      const test = await nodemailer.createTestAccount()
      transporter = nodemailer.createTransport({
        host: test.smtp.host,
        port: test.smtp.port,
        secure: test.smtp.secure,
        auth: { user: test.user, pass: test.pass },
      })
    }

    const fromAddr = process.env.MAIL_FROM || process.env.SMTP_USER || email
    const subject = process.env.MAIL_SUBJECT || `New message from ${name}`
    const html = `
      <div style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; line-height:1.6;">
        <h2 style="margin:0 0 8px;">New message from your portfolio</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        <p><strong>Message:</strong></p>
        <div style="white-space: pre-wrap; border:1px solid #e5e7eb; padding:12px; border-radius:8px;">${escapeHtml(message)}</div>
        <hr/>
        <p style="color:#6b7280; font-size:12px;">Sent via MY_PORTFOLIO contact form</p>
      </div>
    `
    const info = await transporter.sendMail({
      from: fromAddr,
      to,
      replyTo: email,
      subject,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html,
    })

    const previewUrl = nodemailer.getTestMessageUrl?.(info)
    res.json({ ok: true, previewUrl })
  } catch (err) {
    console.error('contact error:', err)
    res.status(500).json({ error: err?.message || 'Failed to send message' })
  }
})

function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

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

// Health endpoint to debug connection state
app.get('/api/health', async (_req, res) => {
  try {
    const ok = await ensureMongo()
    const conn = mongoose.connection
    const stateMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
    res.json({
      ok,
      mongoUriSet: Boolean(uri),
      readyState: conn.readyState,
      readyStateText: stateMap[conn.readyState] || 'unknown',
      hasDb: Boolean(conn.db),
      hasBucket: Boolean(global._resumeBucket),
    })
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message })
  }
})

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`API running on http://localhost:${port}`))
