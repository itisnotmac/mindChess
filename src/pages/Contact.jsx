import React, { useState } from 'react';
import { Mail, MessageSquare, Send, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill out all fields.');
      return;
    }
    setSending(true);
    setError('');
    base44.analytics.track({ eventName: 'contact_form_submit', properties: { length: message.length } });
    try {
      await base44.integrations.Core.SendEmail({
        to: 'support@chessmind.app',
        subject: `Chess Mind contact from ${name}`,
        body: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      });
      setSent(true);
    } catch (err) {
      setError('Something went wrong sending your message. Please try again or email us directly.');
    }
    setSending(false);
  };

  return (
    <div className="p-6 md:p-10 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Mail className="w-8 h-8 text-primary teal-text-glow" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary teal-text-glow">Contact Us</h1>
      </div>

      <p className="text-foreground/90 leading-relaxed mb-6">
        Questions, feedback, or found a puzzle you love? We would love to hear from you. Send us a message
        using the form below and we will get back to you as soon as we can.
      </p>

      <div className="bg-card border border-border rounded-xl p-4 mb-6 teal-border-glow">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center teal-glow-sm">
            <Mail className="w-5 h-5 text-primary" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">Email</div>
            <a href="mailto:support@chessmind.app" className="text-primary font-medium hover:underline">
              support@chessmind.app
            </a>
          </div>
        </div>
      </div>

      {sent ? (
        <div className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center">
          <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="font-bold text-primary">Thanks for reaching out!</p>
          <p className="text-sm text-muted-foreground mt-1">Your message has been sent. We will be in touch soon.</p>
        </div>
      ) : (
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
          <button type="submit" disabled={sending}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all teal-glow-sm disabled:opacity-50">
            {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {sending ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
}