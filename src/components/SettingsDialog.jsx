import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { useSettings } from '@/lib/SettingsContext';
import { Volume2 } from 'lucide-react';

export default function SettingsDialog({ open, onClose }) {
  const { ttsEnabled, setTtsEnabled } = useSettings();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-card border-border">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Customize your Chess Mind experience.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-medium text-sm">Text-to-Speech</p>
              <p className="text-xs text-muted-foreground max-w-xs">Read explanations aloud using your browser's built-in voice engine. No credits used.</p>
            </div>
          </div>
          <Switch checked={ttsEnabled} onCheckedChange={setTtsEnabled} />
        </div>
      </DialogContent>
    </Dialog>
  );
}