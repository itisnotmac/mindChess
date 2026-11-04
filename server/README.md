# Mind Chess — AI Proxy Server

Thin Express server that sits between the Android app and the Anthropic API.
The app never holds your API key — only this server does.

## Local dev

```bash
cd server
cp .env.example .env
# edit .env and add your ANTHROPIC_API_KEY
npm install
npm run dev        # starts on http://localhost:3001 with auto-restart
```

The Vite dev server (`npm run dev` in the root) points to this via
`VITE_AI_API_URL=http://localhost:3001` in `../.env.local`.

## Deploy (pick one)

### Railway (easiest — free tier available)
1. Push this repo to GitHub (already done)
2. railway.app → New Project → Deploy from GitHub → select `itisnotmac/mindchess`
3. Set Root Directory: `server`
4. Add env var: `ANTHROPIC_API_KEY=sk-ant-...`
5. Done — Railway gives you a URL like `https://mindchess-proxy.up.railway.app`

### Render
1. render.com → New → Web Service → connect GitHub repo
2. Root directory: `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add env var: `ANTHROPIC_API_KEY`

### Fly.io
```bash
cd server
fly launch        # follow prompts
fly secrets set ANTHROPIC_API_KEY=sk-ant-...
fly deploy
```

## After deploying

Update `../.env.local` (dev) and your Capacitor build config with the live URL:

```
VITE_AI_API_URL=https://your-proxy-url.railway.app
```

For the Android production build, set this in `../capacitor.config.ts` or
pass it at build time via CI environment variables.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /health | Returns `{ok: true, model: "..."}` |
| POST | /api/chat | Main AI endpoint (see below) |

### POST /api/chat

Single prompt:
```json
{ "prompt": "What is the best response to 1.e4?", "system": "You are a chess coach." }
```

Multi-turn:
```json
{
  "messages": [
    { "role": "user", "content": "What is the Sicilian?" },
    { "role": "assistant", "content": "The Sicilian Defense is..." },
    { "role": "user", "content": "What are its main variations?" }
  ],
  "system": "You are a chess coach."
}
```

Response:
```json
{ "content": "The main Sicilian variations are..." }
```

## Cost estimate

Using `claude-haiku-4-5`:
- ~500 tokens per AI coach message (in + out)
- 1,000 messages/day ≈ **$0.13/day** ≈ **$4/month**
- Very manageable even at scale — add rate limiting or a token budget if needed
