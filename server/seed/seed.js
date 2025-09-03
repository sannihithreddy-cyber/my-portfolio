import mongoose from 'mongoose'
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI in .env')
  process.exit(1)
}

const payloadPath = path.resolve('server/seed/banala.json')
if (!fs.existsSync(payloadPath)) {
  console.error('Seed file not found at', payloadPath)
  process.exit(1)
}
const payload = JSON.parse(fs.readFileSync(payloadPath, 'utf-8'))

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
        issueDate: String,
        credentialId: String,
        credentialUrl: String,
        badgeImage: String,
      },
    ],
  },
  { timestamps: true }
)

const Portfolio = mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema)

async function run() {
  try {
    console.log('Connecting to Mongo...')
    await mongoose.connect(MONGODB_URI)
    console.log('Connected')
    // Ensure a single authoritative portfolio doc by default
    if (process.env.PRESERVE !== 'true') {
      await Portfolio.deleteMany({})
      console.log('Cleared existing portfolio documents')
    }
    const created = await Portfolio.create(payload)
    console.log('Seeded document with _id:', created._id.toString())
  } catch (err) {
    console.error('Seed failed:', err.message)
    process.exitCode = 1
  } finally {
    await mongoose.disconnect()
  }
}

run()
