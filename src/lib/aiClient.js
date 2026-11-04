/**
 * aiClient.js — thin wrapper for the AI proxy endpoint.
 * Replaces all base44.integrations.Core.InvokeLLM calls.
 */

const AI_BASE = import.meta.env.VITE_AI_API_URL ?? '';

/**
 * Send a prompt to the AI proxy and get a text response back.
 * @param {string} prompt - The user/game prompt
 * @param {string} [systemPrompt] - Optional system prompt override
 * @returns {Promise<string>} - The AI text response
 */
export async function invokeAI(prompt, systemPrompt) {
  const res = await fetch(`${AI_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, system: systemPrompt }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`AI request failed: ${err}`);
  }

  const data = await res.json();
  // Support both {content: "..."} and {result: "..."} shapes
  return data.content ?? data.result ?? '';
}

/**
 * Send a multi-turn conversation to the AI proxy.
 * @param {Array<{role: string, content: string}>} messages
 * @param {string} [systemPrompt]
 * @returns {Promise<string>}
 */
export async function invokeAIChat(messages, systemPrompt) {
  const res = await fetch(`${AI_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, system: systemPrompt }),
  });

  if (!res.ok) {
    const err = await res.text().catch(() => res.statusText);
    throw new Error(`AI request failed: ${err}`);
  }

  const data = await res.json();
  return data.content ?? data.result ?? '';
}
