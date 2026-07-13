import React, { useState, useEffect } from 'react';
import { Volume2, Square } from 'lucide-react';
import { speak, stopSpeaking } from '@/lib/tts';
import { useSettings } from '@/lib/SettingsContext';

export default function ReadAloudButton({ text, className = '' }) {
  const { ttsEnabled } = useSettings();
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    stopSpeaking();
    setSpeaking(false);
  }, [text]);

  useEffect(() => {
    return () => stopSpeaking();
  }, []);

  if (!ttsEnabled) return null;

  const handleToggle = () => {
    if (speaking) {
      stopSpeaking();
      setSpeaking(false);
    } else {
      speak(text, { onEnd: () => setSpeaking(false) });
      setSpeaking(true);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-all shrink-0
        ${speaking ? 'bg-primary/20 text-primary teal-glow-sm' : 'bg-secondary text-muted-foreground hover:text-foreground'} ${className}`}
    >
      {speaking ? <Square className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      <span>{speaking ? 'Stop' : 'Read Aloud'}</span>
    </button>
  );
}