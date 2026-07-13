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

const MALE_NAMES = ['david', 'mark', 'george', 'daniel', 'alex', 'fred', 'thomas', 'james', 'arthur', 'oliver', 'aaron', 'tom', 'guy', 'eddy', 'reed', 'rishi', 'male'];
const FEMALE_NAMES = ['zira', 'susan', 'hazel', 'catherine', 'linda', 'heather', 'samantha', 'victoria', 'karen', 'moira', 'tessa', 'serena', 'fiona', 'veena', 'helena', 'martha', 'nina', 'female', 'aria', 'jenny', 'sara'];

export function guessGender(voice) {
  const name = (voice.name || '').toLowerCase();
  if (name.includes('female')) return 'Female';
  if (name.includes('male')) return 'Male';
  if (MALE_NAMES.some(n => name.includes(n))) return 'Male';
  if (FEMALE_NAMES.some(n => name.includes(n))) return 'Female';
  return 'Neutral';
}

export function getAccent(voice) {
  const lang = (voice.lang || '').toLowerCase();
  if (lang.startsWith('en-us')) return 'American';
  if (lang.startsWith('en-gb')) return 'British';
  if (lang.startsWith('en-au')) return 'Australian';
  if (lang.startsWith('en-in')) return 'Indian';
  if (lang.startsWith('en-ie')) return 'Irish';
  if (lang.startsWith('en-za')) return 'South African';
  if (lang.startsWith('en-nz')) return 'New Zealand';
  if (lang.startsWith('en-ca')) return 'Canadian';
  if (lang.startsWith('en')) return 'Other English';
  return lang.toUpperCase();
}

export function getAvailableVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  return voices.filter(v => (v.lang || '').toLowerCase().startsWith('en'));
}

export function speak(text, { onEnd, voiceURI } = {}) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return;
  }
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.95;
  utterance.pitch = 1;
  const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
  let selectedVoice = null;
  if (voiceURI) {
    selectedVoice = voices.find(v => v.voiceURI === voiceURI);
  }
  if (!selectedVoice && voices.length > 0) {
    selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith('en') && v.name.toLowerCase().includes('male'))
      || voices.find(v => v.lang.toLowerCase().startsWith('en'))
      || voices[0];
  }
  if (selectedVoice) utterance.voice = selectedVoice;
  if (onEnd) utterance.onend = () => onEnd();
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}