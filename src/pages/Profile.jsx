import React, { useState, useEffect } from 'react';
import { storage } from '@/lib/storage';
import { Crown, Star, Brain, BookOpen } from 'lucide-react';
import ProfileStats from '@/components/ProfileStats';

export default function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setProfile(storage.getProfile());
  }, []);

  if (!profile) {
    return <div className="p-8 text-center text-muted-foreground">Loading profile...</div>;
  }

  const xp = profile.xp || 0;
  const level = profile.level || 1;
  const puzzlesSolved = profile.puzzlesSolved || 0;
  const lessonsCompleted = (profile.lessonsCompleted || []).length;

  // XP thresholds per level
  const LEVEL_XP = [0, 100, 300, 600, 1000];
  const nextLevelXp = LEVEL_XP[level] ?? null;
  const prevLevelXp = LEVEL_XP[level - 1] ?? 0;
  const xpIntoLevel = xp - prevLevelXp;
  const xpNeeded = nextLevelXp !== null ? nextLevelXp - prevLevelXp : null;
  const xpPercent = xpNeeded ? Math.min(100, Math.round((xpIntoLevel / xpNeeded) * 100)) : 100;

  const LEVEL_LABELS = ['', 'Beginner', 'Intermediate', 'Advanced', 'Expert', 'Master'];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Crown className="w-8 h-8 text-primary teal-text-glow" />
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </div>

      <ProfileStats profile={profile} className="mb-8" />

      {/* XP / Level card */}
      <div className="bg-card border border-border rounded-xl p-6 mb-8 teal-border-glow">
        <div className="flex items-center justify-between mb-3">
          <div>
            <span className="text-2xl font-bold text-primary">Level {level}</span>
            <span className="ml-2 text-muted-foreground">{LEVEL_LABELS[level] || ''}</span>
          </div>
          <div className="flex items-center gap-1 text-[#FFB300] font-bold">
            <Star className="w-4 h-4" />
            <span>{xp} XP</span>
          </div>
        </div>
        <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
          <div className="h-full bg-primary transition-all rounded-full" style={{ width: `${xpPercent}%` }} />
        </div>
        {xpNeeded !== null && (
          <p className="text-xs text-muted-foreground mt-2">{xpNeeded - xpIntoLevel} XP to level {level + 1}</p>
        )}
        {xpNeeded === null && (
          <p className="text-xs text-[#FFB300] mt-2 font-bold">Max level reached!</p>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4 teal-border-glow text-center">
          <div className="text-3xl font-bold text-primary">{level}</div>
          <div className="text-xs text-muted-foreground mt-1">Current Level</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 teal-border-glow text-center">
          <div className="text-3xl font-bold text-[#FFB300]">{xp}</div>
          <div className="text-xs text-muted-foreground mt-1">Total XP</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 teal-border-glow text-center">
          <Brain className="w-6 h-6 text-[#39FF14] mx-auto mb-1" />
          <div className="text-3xl font-bold text-[#39FF14]">{puzzlesSolved}</div>
          <div className="text-xs text-muted-foreground mt-1">Puzzles Solved</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 teal-border-glow text-center">
          <BookOpen className="w-6 h-6 text-[#FFB300] mx-auto mb-1" />
          <div className="text-3xl font-bold text-[#FFB300]">{lessonsCompleted}</div>
          <div className="text-xs text-muted-foreground mt-1">Lessons Done</div>
        </div>
      </div>
    </div>
  );
}
