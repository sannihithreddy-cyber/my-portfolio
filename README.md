# MY_PORTFOLIO — Full Project Documentation

This document explains the entire project end‑to‑end so that even someone new to web development can set it up, understand how it works, and extend it safely. It covers the frontend, backend, database, email service, configuration, data formats, animations, and common troubleshooting.


## 1) What This App Is

- A personal portfolio website built with React + Vite on the frontend and Express + Mongoose on the backend.
- Your content (name, role, about, skills, projects, certifications, contact info) lives in MongoDB and is served by the backend at `GET /api/profile`.
- The site features modern visuals: constellation and gradient orbs background, reveal‑on‑scroll animations, section dividers, hover lifts, and a playful wing‑flapping ladybug.
- A contact form sends you an email via a free SMTP service (Brevo or Gmail App Password) using Nodemailer.


## 2) Tech Stack

- Frontend: React 18, Vite 5, Tailwind v4 (via `@tailwindcss/vite`), small hand‑rolled utilities.
- Backend: Node 18+, Express 4, Mongoose 8 for MongoDB, Multer + GridFS for resume uploads, Nodemailer for email.
- Build/Dev: Vite dev server for the web; an Express server for the API.

Key files:
- Frontend entry: `index.html` → `src/main.jsx` → `src/App.jsx`
- Frontend styles/utilities: `src/index.css`
- Sections/components: `src/components/*`
- Data context (client): `src/data/ProfileContext.jsx`
- Backend server: `server/index.js`
- Seeding (sample DB doc): `server/seed/banala.json`, `server/seed/seed.js`
- Dev config: `vite.config.js`, `package.json`


## 3) Directory Layout (What lives where)

- `index.html`: Base HTML shell Vite uses to mount the React app.
- `public/`: Static files (e.g., `robots.txt`, `sitemap.xml`, `resume.pdf`, images). Served as‑is.
- `src/` (frontend)
  - `main.jsx`: Bootstraps React and imports global CSS.
  - `App.jsx`: React Router setup and reveal‑on‑scroll initializer.
  - `index.css`: Design tokens, utility classes, animations (glow, reveal, gradients, orbs, constellation helpers, ladybug, comet, section dividers).
  - `pages/`
    - `Home.jsx`: Page composition (Hero, About, Skills, Certifications, Projects, Contact) inside `Layout`.
  - `components/`
    - `Layout.jsx`: Shared chrome (Theme toggle, star bg, navbar, footer, comet, ladybug).
    - `Navbar.jsx`, `Footer.jsx`: Navigation top/bottom.
    - Visual FX: `BackgroundOrbs.jsx`, `ConstellationCanvas.jsx`, `StarBackground.jsx`, `Ladybug.jsx`, `Comet.jsx`.
    - Micro‑interactions: `Magnetic.jsx` (button nudge), `ParallaxTilt.jsx` (gentle tilt on hero group).
    - Sections: `HeroSection.jsx`, `AboutSection.jsx`, `SkillsSection.jsx`, `ProjectsSection.jsx`, `CertificationsSection.jsx`, `ContactSection.jsx`.
  - `lib/`
    - `reveal.js`: IntersectionObserver+MutationObserver logic to reveal elements as they enter the viewport.
  - `data/`
    - `ProfileContext.jsx`: Client data provider that fetches the portfolio JSON.
    - `nav.js`: Centralized navigation items.
- `server/` (backend)
  - `index.js`: Express app, Mongo connection, profile API, contact email API, resume (GridFS) API, and `/api/health`.
  - `seed/`
    - `seed.js`: Script to insert the sample profile document.
    - `banala.json`: The sample profile data (skills, projects, certifications, etc.).


## 4) How Data Flows (Step‑by‑Step)

