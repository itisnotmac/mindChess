import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const CONTACT_EMAIL = 'mindchessgame@gmail.com';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill out all fields.');
      return;
    }
    setError('');
    base44.analytics.track({ eventName: 'contact_form_submit', properties: { length: message.length } });
    const subject = encodeURIComponent(`Chess Mind contact from ${name}`);
    const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-8 h-8 text-primary teal-text-glow" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary teal-text-glow">Contact Us</h1>
      </div>

      <p className="text-foreground/90 leading-relaxed mb-6">
        Questions, feedback, or found a puzzle you love? We would love to hear from you. Send us a message
        using the form below and your email app will open, or reach us directly at the address listed.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 teal-border-glow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center teal-glow-sm">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Email</div>
            <a href={`mailto:${CONTACT_EMAIL}`} className="text-primary font-medium hover:underline">
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-4 bg-card border border-border rounded-xl p-5 teal-border-glow">
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide">Name</label>
          <input value={name} onChange={e => setName(e.target.value)}
            className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary teal-border-glow"
            placeholder="Your name" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide">Email</label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary teal-border-glow"
            placeholder="you@example.com" />
        </div>
        <div>
          <label className="text-xs text-muted-foreground uppercase tracking-wide">Message</label>
          <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
            className="w-full mt-1 bg-background border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary teal-border-glow resize-none"
            placeholder="What's on your mind?" />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <button type="submit"
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all teal-glow-sm">
          <Send className="w-4 h-4" /> Send Message
        </button>
        <p className="text-xs text-muted-foreground text-center">
          Submitting opens your email app addressed to {CONTACT_EMAIL}.
        </p>
      </form>
    </div>
  );
}