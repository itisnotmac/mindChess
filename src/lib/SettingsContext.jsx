import React, { createContext, useContext, useState, useEffect } from 'react';

const SettingsContext = createContext({ ttsEnabled: true, setTtsEnabled: () => {} });

export function SettingsProvider({ children }) {
  const [ttsEnabled, setTtsEnabled] = useState(() => {
    try {
      return localStorage.getItem('chessmind_tts') !== 'false';
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('chessmind_tts', String(ttsEnabled));
    } catch {}
  }, [ttsEnabled]);

  return (
    <SettingsContext.Provider value={{ ttsEnabled, setTtsEnabled }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}