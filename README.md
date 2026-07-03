# mattenarle.com

My personal portfolio.

Built with Next.js, React, TypeScript, Tailwind CSS, and Bun. It pulls in a few
things I care about: projects, writing, music, training, and a small chat helper.

## Run it

```bash
bun install
cp .env.local.example .env.local
bun run dev
```

Open [localhost:3000](http://localhost:3000).

## Commands

| Script              | Description                              |
| ------------------- | ---------------------------------------- |
| `bun run dev`       | Start dev server with Turbopack          |
| `bun run build`     | Production build                         |
| `bun run start`     | Start production server                  |
| `bun run lint`      | Biome check                              |
| `bun run lint:fix`  | Biome check + auto-fix                   |
| `bun run format`    | Biome format only                        |

## Env

See `.env.local.example`.

Spotify, Strava, Medium, and Google Generative AI need their own keys for the
connected sections to render.