1. Browser requests the site root served by Vite in dev (or any static host in prod).
2. React mounts (`src/main.jsx`) and renders `App.jsx`.
3. `ProfileProvider` (`src/data/ProfileContext.jsx`) fetches the portfolio JSON from these candidates in order:
   - `VITE_API_URL/api/profile?…`
   - `/api/profile?…` (same origin, proxied by Vite in dev)
   - `http://localhost:5050/api/profile?…` (explicit local fallback)
4. When JSON arrives, it’s stored in context so any component can read it via `useProfile()`.
5. Sections render using that data: name/role in Hero, about text, skills grids, projects, certifications, and contact info.
6. The Contact form POSTs to `POST /api/contact` with `{ name, email, message }`.
7. The backend uses Nodemailer with your SMTP. If configured, an email is sent to `MAIL_TO`, and a success banner appears in the UI.


## 5) Environment Variables (.env)

Create `/.env` (local only — do not commit secrets). Example (Brevo SMTP):

```
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
PORT=5050
SEED_TOKEN=change-me

# Email via Brevo
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-brevo-login@smtp-brevo.com
SMTP_PASS=YOUR_BREVO_SMTP_KEY
MAIL_TO=recipient@example.com
MAIL_FROM=sender@example.com
MAIL_SUBJECT=New message from your portfolio
```

Gmail App Password alternative:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your@gmail.com
SMTP_PASS=<16-char-app-password>
MAIL_TO=your@gmail.com
MAIL_FROM=your@gmail.com
```

Frontend can optionally set `VITE_API_URL` (e.g., when the API is hosted on another domain).


## 6) Running Locally (Dev)

- Start the API: `npm run server` (serves on `http://localhost:5050`)
- Start the web: `npm run dev` (serves on `http://localhost:5173`)
- Combined (two tabs): `npm run dev:all`

Dev URLs to check:
- API health: `http://localhost:5050/api/health` → `{ ok, readyStateText, hasDb, hasBucket }`
- Profile JSON: `http://localhost:5050/api/profile`
- Resume (latest): `http://localhost:5050/api/resume` (404 until you upload one)


## 7) Seeding MongoDB (Sample Content)

Seed once to create the initial profile document.

```
node server/seed/seed.js
```

- By default, the seeder deletes existing portfolio docs to keep a single authoritative record (set `PRESERVE=true` to keep older docs).
- The backend always returns the most recent doc by `updatedAt` (then `_id`).

Edit `server/seed/banala.json` to customize all content (name, role, skills, projects, certifications, contact info). Seed again to apply.


## 8) Backend API (What each route does)

- `GET /api/health`: Returns connection state for debugging. Useful if “site is blank”.
- `GET /api/profile`: Returns the latest portfolio document from Mongo.
- `POST /api/seed` (protected with `SEED_TOKEN` header — optional helper): Creates a portfolio doc from a JSON body.
- `POST /api/resume`: Upload a resume file; stored in Mongo GridFS and returns a file URL.
- `GET /api/resume`: Streams the most recently uploaded resume.
- `GET /api/resume/:id`: Streams a specific resume by ID.
- `POST /api/contact`: Sends an email using your SMTP configuration. The recipient is `MAIL_TO` (or `profile.email` if unset).

Implementation: `server/index.js`


## 9) Data Model (MongoDB → JSON)

A single “portfolio” document with these fields (simplified):

```
{
  name: string,
  brandName: string,
  role: string,               // e.g., "Full Stack Developer | AI Enthusiast"
  siteName: string,
  siteUrl: string,
  about: {
    title: string,
    paragraphs: string[],
    resumeUrl?: string,
    contactIntro?: string,
    features?: [{ title: string, text: string }]
  },
  location: string,
  email: string,
  phone: string,
  socials: { github?: string, linkedin?: string, twitter?: string, instagram?: string, twitch?: string, website?: string },
  skills: [{ name: string, level: number, category: 'fullstack' | 'ai-enthusiast' }],
  projects: [{ id: number, title: string, description: string, image?: string, tags: string[], demoUrl?: string, githubUrl?: string }],
  certifications: [{ id: number, title: string, issuer: string, issueDate: string, credentialId?: string, credentialUrl?: string, badgeImage?: string }]
}
```

