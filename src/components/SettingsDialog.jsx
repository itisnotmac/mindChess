import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from '@/components/ui/select';
import { useSettings } from '@/lib/SettingsContext';
import { Volume2, Play } from 'lucide-react';
import { getAvailableVoices, guessGender, getAccent, speak } from '@/lib/tts';

export default function SettingsDialog({ open, onClose }) {
  const { ttsEnabled, setTtsEnabled, voiceURI, setVoiceURI } = useSettings();
  const [voices, setVoices] = useState([]);

  useEffect(() => {
    if (open) {
      setVoices(getAvailableVoices());
    }
  }, [open]);

  const handlePreview = () => {
    speak("Hello! I'm your chess teacher. Let's learn together.", { voiceURI });
  };

  const grouped = {};
  voices.forEach(v => {
    const accent = getAccent(v);
    if (!grouped[accent]) grouped[accent] = [];
    grouped[accent].push(v);
  });

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border max-w-md">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your Chess Mind experience.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Text-to-Speech</p>
              <p className="text-xs text-muted-foreground">Read explanations aloud using your browser's built-in voice engine.</p>
            </div>
          </div>
          <Switch checked={ttsEnabled} onCheckedChange={setTtsEnabled} />
        </div>

        {ttsEnabled && (
          <div className="space-y-3 pb-2 border-t border-border pt-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">Teacher Voice</label>
              <p className="text-xs text-muted-foreground mb-2">Available voices depend on your browser and device.</p>
              {voices.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">No voices detected. Try reopening settings.</p>
              ) : (
                <Select value={voiceURI || 'auto'} onValueChange={(v) => setVoiceURI(v === 'auto' ? null : v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Default voice" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectItem value="auto">Default (auto-select)</SelectItem>
                    {Object.entries(grouped).map(([accent, vs]) => (
                      <SelectGroup key={accent}>
                        <SelectLabel>{accent}</SelectLabel>
                        {vs.map(v => (
                          <SelectItem key={v.voiceURI} value={v.voiceURI}>
                            {v.name} ({guessGender(v)})
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            <button onClick={handlePreview}
              className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg bg-secondary text-muted-foreground hover:text-foreground transition-all">
              <Play className="w-3.5 h-3.5" />
              <span>Preview voice</span>
            </button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}