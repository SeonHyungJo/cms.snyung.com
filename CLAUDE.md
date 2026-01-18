# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A Content Management System (CMS) that uses Google Drive as its backend storage. Users authenticate via Google OAuth, browse their Drive files in a file tree, edit markdown files with Monaco Editor, and save changes back to Google Drive.

## Commands

```bash
pnpm dev      # Start development server at http://localhost:3000
pnpm build    # Build for production
pnpm lint     # Run ESLint
pnpm start    # Start production server
```

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5
- **UI**: Tailwind CSS 4, shadcn/ui (new-york style), Lucide icons
- **Editor**: Monaco Editor
- **State**: Zustand
- **Auth**: NextAuth.js with Google OAuth
- **Backend**: Google Drive API (googleapis)
- **Validation**: Zod

## Architecture

```
/src
├── /app                    # Next.js App Router
│   ├── /api                # API routes
│   │   ├── /auth/[...nextauth]  # NextAuth config
│   │   ├── /files          # List Drive files (GET ?folderId=)
│   │   ├── /read           # Read file content (GET ?fileId=)
│   │   └── /save           # Save file content (POST {fileId, content})
│   ├── /auth/signin        # Sign-in page
│   └── /editor             # Main editor interface
├── /components             # React components
│   ├── FileTree.tsx        # Drive file browser
│   ├── Providers.tsx       # Session & toast providers
│   └── /ui                 # shadcn primitives
├── /lib                    # Shared utilities
│   ├── auth.ts             # NextAuth config, token refresh
│   ├── google-drive.ts     # Drive API functions
│   ├── schema.ts           # Zod schemas
│   └── utils.ts            # Utility functions
└── /store
    └── useEditorStore.ts   # Editor state (file, content, dirty flag)
```

## Key Patterns

- All API routes require authentication via `getServerSession(authOptions)`
- Google access tokens are automatically refreshed when expired
- Client components use `"use client"` directive
- Path alias: `@/*` maps to `./src/*`
- UI strings are in Korean

## Environment Setup

Copy `.env.example` to `.env.local` and configure:
- `NEXTAUTH_URL` - App URL (http://localhost:3000 for dev)
- `NEXTAUTH_SECRET` - Random secret for NextAuth
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` - From Google Cloud Console (requires Drive API scopes)
