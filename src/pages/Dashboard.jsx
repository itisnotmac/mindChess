import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Crown, TrendingUp, Flame, Brain, Target, Gamepad2, BookOpen, Trophy, Zap } from 'lucide-react';

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
      }setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>);

  }

  const modules = [
  { to: '/play', icon: Gamepad2, title: 'Play vs AI', desc: '5 difficulty levels with live coaching', color: "text-[hsl(var(--chart-2))]" },
  { to: '/tactics', icon: Brain, title: 'Tactics Trainer', desc: 'Solve puzzles, build streaks, climb ratings', color: "text-[hsl(var(--chart-2))]" },
  { to: '/openings', icon: BookOpen, title: 'Opening Explorer', desc: 'Study & drill major openings', color: "text-[hsl(var(--chart-2))]" },
  { to: '/endgames', icon: Target, title: 'Endgame Lab', desc: 'Master critical endgame techniques', color: "text-[hsl(var(--chart-2))]" }];


  const stats = [
  { icon: TrendingUp, label: 'ELO Rating', value: profile?.elo || 1200, color: 'text-primary' },
  { icon: Flame, label: 'Puzzle Streak', value: profile?.puzzle_streak || 0, color: 'text-[#FFB300]' },
  { icon: Gamepad2, label: 'Games Played', value: profile?.total_games || 0, color: 'text-[#39FF14]' },
  { icon: Brain, label: 'Puzzles Solved', value: profile?.puzzles_solved || 0, color: 'text-[#FF4757]' }];


  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="mb-8 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary teal-text-glow flex items-center gap-3 mb-2">CHESS <Crown className="w-8 h-8 text-primary teal-text-glow" /> MIND</h1>
        <p className="text-sm text-primary teal-text-glow">From the team that brought you Reel Chess — Let's Chess!</p>
      </div>

      <div className="flex items-center justify-center gap-6 md:gap-8 mb-8">
        {stats.map((s, i) =>
        <div key={i} className="flex items-center gap-2">
            <s.icon className={`w-5 h-5 ${s.color}`} />
            <span className="text-xl font-bold">{s.value}</span>
          </div>
        )}
      </div>

      <h2 className="text-xl font-bold mb-4 text-primary teal-text-glow text-center">Training Modules</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {modules.map((m, i) =>
        <Link key={i} to={m.to} onClick={() => base44.analytics.track({ eventName: 'training_module_click', properties: { module: m.title } })} className="group flex flex-col items-center gap-2 p-2 transition-all">
            <div className={`p-4 rounded-full bg-card border border-border group-hover:border-primary/50 group-hover:teal-glow-sm transition-all`}>
              <m.icon className={`w-12 h-12 md:w-14 md:h-14 ${m.color} group-hover:scale-110 transition-transform`} />
            </div>
            <h3 className="text-xs md:text-sm font-bold text-center">{m.title}</h3>
          </Link>
        )}
      </div>

      {profile?.achievements && profile.achievements.length > 0 &&
      <>
          <h2 className="text-lg font-bold mb-4 text-foreground flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#FFB300]" /> Achievements
          </h2>
          <div className="flex flex-wrap gap-3">
            {profile.achievements.map((a, i) =>
          <div key={i} className="bg-card border border-[#FFB300]/30 rounded-lg px-4 py-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#FFB300]" />
                <span className="text-sm font-medium">{a}</span>
              </div>
          )}
          </div>
        </>
      }
    </div>);

}