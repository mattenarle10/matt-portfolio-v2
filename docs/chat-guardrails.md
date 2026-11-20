# How Ask Matt works

This is a small portfolio assistant, not an autonomous agent. It has no tools,
account access, database, or ability to send messages. The model receives public
reference data for each question; it does not learn from visitor conversations.

## The request path

1. **Validate.** Reject invalid JSON, unsupported roles, blank questions, and
   oversized requests before any OpenAI call. Questions are at most 1,000
   characters; history has at most five entries of 4,000 characters each.
2. **Check incoming text.** Send the question and every submitted history entry
   to `omni-moderation-latest`. A flagged result gets a fixed, portfolio-focused
   reply without paid generation. Missing or failed checks return an error.
3. **Load reference data.** Combine shared portfolio records with cached public
   GitHub activity and writing metadata. Each external source gets two seconds;
   an unavailable feed does not prevent answers about local records.
4. **Generate.** Give `gpt-6-luna` trusted behavior instructions separately from
   reference text and conversation history. Request a concise answer, cap output
   at 350 tokens, disable automatic retries, and set `store: false`.
5. **Check the reply.** Moderate the completed answer before displaying it. A
   flagged answer is replaced with the same fixed reply. An unavailable check
   never releases an unchecked answer.

One 20-second deadline covers server work and OpenAI calls. The browser allows
25 seconds, handles non-JSON error responses, and shows distinct invalid-input,
busy, timeout, and unavailable messages. Stop cancels the browser request; it
cannot guarantee that already-started provider work incurs no charge.

## Keeping the knowledge current

| Data | Edit or source | When chat sees updates |
| --- | --- | --- |
| Certifications, experience, education, volunteering | `src/constants/portfolio.ts` | After deployment |
| Projects | `src/constants/projects.ts` | After deployment |
| Bio, interests, skills, public contact | `src/constants/chat-context.ts` | After deployment |
| Three recent AWS contributions | Existing GitHub search | Request-driven hourly revalidation |
| Five recent writing entries | Existing Medium and AWS Builder Center fetchers | Request-driven 30-minute revalidation |

Pages and chat use the same project and About records. For example, changing a
certification title updates the card and the context together. The chat now
includes Pilly, marka.md, and BetterBacolod instead of an older copied project list.

Feed data is limited to titles, dates, summaries, known URLs, and contribution
statuses. Writing is sorted and deduplicated by URL. Chat skips image and article
body lookups. Revalidation is cache-based, not a scheduled sync: a cold source
may be unavailable and a cached source may briefly lag. The prompt describes
unavailable sources and tells the model not to claim it checked their latest data.

## What each guardrail teaches

- **Validation is enforced code.** A sixth history item is rejected even if the
  model would have accepted it. The client lock prevents accidental duplicate
  sends; it does not stop someone calling the public endpoint directly.
- **Grounding means supplying evidence.** The model should answer from portfolio
  records and admit missing details. It cannot infer a whole article from its title.
- **Instruction separation limits injection.** A feed title saying “ignore the
  rules” remains user-level reference text. Conversation history is also untrusted;
  a forged assistant message is not proof Matt earned a new credential.
- **Moderation checks harmful content.** It is not an off-topic detector, fact
  checker, secret scanner, or complete prompt-injection defense. For this narrow
  assistant we replace any flagged content; benign discussion may be flagged too.
- **Evaluation checks behavior.** Mock tests prove request handling and data
  boundaries. They do not prove a real model always follows instructions.

The model can still make mistakes. Prompt rules are guidance, not a security
boundary. Never place secrets in reference data or rely on instructions to hide
them. Replies remain plain text rather than executable HTML.

## Checks and costs

Run `bun test`, scoped Biome checks, and `bun --bun next build`. The automated
tests mock network requests and use no API credits.

Use `tests/fixtures/chat-evaluations.json` to review actual model behavior in a
local or preview environment with a securely configured API key. Check answers
against each expected behavior; record model/date and failures. Injection fixtures
include malicious history and sample feed text. Feed-injection behavior requires
a controlled test harness, not changing a real public feed. Do not count mocked
answers as a passing model evaluation. Live checks consume generation credits.

No new paid service, vector database, subscription, or traffic limiter is added.
The moderation endpoint is free; normal generation and existing hosting usage
still apply. Limits bound each request, not total spend. Visitors can make many
requests, and moderation outages make chat unavailable. API project budget alerts
are not an application-enforced spending cap.

Logs contain outcome, duration, and provider HTTP status only. Prompts, replies,
keys, and raw provider errors are not logged by this route. `store: false`
disables response retrieval storage; it does not disable OpenAI's separate abuse
monitoring. Chat history stays in page memory and clears on reload or New chat.

References: [OpenAI safety practices](https://developers.openai.com/api/docs/guides/safety-best-practices),
[moderation](https://developers.openai.com/api/docs/guides/moderation), and
[data controls](https://developers.openai.com/api/docs/guides/your-data).