The frontend reads this JSON via `useProfile()` and renders sections accordingly. If a field/array is missing, that part is simply hidden.


## 10) Frontend: Components and Interactions (How things work)

- `ProfileProvider` (`src/data/ProfileContext.jsx`)
  - Fetches `/api/profile` (with cache‑busting `?t=Date.now()`), stores the JSON in React Context.
  - `useProfile()` returns the data anywhere in the tree.

- `Layout.jsx`
  - Wraps Theme toggle (dark/light), `StarBackground`, `Comet` (occasional streak), `Ladybug` (continuous wing‑flapping wanderer), `Navbar`, and `Footer`.

- Visual backgrounds
  - `BackgroundOrbs.jsx`: Layered hand-crafted purple/blue wash + analog noise with built-in contrast veil for accessibility.
  - `ConstellationCanvas.jsx`: Interactive canvas linking points; reacts to mouse.
  - `StarBackground.jsx`: Stars + meteors using CSS animations.

- Micro‑interactions
  - `ParallaxTilt.jsx`: Slight perspective tilt following the mouse.
  - `Magnetic.jsx`: CTA gently nudges towards the cursor.

- Sections
  - `HeroSection.jsx`: Shows your name/role with animated gradient and reveals. Layers constellation/orbs behind text.
  - `AboutSection.jsx`: About text; optional features; CV download button uses configured `resumeUrl` or `/api/resume` fallback.
  - `SkillsSection.jsx`:
    - Builds category tabs from your `skills[].category` values (we normalized to two: `fullstack` and `ai-enthusiast`).
    - “All” is the default; if a category is empty, it auto‑falls back to “All”.
    - Filter chips now look/feel like buttons with active rings + hover motion.
    - Each skill displays a small progress bar (animated on filter change).
  - `ProjectsSection.jsx`: Cards with image zoom on hover, tags, and GitHub/Live links; CTA button points to your GitHub profile.
  - `CertificationsSection.jsx`: Renders your certifications with issuer/date + link to credential.
  - `ContactSection.jsx`:
    - Simple form `{name,email,message}` posting to `/api/contact`.
    - Inline status banner: “Sending…”, green “Message sent!” on success (or “Open preview” link when using Ethereal dev), and a dismiss button.

- Reveal on scroll (`src/lib/reveal.js`)
  - Uses `IntersectionObserver` to add `.is-visible` when `.reveal` elements enter the viewport.
  - Adds a `MutationObserver` to handle nodes added after data loads.
  - Periodic safety pass to reveal anything missed.


## 11) Styling & Animations (`src/index.css`)

- Design tokens: CSS variables for colors (background, foreground, primary, accent, etc.) and dark theme equivalents.
- Utilities you can use in JSX:
  - Colors: `.bg-background`, `.bg-card`, `.text-foreground`, `.text-primary`, `.text-muted-foreground`, `.surface-glass`, `.surface-card`.
  - Effects: `.text-glow`, `.hover-lift`, `.underline-animate`.
  - Reveal: `.reveal` + `.is-visible` (added by JS).
  - Hero visuals: `.hero-gradient-base`, `.hero-gradient-wash`, `.hero-gradient-contrast`, `.hero-gradient-noise`, `.grid-overlay`, `.text-gradient`, `.text-gradient-animated`.
  - Section transitions: `.section-divider` (animated gradient line), `.section-alt` (subtle radial veils).
  - Animations: keyframes for float, aurora, shimmer, blob, gradient‑move, grow.
  - Ladybug: `.ladybug`, `.animate-ladybug` and wing flap keyframes.


## 12) Email Service (Nodemailer)

- Endpoint: `POST /api/contact` with JSON `{ name, email, message }`.
- SMTP Priority: If `SMTP_HOST/PORT/USER/PASS` are set, sends real mail; otherwise tries Ethereal test account (dev preview only).
- Recipient: `MAIL_TO` if set, else falls back to the profile’s `email`.
- Success behavior in UI: A green inline banner appears above the form. With Ethereal dev, a preview link is shown.

