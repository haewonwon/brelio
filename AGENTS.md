# AGENTS.md

## Project Overview

This project is an economy news reading tracker.

Users can:
- view economy news articles
- read summaries
- open original article links
- write personal thoughts
- track daily completion

## Tech Stack

Frontend:
- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS
- Axios

Backend:
- Node.js
- Express
- TypeScript
- Prisma
- PostgreSQL
- JWT
- bcrypt

Infra:
- Docker
- Docker Compose
- GCP Cloud Run

## Rules

- Use TypeScript.
- Keep the structure simple.
- Do not use Supabase.
- Separate frontend and backend.
- Use REST API.
- Use async/await.
- Do not hardcode secrets.
- Use environment variables.
- Prefix event handlers with `handle`.
- Do not implement all features at once.
- Before changing many files, explain the plan first.

## Implementation Order

1. Initial project setup
2. Docker Compose
3. PostgreSQL + Prisma
4. Express server
5. Article API
6. Frontend article list
7. Article detail
8. Notes
9. Daily tracking
10. Crawling
11. Auth
12. Deployment