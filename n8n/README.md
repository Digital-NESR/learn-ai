# AI Verse Chat - n8n workflow

Backend for the AI Verse chat assistant. The site's `/api/chat` route (which
handles auth + rate limiting) forwards the conversation to this workflow's
webhook and returns its reply to the widget.

**Data contract**
- Request in: `{ "user": "<id>", "messages": [{ "role": "user" | "assistant", "content": "..." }] }`
- Response out: `{ "reply": "..." }`

## Flow

```
Chat Webhook → Prepare Request → Call LLM → Format Reply → Respond
```

- **Chat Webhook** - POST endpoint (`/webhook/aiverse-chat`), responds via the Respond node.
- **Prepare Request** - prepends the AI Verse system prompt, trims history to the last 20 turns, and builds an OpenAI-style body.
- **Call LLM** - HTTP POST to the chat-completions API.
- **Format Reply** - pulls the assistant text into `{ reply }`.
- **Respond** - returns `{ reply }` to the site.

## Setup

1. **Import** `aiverse-chat.workflow.json` into n8n (Workflows → ⋯ → Import from File).
2. **LLM credential** - on the **Call LLM** node, set Authentication = *Predefined Credential Type* → *Anthropic*, and attach your Anthropic API-key credential. (The Anthropic credential adds the `x-api-key` and `anthropic-version` headers for you.)
3. **Copy the webhook URL** - open **Chat Webhook**, copy the **Production URL**, and set it on the site:
   - `N8N_CHAT_WEBHOOK_URL=https://<your-n8n-host>/webhook/aiverse-chat`
4. **(Recommended) Lock the webhook** - set the webhook's **Authentication** to *Header Auth* and use the same secret you set as `N8N_CHAT_WEBHOOK_TOKEN` on the site. The site sends it as `Authorization: Bearer <token>`.
5. **Activate** the workflow.

That's it - the site's "Sign in with Microsoft"-style pattern applies here too: once `N8N_CHAT_WEBHOOK_URL` is set, the widget stops showing the "not connected yet" placeholder and starts returning real answers.

## Switching providers

The default is **Anthropic** (Claude Messages API) on **`claude-haiku-4-5-20251001`** - the
cheapest/fastest Claude, chosen to keep costs low. `system` is a top-level field, `messages`
are `user`/`assistant` only (the first must be `user`), and the reply is read from `content[0].text`.
Bump the model in *Prepare Request* to `claude-sonnet-5` if you want stronger answers.

To use a different provider:

- **OpenAI** - on *Call LLM*, set URL `https://api.openai.com/v1/chat/completions` and use an
  *HTTP Header Auth* credential (Name `Authorization`, Value `Bearer <key>`). In *Prepare Request*
  send `{ model: "gpt-4o-mini", messages: [{ role: "system", content: "<prompt>" }, ...] }`
  (system goes in the messages array). In *Format Reply* read `d.choices?.[0]?.message?.content`.
- **Azure OpenAI** - same as OpenAI but URL
  `https://<resource>.openai.azure.com/openai/deployments/<deployment>/chat/completions?api-version=2024-06-01`,
  credential header Name `api-key`, and drop `model` (the deployment defines it).

## Cost control

Three layers keep spend down:

1. **Model** - `claude-haiku-4-5-20251001` (cheapest Claude).
2. **Per-reply cap** - `max_tokens: 500` in *Prepare Request* caps output length per answer.
3. **Rate limits** - the site (`/api/chat`) enforces a per-user burst limit (`CHAT_RATE_LIMIT`/min)
   **and** a daily cap (`CHAT_DAILY_LIMIT`, default 100/day), plus trims history to the last 20 turns.

> **Hard guarantee:** the site limits are best-effort (in-memory, per instance). The only way to
> *guarantee* you never exceed a budget is to set a **spend limit in the Anthropic Console**
> (Billing → Usage limits / monthly budget). Do this before launch.

## Notes

- Rate limiting and authentication are enforced by the **site** (`/api/chat`), so the workflow stays simple. If you expose the webhook more broadly, enable Header Auth (step 4) and consider n8n-side limits too.
- Keep the system prompt (in *Prepare Request*) aligned with the course content so answers stay on-topic.
