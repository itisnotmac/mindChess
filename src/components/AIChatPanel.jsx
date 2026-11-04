import React, { useState, useRef, useEffect } from 'react';
import { invokeAIChat } from '@/lib/aiClient';
import { X, Send, Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SYSTEM_PROMPT = `You are Mind Chess, an elite AI chess coach with encyclopedic knowledge of ALL things chess. You ONLY discuss chess-related topics: openings, middlegame strategy, endgames, tactics, famous games, players, tournament preparation, chess history, rules, notation, and chess culture. If asked about ANYTHING non-chess, politely deflect with wit and a chess-themed response like "That's not really my terrain — but I could talk all day about the Sicilian Najdorf! Ask me something chess-related." Be enthusiastic, encouraging, and expert-level. Use proper chess notation (e.g., 1.e4 e5 2.Nf3 Nc6). Keep responses concise but thorough. You are part of the Mind Chess family, a companion to Reel Chess.`;

export default function AIChatPanel({ open, onClose }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey! I'm your Mind Chess coach ♟️ Ask me anything — openings, tactics, endgames, famous games, strategy... I live and breathe chess. What's on your mind?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const send = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    try {
      const chatMessages = [...messages, { role: 'user', content: userMsg }].map(m => ({
        role: m.role,
        content: m.content,
      }));
      const response = await invokeAIChat(chatMessages, SYSTEM_PROMPT);
      setMessages(prev => [...prev, { role: 'assistant', content: response || 'Let me think about that...' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Hmm, I had trouble processing that. Let's try again — ask me something about chess!" }]);
    }
    setLoading(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-md bg-card border-l border-primary/20 flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center teal-glow-sm">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-primary">The Chess god</h3>
              <p className="text-xs text-muted-foreground italic">definitely knows more than you about chess</p>
            </div>
          </div>
          <button onClick={onClose} className="w-11 h-11 flex items-center justify-center text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
          {messages.map((msg, i) => (
            <div key={i} className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
              <div className={`max-w-[85%] rounded-lg px-3 py-2 ${msg.role === 'user' ? 'bg-primary/20 text-foreground' : 'bg-secondary text-foreground'}`}>
                {msg.role === 'assistant'
                  ? <div className="text-sm space-y-1 [&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-4 [&_ol]:list-decimal [&_ol]:pl-4 [&_strong]:font-bold [&_code]:bg-background [&_code]:px-1 [&_code]:rounded [&_h1]:font-bold [&_h1]:text-base [&_h2]:font-bold [&_h2]:text-base">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  : <p className="text-sm">{msg.content}</p>}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-secondary rounded-lg px-4 py-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask about chess..."
              className="flex-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary teal-border-glow"
            />
            <button onClick={send} disabled={loading || !input.trim()}
              className="bg-primary text-primary-foreground rounded-lg px-3 py-2 disabled:opacity-50 teal-glow-sm">
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}