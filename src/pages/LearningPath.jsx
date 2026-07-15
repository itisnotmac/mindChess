import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { STAGES, MODULES, levelFromXp } from '@/lib/learningPath';
import { GraduationCap, Check, Lock, ArrowRight, Loader2, Star } from 'lucide-react';

const MODULE_ICON = {
  play: '♟', tactics: '♞', openings: '♜', endgames: '♛', library: '♚', analyze: '♗',
};

export default function LearningPath() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const user = await base44.auth.me();
        const profiles = await base44.entities.UserProfile.filter({ created_by_id: user.id });
        if (profiles.length > 0) setProfile(profiles[0]);
      } catch (e) {}
      setLoading(false);
    })();
  }, []);

  const completed = useMemo(() => new Set(profile?.completed_lessons || []), [profile]);
  const totalLessons = useMemo(() => STAGES.reduce((n, s) => n + s.lessons.length, 0), []);
  const doneCount = [...completed].filter(id => STAGES.some(s => s.lessons.some(l => l.id === id))).length;
  const progress = totalLessons ? Math.round((doneCount / totalLessons) * 100) : 0;
  const xp = profile?.path_xp || 0;
  const { level, title, into, need } = levelFromXp(xp);

  const stageComplete = (stage) => stage.lessons.every(l => completed.has(l.id));
  const stageLocked = (idx) => idx > 0 && !stageComplete(STAGES[idx - 1]);

  const toggle = async (lesson) => {
    if (!profile) return;
    const isDone = completed.has(lesson.id);
    const next = new Set(completed);
    let newXp = xp;
    if (isDone) { next.delete(lesson.id); newXp -= lesson.xp; }
    else { next.add(lesson.id); newXp += lesson.xp; }
    const updates = { completed_lessons: [...next], path_xp: Math.max(0, newXp) };
    setSaving(lesson.id);
    setProfile({ ...profile, ...updates });
    try {
      await base44.entities.UserProfile.update(profile.id, updates);
      base44.analytics.track({ eventName: 'lesson_toggle', properties: { lesson: lesson.id, done: !isDone } });
    } catch (e) {
      setProfile(profile);
    }
    setSaving(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-32">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-1">
        <GraduationCap className="w-8 h-8 text-primary teal-text-glow" />
        <h1 className="text-3xl font-bold">Learning Path</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6">
        A guided curriculum from your first game to tournament-ready play. Each lesson sends you to
        the right tool — mark it complete to earn XP and unlock the next stage.
      </p>

      <div className="bg-card border border-border rounded-xl p-5 mb-6 teal-border-glow flex flex-col sm:flex-row items-center gap-6">
        <ProgressRing percent={progress} />
        <div className="flex-1 w-full">
          <div className="flex items-center justify-between mb-1">
            <span className="font-bold text-lg">Level {level} · {title}</span>
            <span className="text-xs text-muted-foreground">{doneCount}/{totalLessons} lessons</span>
          </div>
          <div className="w-full h-2 bg-secondary rounded-full overflow-hidden mb-3">
            <div className="h-full bg-primary transition-all" style={{ width: `${(into / need) * 100}%` }} />
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Star className="w-4 h-4 text-[#FFB300]" />
            <span className="font-bold text-primary">{xp} XP</span>
            <span className="text-muted-foreground">· {need - into} XP to level {level + 1}</span>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        {STAGES.map((stage, idx) => {
          const locked = stageLocked(idx);
          const sCount = stage.lessons.filter(l => completed.has(l.id)).length;
          return (
            <div key={stage.id} className={`rounded-xl border ${locked ? 'border-border opacity-60' : 'border-border teal-border-glow'} bg-card overflow-hidden`}>
              <div className="flex items-center justify-between p-4 border-b border-border">
                <div>
                  <h2 className="font-bold text-lg flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-sm font-bold">{idx + 1}</span>
                    {stage.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1 ml-9">{stage.subtitle}</p>
                </div>
                {locked ? (
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><Lock className="w-4 h-4" /> Locked</span>
                ) : (
                  <span className="text-xs text-muted-foreground">{sCount}/{stage.lessons.length}</span>
                )}
              </div>
              {!locked && (
                <div className="divide-y divide-border">
                  {stage.lessons.map(lesson => {
                    const done = completed.has(lesson.id);
                    const mod = MODULES[lesson.module];
                    return (
                      <div key={lesson.id} className="p-4 flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-secondary/60 flex items-center justify-center text-lg shrink-0" title={mod.label}>
                          {MODULE_ICON[lesson.module]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold">{lesson.title}</h3>
                            <span className={`text-[10px] font-bold uppercase ${mod.color}`}>{mod.label}</span>
                            <span className="ml-auto text-xs text-[#FFB300] font-bold flex items-center gap-0.5"><Star className="w-3 h-3" />{lesson.xp}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{lesson.concept}</p>
                          <p className="text-sm text-foreground/90 mt-1.5">{lesson.task}</p>
                        </div>
                        <div className="flex flex-col items-center gap-2 shrink-0">
                          <Link to={lesson.to} className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border border-primary/40 text-primary hover:bg-primary/10 transition-all whitespace-nowrap">
                            Start <ArrowRight className="w-3 h-3" />
                          </Link>
                          <button onClick={() => toggle(lesson)} disabled={saving === lesson.id}
                            className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg font-medium transition-all
                              ${done ? 'bg-[#39FF14]/15 text-[#39FF14] border border-[#39FF14]/30' : 'border border-border text-muted-foreground hover:text-foreground'}`}>
                            {saving === lesson.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            {done ? 'Done' : 'Mark done'}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressRing({ percent }) {
  const r = 34, c = 2 * Math.PI * r;
  return (
    <div className="relative w-20 h-20 shrink-0">
      <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} fill="none" stroke="hsl(var(--secondary))" strokeWidth="6" />
        <circle cx="40" cy="40" r={r} fill="none" stroke="hsl(var(--primary))" strokeWidth="6" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (percent / 100) * c} className="transition-all" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-bold text-primary">{percent}%</div>
    </div>
  );
}