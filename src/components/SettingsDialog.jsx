import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, SelectGroup, SelectLabel } from '@/components/ui/select';
import { useSettings } from '@/lib/SettingsContext';
import { Volume2, Play, Trash2 } from 'lucide-react';
import { getAvailableVoices, guessGender, getAccent, speak } from '@/lib/tts';
import { base44 } from '@/api/base44Client';
import {
  AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader,
  AlertDialogFooter, AlertDialogTitle, AlertDialogDescription, AlertDialogAction, AlertDialogCancel
} from '@/components/ui/alert-dialog';

export default function SettingsDialog({ open, onClose }) {
  const { ttsEnabled, setTtsEnabled, voiceURI, setVoiceURI } = useSettings();
  const [voices, setVoices] = useState([]);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await base44.functions.invoke('deleteAccount', {});
      await base44.auth.logout('/login');
    } catch (e) {
      setDeleting(false);
      alert('Could not delete your account: ' + (e?.message || 'unknown error'));
    }
  };

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

        <div className="border-t border-border pt-4 mt-4">
          <h3 className="text-sm font-bold text-destructive mb-1">Danger Zone</h3>
          <p className="text-xs text-muted-foreground mb-3">Permanently delete your account and all associated data. This cannot be undone.</p>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-destructive/40 text-destructive rounded-lg hover:bg-destructive/10 transition-all text-sm font-medium">
                <Trash2 className="w-4 h-4" /> Delete Account
              </button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-card border-destructive/30">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>This will permanently erase your profile, stats, and game history. This action cannot be undone.</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} disabled={deleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                  {deleting ? 'Deleting…' : 'Yes, delete my account'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </DialogContent>
    </Dialog>
  );
}