import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Crown, TrendingUp, Flame, Brain, Target, Gamepad2, BookOpen, Trophy, Zap, ArrowRight } from 'lucide-react';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await base44.auth.me();
        const profiles = await base44.entities.UserProfile.filter({ created_by_id: user.id });
        if (profiles.length > 0) {
          setProfile(profiles[0]);
        } else {
          const np = await base44.entities.UserProfile.create({
            elo: 1200, puzzle_rating: 1200, puzzle_streak: 0, longest_streak: 0,
            total_games: 0, total_puzzles: 0, games_won: 0, games_lost: 0, games_drawn: 0,
            puzzles_solved: 0, puzzles_failed: 0, accuracy_avg: 0,
            openings_drilled: 0, endgames_drilled: 0, achievements: [], elo_history: [{ date: new Date().toISOString(), rating: 1200 }]
          });
          setProfile(np);
        }
      } catch (e) {
        // allow render without profile
      }
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  const modules = [
    { to: '/play', icon: Gamepad2, title: 'Play vs AI', desc: '5 difficulty levels with live coaching', color: 'text-primary' },
    { to: '/tactics', icon: Brain, title: 'Tactics Trainer', desc: 'Solve puzzles, build streaks, climb ratings', color: 'text-[#39FF14]' },
    { to: '/openings', icon: BookOpen, title: 'Opening Explorer', desc: 'Study & drill major openings', color: 'text-[#FFB300]' },
    { to: '/endgames', icon: Target, title: 'Endgame Lab', desc: 'Master critical endgame techniques', color: 'text-[#FF4757]' },
  ];

  const stats = [
    { icon: TrendingUp, label: 'ELO Rating', value: profile?.elo || 1200, color: 'text-primary' },
    { icon: Flame, label: 'Puzzle Streak', value: profile?.puzzle_streak || 0, color: 'text-[#FFB300]' },
    { icon: Gamepad2, label: 'Games Played', value: profile?.total_games || 0, color: 'text-[#39FF14]' },
    { icon: Brain, label: 'Puzzles Solved', value: profile?.puzzles_solved || 0, color: 'text-[#FF4757]' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Crown className="w-8 h-8 text-primary teal-text-glow" />
          <h1 className="text-3xl md:text-4xl font-bold text-primary teal-text-glow">Chess Mind</h1>
        </div>
        <p className="text-muted-foreground text-sm italic">From the team that brought you Reel Chess — Let's Chess!</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 teal-border-glow">
            <s.icon className={`w-5 h-5 mb-2 ${s.color}`} />
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-4 text-foreground">Training Modules</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {modules.map((m, i) => (
          <Link key={i} to={m.to} className="group bg-card border border-border rounded-xl p-6 hover:border-primary/40 transition-all teal-border-glow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <m.icon className={`w-8 h-8 mb-3 ${m.color}`} />
                <h3 className="text-lg font-bold mb-1">{m.title}</h3>
                <p className="text-sm text-muted-foreground">{m.desc}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </Link>
        ))}
      </div>

      {profile?.achievements && profile.achievements.length > 0 && (
        <>
          <h2 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FFB300]" /> Achievements
          </h2>
          <div className="flex flex-wrap gap-3">
            {profile.achievements.map((a, i) => (
              <div key={i} className="bg-card border border-[#FFB300]/30 rounded-lg px-4 py-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FFB300]" />
                <span className="text-sm font-medium">{a}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}