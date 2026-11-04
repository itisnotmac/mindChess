/**
 * Mind Chess — AI Proxy Server
 *
 * Exposes POST /api/chat and forwards to Anthropic Claude.
 * Handles two request shapes from aiClient.js:
 *   1. Single prompt:  { prompt: string, system?: string }
 *   2. Multi-turn:     { messages: [{role, content}], system?: string }
 *
 * Deploy anywhere Node runs: Railway, Render, Fly.io, your own VPS.
 * Set ANTHROPIC_API_KEY in the environment before starting.
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import Anthropic from '@anthropic-ai/sdk';

// ── Config ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-4-5'; // fast + cheap for in-game use
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS || '512', 10);

// CORS origins — Capacitor Android uses capacitor://localhost and http://localhost
// Add your production domain when you have one.
const ALLOWED_ORIGINS = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean)
  .concat([
    'capacitor://localhost',
    'http://localhost',
    'http://localhost:5173',  // Vite dev server
    'http://localhost:3000',
    'http://localhost:4173',  // Vite preview
  ]);

if (!ANTHROPIC_API_KEY) {
  console.error('❌  ANTHROPIC_API_KEY is not set. Set it in your environment or .env file.');
  process.exit(1);
}

// ── Anthropic client ──────────────────────────────────────────────────────────

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// ── Express setup ─────────────────────────────────────────────────────────────

const app = express();

app.use(express.json({ limit: '32kb' }));

app.use(cors({
  origin: (origin, cb) => {
    // Allow requests with no origin (e.g. curl, Capacitor native HTTP)
    if (!origin || ALLOWED_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`CORS: origin '${origin}' not allowed`));
  },
  methods: ['POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

// Rate limit: 60 requests per minute per IP
app.use('/api', rateLimit({
  windowMs: 60 * 1000,
  max: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests — slow down!' },
}));

// ── Health check ──────────────────────────────────────────────────────────────

app.get('/health', (_req, res) => res.json({ ok: true, model: MODEL }));

// ── POST /api/chat ────────────────────────────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, messages, system } = req.body;

    // Build the messages array for Anthropic
    let anthropicMessages;

    if (Array.isArray(messages) && messages.length > 0) {
      // Multi-turn path: validate and pass through
      anthropicMessages = messages
        .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .map(m => ({ role: m.role, content: m.content.slice(0, 4000) })); // cap individual messages
    } else if (typeof prompt === 'string' && prompt.trim()) {
      // Single-prompt path
      anthropicMessages = [{ role: 'user', content: prompt.slice(0, 4000) }];
    } else {
      return res.status(400).json({ error: 'Request must include either `prompt` (string) or `messages` (array).' });
    }

    if (anthropicMessages.length === 0) {
      return res.status(400).json({ error: 'No valid messages after filtering.' });
    }

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      ...(system ? { system: system.slice(0, 2000) } : {}),
      messages: anthropicMessages,
    });

    const content = response.content?.[0]?.text ?? '';
    return res.json({ content });

  } catch (err) {
    console.error('AI proxy error:', err?.message ?? err);

    // Surface Anthropic API errors clearly
    if (err?.status) {
      return res.status(err.status).json({ error: err.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅  Mind Chess AI proxy running on port ${PORT}`);
  console.log(`    Model : ${MODEL}`);
  console.log(`    Origins: ${ALLOWED_ORIGINS.join(', ')}`);
});
