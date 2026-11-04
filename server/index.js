/**
 * Mind Chess — AI Proxy Server
 *
 * Exposes POST /api/chat and forwards to an AI provider.
 * Handles two request shapes from aiClient.js:
 *   1. Single prompt:  { prompt: string, system?: string }
 *   2. Multi-turn:     { messages: [{role, content}], system?: string }
 *
 * Provider is controlled by the AI_PROVIDER env var:
 *   "gemini"    (default) — Google Gemini, free tier at ai.google.dev
 *   "anthropic"           — Anthropic Claude, swap when you have budget
 *
 * Deploy anywhere Node runs: Railway, Render, Fly.io, your own VPS.
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

// ── Config ────────────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 3001;
const PROVIDER = (process.env.AI_PROVIDER || 'gemini').toLowerCase();
const MAX_TOKENS = parseInt(process.env.MAX_TOKENS || '512', 10);

// Gemini config
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash'; // free tier, 1500 req/day

// Anthropic config (future upgrade path)
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const CLAUDE_MODEL = process.env.CLAUDE_MODEL || 'claude-haiku-4-5';

// CORS — Capacitor Android uses capacitor://localhost and http://localhost
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

// ── Validate config ───────────────────────────────────────────────────────────

if (PROVIDER === 'gemini' && !GEMINI_API_KEY) {
  console.error('❌  GEMINI_API_KEY is not set. Get a free key at https://ai.google.dev');
  process.exit(1);
}
if (PROVIDER === 'anthropic' && !ANTHROPIC_API_KEY) {
  console.error('❌  ANTHROPIC_API_KEY is not set.');
  process.exit(1);
}

// ── AI clients ────────────────────────────────────────────────────────────────

const geminiClient = GEMINI_API_KEY
  ? new GoogleGenerativeAI(GEMINI_API_KEY)
  : null;

const anthropicClient = ANTHROPIC_API_KEY
  ? new Anthropic({ apiKey: ANTHROPIC_API_KEY })
  : null;

// ── Express setup ─────────────────────────────────────────────────────────────

const app = express();

app.use(express.json({ limit: '32kb' }));

app.use(cors({
  origin: (origin, cb) => {
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

app.get('/health', (_req, res) => res.json({
  ok: true,
  provider: PROVIDER,
  model: PROVIDER === 'gemini' ? GEMINI_MODEL : CLAUDE_MODEL,
}));

// ── Gemini call ───────────────────────────────────────────────────────────────

async function callGemini(messages, system) {
  const model = geminiClient.getGenerativeModel({
    model: GEMINI_MODEL,
    ...(system ? { systemInstruction: system.slice(0, 2000) } : {}),
    generationConfig: { maxOutputTokens: MAX_TOKENS },
  });

  // Gemini uses {role: 'user'/'model', parts: [{text}]}
  // Map 'assistant' → 'model' for Gemini's format
  const history = messages.slice(0, -1).map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content.slice(0, 4000) }],
  }));

  const lastMessage = messages[messages.length - 1];
  const chat = model.startChat({ history });
  const result = await chat.sendMessage(lastMessage.content.slice(0, 4000));
  return result.response.text();
}

// ── Anthropic call ────────────────────────────────────────────────────────────

async function callAnthropic(messages, system) {
  const response = await anthropicClient.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: MAX_TOKENS,
    ...(system ? { system: system.slice(0, 2000) } : {}),
    messages,
  });
  return response.content?.[0]?.text ?? '';
}

// ── POST /api/chat ────────────────────────────────────────────────────────────

app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, messages, system } = req.body;

    // Normalise to messages array
    let normalised;
    if (Array.isArray(messages) && messages.length > 0) {
      normalised = messages
        .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
        .map(m => ({ role: m.role, content: m.content.slice(0, 4000) }));
    } else if (typeof prompt === 'string' && prompt.trim()) {
      normalised = [{ role: 'user', content: prompt.slice(0, 4000) }];
    } else {
      return res.status(400).json({ error: 'Request must include `prompt` (string) or `messages` (array).' });
    }

    if (normalised.length === 0) {
      return res.status(400).json({ error: 'No valid messages after filtering.' });
    }

    const content = PROVIDER === 'anthropic'
      ? await callAnthropic(normalised, system)
      : await callGemini(normalised, system);

    return res.json({ content });

  } catch (err) {
    console.error('AI proxy error:', err?.message ?? err);
    if (err?.status) return res.status(err.status).json({ error: err.message });
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// ── Start ─────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(`✅  Mind Chess AI proxy running on port ${PORT}`);
  console.log(`    Provider : ${PROVIDER}`);
  console.log(`    Model    : ${PROVIDER === 'gemini' ? GEMINI_MODEL : CLAUDE_MODEL}`);
  console.log(`    Origins  : ${ALLOWED_ORIGINS.join(', ')}`);
});
