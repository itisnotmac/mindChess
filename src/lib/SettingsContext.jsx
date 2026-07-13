import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext({ ttsEnabled: true, setTtsEnabled: () => {}, voiceURI: null, setVoiceURI: () => {} });

export function SettingsProvider({ children }) {
  const [ttsEnabled, setTtsEnabled] = useState(() => {
    try {
      return localStorage.getItem('chessmind_tts') !== 'false';
    } catch {
      return true;
    }
  });

  const [voiceURI, setVoiceURI] = useState(() => {
    try {
      return localStorage.getItem('chessmind_voice') || null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('chessmind_tts', String(ttsEnabled));
    } catch {}
  }, [ttsEnabled]);

  useEffect(() => {
    try {
      if (voiceURI) localStorage.setItem('chessmind_voice', voiceURI);
      else localStorage.removeItem('chessmind_voice');
    } catch {}
  }, [voiceURI]);

  return (
    <SettingsContext.Provider value={{ ttsEnabled, setTtsEnabled, voiceURI, setVoiceURI }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}