# mattenarle.com

My personal portfolio.

Built with Next.js, React, TypeScript, Tailwind CSS, and Bun. It pulls in a few
things I care about: projects, writing, music, training, and a small chat helper.

## Run it

```bash
bun install
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

Spotify and Strava need their own credentials for the connected sections.

### OpenAI chat

The existing Ask Matt dialog uses the [OpenAI Responses API](https://developers.openai.com/api/docs/quickstart)
with `gpt-6-luna`. It sends Matt's public portfolio context and the last five
messages, checks questions and replies with moderation, caps replies at 350 tokens, and disables response storage with
`store: false`. This does not disable OpenAI's separate abuse-monitoring logs.

1. Check the receiving organization's credit grants in [API Platform billing](https://platform.openai.com/settings/organization/billing/overview).
   Eligible ChatGPT Pro and Business subscriptions can claim an
   [API credit benefit](https://help.openai.com/en/articles/20001626-api-credits-benefit-for-eligible-chatgpt-subscriptions).
   ChatGPT/Codex usage credits are a separate balance. Claimed monthly API credits
   expire at the end of the subscription billing cycle.
2. Create a project API key in the [API Platform](https://platform.openai.com/api-keys)
   and add it directly to your ignored `.env.local` file:

   ```dotenv
   OPENAI_API_KEY=your-project-api-key
   ```

3. Restart `bun run dev`. For Vercel, add `OPENAI_API_KEY` in the project's
   environment variables for the intended deployment environments, then redeploy.
   Open Ask Matt and ask a portfolio question to check the integration.

Keep the key server-only; never give it a `NEXT_PUBLIC_` prefix or commit it.
The app needs no ChatGPT login, Gemini key, agents, or vector database.
Without the key, the chat returns a temporary-unavailable response.
Request limits bound individual calls, not total spend. Check API project usage
and billing settings before making the endpoint public.

See [chat guardrails](docs/chat-guardrails.md) for the request flow, shared
knowledge sources, cache refresh intervals, evaluation cases, and limitations.
