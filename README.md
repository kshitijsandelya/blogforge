# BlogForge

A blog platform I built to practice the MERN stack. Users can write posts,
upload cover images, and use Gemini AI to generate content and tags.

## What it does

- Register/login with JWT auth
- Write and publish blog posts with cover image upload (Cloudinary)
- Generate post content and tags using the Gemini API
- Like posts, leave comments, toggle dark mode

## Stack

React + Vite, Node/Express, MongoDB, Tailwind CSS, Cloudinary, Gemini API

## Running it locally

You'll need Node 18+, a MongoDB Atlas account, Cloudinary account, and a Gemini API key.

```bash
# clone and install
git clone https://github.com/yourusername/blogforge
cd blogforge

cd server
cp .env.example .env
# fill in your keys in .env
npm install
npm run dev

# open a second terminal
cd client
cp .env.example .env
npm install
npm run dev
```

App runs at http://localhost:5173

## Env variables needed

See `server/.env.example` and `client/.env.example` for what's required.
Getting API keys:

- MongoDB: https://cloud.mongodb.com (free M0 cluster)
- Gemini: https://aistudio.google.com
- Cloudinary: dashboard at https://cloudinary.com
