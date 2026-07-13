let cachedVoices = [];

function loadVoices() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
}

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function speak(text, { onEnd } = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  if (voices.length > 0) {
    const preferred =
      voices.find(v => v.lang.startsWith('en') && v.name.toLowerCase().includes('male')) ||
      voices.find(v => v.lang.startsWith('en')) ||
      voices[0];
    utterance.voice = preferred;
  }
  if (onEnd) utterance.onend = () => onEnd();
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}