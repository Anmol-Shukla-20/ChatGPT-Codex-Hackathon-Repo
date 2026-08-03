# ChatGPT-Codex-Hackathon-Repo

This repository contains **BharatSetu AI**, an AI-powered platform for government scheme discovery, profile-based recommendations, document upload and OCR-assisted autofill, and a scheme guidance chatbot.

## Tech Stack
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Next.js API Routes
- Supabase PostgreSQL
- Supabase Storage
- Supabase Auth
- Grok xAI API
- Vercel

## Local Development
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Lint
```bash
npm run lint
```

## Deployment Notes
- Do not commit `.env` or any secret files.
- Use Vercel environment variables for Supabase and Grok keys.
- Keep the `documents` storage bucket configured in Supabase.
