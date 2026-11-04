/**
 * LevelGate — renders children when the player has unlocked a tag,
 * otherwise shows a lock badge with the required level.
 *
 * Usage:
 *   <LevelGate xp={profile.xp} tag="ai_intermediate" requiredLevel={5}>
 *     <SomePremiumContent />
 *   </LevelGate>
 *
 * Or as a wrapper for a button/card where you just want the lock overlay:
 *   <LevelGate xp={xp} tag="tactics_hard" requiredLevel={4} lockStyle="overlay">
 *     <TacticsCard />
 *   </LevelGate>
 */

import { Lock } from 'lucide-react';
import { canAccess, LEVELS } from '@/lib/progression';

export default function LevelGate({ xp = 0, tag, requiredLevel, children, lockStyle = 'replace' }) {
  const unlocked = tag ? canAccess(xp, tag) : true;

  if (unlocked) return children;

  // Find the level that unlocks this tag if not explicitly provided
  const reqLevel = requiredLevel ?? LEVELS.find(l => l.unlocks.includes(tag))?.level ?? '?';

  if (lockStyle === 'overlay') {
    return (
      <div className="relative">
        <div className="pointer-events-none opacity-40 select-none">{children}</div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 rounded-lg backdrop-blur-[2px]">
          <Lock className="w-6 h-6 text-muted-foreground mb-1" />
          <span className="text-xs font-semibold text-muted-foreground">Level {reqLevel}</span>
        </div>
      </div>
    );
  }

  // lockStyle === 'replace' — swap the whole thing for a lock card
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-lg border border-border bg-secondary/40 text-muted-foreground opacity-70 cursor-not-allowed">
      <Lock className="w-4 h-4 shrink-0" />
      <span className="text-sm">Unlocks at Level {reqLevel}</span>
    </div>
  );
}
