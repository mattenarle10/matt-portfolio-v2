# mattenarle-portfolio-v2

Personal portfolio for Matt Enarle — cloud engineer, MBA student, endurance athlete.
Live at [mattenarle.com](https://mattenarle.com).

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, and Bun.

## Features

- Next.js 16 with App Router and Turbopack
- React 19 + TypeScript with strict types
- Tailwind CSS v4 (zero-config via `@import`)
- Light/dark mode with cookie-persisted theme
- Framer Motion animations across the site
- Biome for linting and formatting
- Husky pre-commit hooks
- Bun as runtime, package manager, and dev server
- Vercel Analytics

### Pages

- `/` — Home with hero, recent Medium posts, latest Strava activity, and socials
- `/about` — Experience, education, certifications, hobbies, gallery
- `/projects` — Sortable project list with magnify-on-hover preview
- `/writing` — Full Medium post list with breadcrumb JSON-LD

### Integrations

- Medium RSS feed (Writing section + dedicated `/writing` page)
- Spotify Web API (recently played, top tracks)
- Strava API (latest activity, stats)
- Cal.com embed for scheduling
- Google Generative AI for the on-site chat assistant

### SEO

- Per-route metadata, OpenGraph, and Twitter Card tags
- JSON-LD: Person, WebSite (with SearchAction), SiteNavigationElement, BreadcrumbList
- Dynamic sitemap and robots
- Canonical URLs per page

## Project structure

```
src/
  app/
    about/                 — About route (layout + page)
    api/
      chat/                — Gemini-powered chat endpoint
      medium/              — Medium RSS parser
      spotify/             — Spotify token + tracks endpoints
      strava/              — Strava token + activities endpoints
    projects/              — Projects list route
    writing/               — Full Medium post list route
    favicon.ico
    globals.css
    layout.tsx             — Root layout, theme cookie, JSON-LD
    page.tsx               — Home
    robots.ts
    sitemap.ts
  components/
    about/                 — Experiences, education, certifications, gallery, hobbies
    chat/                  — Chat UI + provider
    context/               — Context-tagged components
    home/                  — Hello, Medium, Spotify, Strava, Socials
    layout/                — Navbar, mobile nav, footer
    ui/                    — Reusable primitives (FadeIn, ThemeToggle, SpotifyEmbed)
  constants/               — Project data, chat context, icons
  context/                 — Theme + global state providers
  hooks/                   — useIsMobile, useMediumPosts, useSpotify, useStrava (+ auth)
  lib/                     — Helpers (chat utilities, etc.)
  schemas/                 — Zod schemas
public/
  about/                   — About page imagery and certification badges
  projects/                — Project screenshots
  *.png                    — Logos, icons, OG images
  resume.pdf
```

## Getting started

```bash
bun install
cp .env.local.example .env.local   # fill in API credentials
bun run dev
```

Open [localhost:3000](http://localhost:3000).

### Scripts

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `bun run dev`       | Start dev server with Turbopack          |
| `bun run build`     | Production build                         |
| `bun run start`     | Start production server                  |
| `bun run lint`      | Biome check                              |
| `bun run lint:fix`  | Biome check + auto-fix                   |
| `bun run format`    | Biome format only                        |

### Environment variables

See `.env.local.example`. Spotify integration requires a refresh token; Strava and Google
Generative AI need their own keys configured for the chat and activity sections to render.

## Deploy

Auto-deploys to Vercel on push to `main`. Preview deployments are created for every PR.
