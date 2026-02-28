# ResumeAI Premium (Next.js)

Production-oriented AI Resume Builder SaaS built with Next.js App Router, TypeScript, Tailwind, Prisma, NextAuth, Zustand, Framer Motion, TipTap-ready editor structure, and React DnD.

## Setup

1. Install dependencies:
   - `npm install`
2. Configure env:
   - `cp .env.example .env`
3. Generate Prisma client:
   - `npm run prisma:generate`
4. Run migrations:
   - `npm run prisma:migrate`
5. Start dev server:
   - `npm run dev`

## Core Features

- Premium landing page and authenticated dashboard shell
- Resume management (create, duplicate, delete)
- Drag-and-drop block builder with inline JSON editing
- Live resume preview with template switching
- AI score panel (ATS/readability/impact mock)
- Job match optimizer mock
- GitHub import mock for project blocks
- Application tracker Kanban board (React DnD)
- Public resume route at `/u/[username]`
- Autosave indicator, version history, share link modal, command palette (`⌘K`)

## Structure

- `src/app`: routes, server actions, auth route
- `src/components`: UI kit, dashboard, editor, AI, resume views
- `src/lib`: auth, prisma, templates, helpers
- `src/store`: Zustand store for builder state
- `prisma/schema.prisma`: database schema
