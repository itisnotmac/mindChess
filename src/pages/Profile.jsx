import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Crown, TrendingUp, Flame, Brain, Gamepad2, Trophy, Target, BookOpen, Award } from 'lucide-react';

const ACHIEVEMENTS = [
  { name: 'First Steps', desc: 'Play your first game', icon: '🎮', condition: p => p.total_games >= 1 },
  { name: 'Tactician', desc: 'Solve 10 puzzles', icon: '🧠', condition: p => p.puzzles_solved >= 10 },
  { name: 'Streak Master', desc: '5 puzzle streak', icon: '🔥', condition: p => p.longest_streak >= 5 },
  { name: 'Opening Scholar', desc: 'Drill 5 openings', icon: '📖', condition: p => p.openings_drilled >= 5 },
  { name: 'Endgame Wizard', desc: 'Drill 3 endgames', icon: '🎯', condition: p => p.endgames_drilled >= 3 },
  { name: 'Victorious', desc: 'Win 5 games', icon: '👑', condition: p => p.games_won >= 5 },
  { name: 'Centurion', desc: 'Play 100 games', icon: '💯', condition: p => p.total_games >= 100 },
  { name: 'Rising Star', desc: 'Reach 1400 ELO', icon: '⭐', condition: p => p.elo >= 1400 },
];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const user = await base44.auth.me();
        const profiles = await base44.entities.UserProfile.filter({ created_by_id: user.id });
        if (profiles.length > 0) setProfile(profiles[0]);
        const games = await base44.entities.GameSession.filter({}, '-created_date', 10);
        setSessions(games);
      } catch (e) {}
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

  if (!profile) {
    return <div className="p-8 text-center text-muted-foreground">No profile found. Visit the dashboard first.</div>;
  }

  const chartData = (profile.elo_history || []).map((h, i) => ({ game: i + 1, rating: h.rating }));
  const winRate = profile.total_games > 0 ? Math.round((profile.games_won / profile.total_games) * 100) : 0;
  const puzzleAccuracy = profile.total_puzzles > 0 ? Math.round((profile.puzzles_solved / profile.total_puzzles) * 100) : 0;

  const stats = [
    { icon: TrendingUp, label: 'ELO Rating', value: profile.elo || 1200, color: 'text-primary' },
    { icon: Brain, label: 'Puzzle Rating', value: profile.puzzle_rating || 1200, color: 'text-[#39FF14]' },
    { icon: Flame, label: 'Longest Streak', value: profile.longest_streak || 0, color: 'text-[#FFB300]' },
    { icon: Target, label: 'Puzzle Accuracy', value: `${puzzleAccuracy}%`, color: 'text-destructive' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <Crown className="w-8 h-8 text-primary teal-text-glow" />
        <h1 className="text-3xl font-bold">Your Profile</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-4 teal-border-glow text-center">
            <s.icon className={`w-6 h-6 mx-auto mb-2 ${s.color}`} />
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6 mb-8 teal-border-glow">
        <h2 className="font-bold mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-primary" /> ELO Progression</h2>
        {chartData.length > 1 ? (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,229,204,0.1)" />
              <XAxis dataKey="game" stroke="rgba(255,255,255,0.3)" fontSize={12} />
              <YAxis stroke="rgba(255,255,255,0.3)" fontSize={12} domain={['dataMin - 50', 'dataMax + 50']} />
              <Tooltip contentStyle={{ background: 'hsl(var(--background))', border: '1px solid rgba(0,229,204,0.3)', borderRadius: '8px', fontSize: '12px' }} />
              <Line type="monotone" dataKey="rating" stroke="hsl(var(--ring))" strokeWidth={2} dot={{ fill: 'hsl(var(--ring))', r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-8">Play more games to see your ELO progression chart.</p>
        )}
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-card border border-border rounded-xl p-4 teal-border-glow text-center">
          <div className="text-3xl font-bold text-[#39FF14]">{profile.games_won || 0}</div>
          <div className="text-xs text-muted-foreground">Wins</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 teal-border-glow text-center">
          <div className="text-3xl font-bold text-destructive">{profile.games_lost || 0}</div>
          <div className="text-xs text-muted-foreground">Losses</div>
        </div>
        <div className="bg-card border border-border rounded-xl p-4 teal-border-glow text-center">
          <div className="text-3xl font-bold text-[#FFB300]">{profile.games_drawn || 0}</div>
          <div className="text-xs text-muted-foreground">Draws</div>
        </div>
      </div>

      <h2 className="font-bold mb-4 flex items-center gap-2"><Trophy className="w-5 h-5 text-[#FFB300]" /> Achievements</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {ACHIEVEMENTS.map((a, i) => {
          const earned = a.condition(profile);
          return (
            <div key={i} className={`rounded-xl p-4 border text-center transition-all
              ${earned ? 'bg-[#FFB300]/10 border-[#FFB300]/30 teal-glow-sm' : 'bg-card border-border opacity-50'}`}>
              <div className="text-3xl mb-2">{a.icon}</div>
              <div className="font-bold text-sm">{a.name}</div>
              <div className="text-xs text-muted-foreground mt-1">{a.desc}</div>
            </div>
          );
        })}
      </div>

      {sessions.length > 0 && (
        <>
          <h2 className="font-bold mb-4">Recent Games</h2>
          <div className="space-y-2">
            {sessions.map((s, i) => (
              <div key={i} className="flex items-center justify-between bg-card border border-border rounded-lg p-3 teal-border-glow">
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase
                    ${s.result === 'win' ? 'bg-[#39FF14]/10 text-[#39FF14]' : s.result === 'loss' ? 'bg-destructive/10 text-destructive' : 'bg-[#FFB300]/10 text-[#FFB300]'}`}>
                    {s.result}
                  </span>
                  <span className="text-sm text-muted-foreground capitalize">{s.ai_difficulty}</span>
                  <span className="text-sm text-muted-foreground capitalize">{s.player_color}</span>
                </div>
                <span className="text-xs text-muted-foreground">{s.moves?.length || 0} moves</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}