Configure `.env` and restart API. Test via the contact form or curl:

```
curl -s -X POST http://localhost:5050/api/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"me@example.com","message":"Hello"}'
```


## 13) Development Tips & Troubleshooting

- “Blank site” or “no data”: Make sure the API is running. Check:
  - `http://localhost:5050/api/health` → `ok: true, readyStateText: "connected"`
  - `http://localhost:5050/api/profile` → returns JSON
  - Frontend console logs: `[profile] loaded from …`
- Profile not loading on another domain: set `VITE_API_URL=https://your-api` and rebuild the frontend.
- Email sent but not received: verify SMTP creds; check Spam; ensure sender domain is verified (Brevo) or use a Gmail App Password.
- GridFS bucket errors at startup: the server now defers bucket init safely; just start the API again if needed.


## 14) Production Deployment (Overview)

- Host the backend (Express) on a server platform that supports Node + MongoDB access (e.g., Render, Railway, Fly.io). Set all `.env` variables in provider secrets.
- Host the frontend on any static host (e.g., Vercel, Netlify). Build with `npm run build` and deploy `/dist`.
  - If the API is on a different domain, set `VITE_API_URL` at build time so the client fetches from the correct origin.
- Make sure CORS is allowed (Express uses `cors()` already) and that the API is reachable publicly.


## 15) Extending the Site (Scalability)

- Add a new page/route:
  - Create a component in `src/pages/YourPage.jsx`.
  - Add a `<Route path="/yourpage" element={<YourPage/>} />` in `src/App.jsx`.
  - Add a new nav item in `src/data/nav.js`.
- Add content fields:
  - Add to `PortfolioSchema` in `server/index.js`.
  - Seed data in `server/seed/banala.json` and re‑run `node server/seed/seed.js`.
  - Render in a section using `useProfile()`.
- Design tweaks: edit tokens in `src/index.css` or swap utilities on components.


## 16) Package Scripts

- `npm run dev` → Vite dev server for the frontend.
- `npm run server` → Node server for the backend (Express).
- `npm run dev:all` → Run both concurrently (requires `concurrently`).
- `npm run build` → Build the frontend into `dist/`.
- `npm run preview` → Preview the built frontend locally.


## 17) FAQ

- Q: The ladybug isn’t moving.
  - A: Check OS “Reduce Motion” accessibility setting; the ladybug hides there. Otherwise refresh; it uses CSS Motion Path + JS re‑path timer.
- Q: Why don’t I see the constellation?
  - A: It sits behind the hero text; ensure the hero isn’t covered by another overlay. We removed the vignette to keep it visible.
- Q: Why no content?
  - A: Ensure the API returns JSON at `/api/profile`. Check `/api/health` and confirm Mongo is connected.
- Q: How can I customize sections?
  - A: Edit seed JSON, re‑seed, and the frontend will reflect it automatically.


## 18) Where To Change Common Things

- Your name/role/about: `server/seed/banala.json` → `name`, `role`, `about.title`, `about.paragraphs`.
- Skills & categories: `skills[]` in the same seed file. We use only `fullstack` and `ai-enthusiast` to keep filters simple.
- Projects & links: `projects[]` in the seed file. The Projects CTA uses `socials.github` (with a safe fallback to your GitHub URL).
- Certifications: `certifications[]` with `credentialUrl` to verified pages (Coursera, etc.).
- Contact recipient: set `MAIL_TO` in `.env` (or ensure `profile.email` is accurate in MongoDB).


## 19) Safety & Secrets

- Never commit `.env` with real credentials.
- Use provider secrets in production deploys.
- Keep dependencies up to date (`npm audit`) and upgrade with caution.

---

If you’d like, I can also generate a short CONTRIBUTING.md (coding style, commit message conventions) and a CHANGELOG template to make ongoing updates clearer.
