# 🚀 BlogForge

**Live Demo:** [https://blogforge.vercel.app](https://blogforge-pi.vercel.app)

A modern, full-stack blogging platform built to demonstrate proficiency in the MERN stack, secure authentication, and third-party API integration. Users can publish rich-text articles, manage cover images via Cloudinary, and leverage Google's Gemini AI to automatically generate content and relevant tags.

## ✨ Features

- **Secure Authentication:** User registration and login utilizing JWT (JSON Web Tokens) and bcrypt password hashing.
- **AI Integration:** Seamless connection to the Google Gemini API (v2.5) for automated blog post generation and smart tagging.
- **Media Management:** Direct image uploads and optimized delivery handled via Cloudinary.
- **Interactive UI:** Full CRUD functionality for posts, a liking/commenting system, and a system-wide dark mode toggle.
- **Responsive Design:** Fully responsive layout styled from scratch with Tailwind CSS.

## 🛠️ Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **External APIs:** Google Gemini AI, Cloudinary

## 🧠 Technical Challenges & Lessons Learned
During the development and deployment of this platform, I navigated several real-world engineering challenges:
- **API Deprecation & Upgrades:** Diagnosed `404 Not Found` errors in production by identifying a deprecated Gemini 1.5 model and refactoring the integration to support the current 2.5 API architecture.
- **Security & Git Hygiene:** Implemented industry-standard security protocols by rotating compromised API keys, surgically removing sensitive `.env` files from Git caching, and rewriting repository history to maintain a secure public codebase.
- **CORS & Multi-Environment Deployment:** Configured backend Cross-Origin Resource Sharing (CORS) to accept requests from local development environments while securely restricting production access to the live Vercel domain.

## 💻 Running it Locally

To run this project on your local machine, you will need Node.js 18+, a MongoDB Atlas account, a Cloudinary account, and a Google Gemini API key.

```bash
# Clone the repository
git clone [https://github.com/kshitijsandelya/blogforge.git](https://github.com/kshitijsandelya/blogforge.git)
cd blogforge

# Setup the Backend
cd server
cp .env.example .env
# Open .env and add your MongoDB, Cloudinary, and Gemini keys
npm install
npm run dev

# Setup the Frontend (in a new terminal)
cd client
cp .env.example .env
# Open .env and add your local backend URL (http://localhost:5000/api)
npm install
npm run dev
