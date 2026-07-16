import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Link } from 'react-router-dom';
import { Crown, TrendingUp, Flame, Brain, Target, Gamepad2, BookOpen, Trophy, Zap, Loader2 } from 'lucide-react';
import IntroSequence from '@/components/IntroSequence';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [introDone, setIntroDone] = useState(() => {
    try { return sessionStorage.getItem('chessmind_intro_seen') === '1'; } catch { return false; }
  });

  const loadProfile = async () => {
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
  };

  useEffect(() => { loadProfile(); }, []);

  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);
  const pullRef = useRef(0);

  useEffect(() => {
    const main = document.querySelector('main');
    if (!main) return;
    const onTouchStart = (e) => {
      if (main.scrollTop <= 0 && !refreshing) {
        startY.current = e.touches[0].clientY;
        pulling.current = true;
      } else {
        pulling.current = false;
      }
    };
    const onTouchMove = (e) => {
      if (!pulling.current) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta <= 0) { setPull(0); pullRef.current = 0; return; }
      const v = Math.min(delta * 0.5, 80);
      setPull(v);
      pullRef.current = v;
      if (main.scrollTop <= 0) e.preventDefault();
    };
    const onTouchEnd = () => {
      if (!pulling.current) return;
      pulling.current = false;
      const triggered = pullRef.current > 60;
      setPull(0);
      pullRef.current = 0;
      if (triggered && !refreshing) {
        setRefreshing(true);
        loadProfile().finally(() => setRefreshing(false));
      }
    };
    main.addEventListener('touchstart', onTouchStart, { passive: true });
    main.addEventListener('touchmove', onTouchMove, { passive: false });
    main.addEventListener('touchend', onTouchEnd);
    return () => {
      main.removeEventListener('touchstart', onTouchStart);
      main.removeEventListener('touchmove', onTouchMove);
      main.removeEventListener('touchend', onTouchEnd);
    };
  }, [refreshing]);

  const loadingView = (
    <div className="flex items-center justify-center h-full">
      <div className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  );

  const modules = [
    { to: '/play', icon: Gamepad2, title: 'Play vs AI', desc: '5 difficulty levels with live coaching', color: 'text-primary' },
    { to: '/tactics', icon: Brain, title: 'Tactics Trainer', desc: 'Solve puzzles, build streaks, climb ratings', color: 'text-[#39FF14]' },
    { to: '/openings', icon: BookOpen, title: 'Opening Explorer', desc: 'Study & drill major openings', color: 'text-[#FFB300]' },
    { to: '/endgames', icon: Target, title: 'Endgame Lab', desc: 'Master critical endgame techniques', color: 'text-destructive' },
  ];

  const stats = [
    { icon: TrendingUp, label: 'ELO Rating', value: profile?.elo || 1200, color: 'text-primary' },
    { icon: Flame, label: 'Puzzle Streak', value: profile?.puzzle_streak || 0, color: 'text-[#FFB300]' },
    { icon: Gamepad2, label: 'Games Played', value: profile?.total_games || 0, color: 'text-[#39FF14]' },
    { icon: Brain, label: 'Puzzles Solved', value: profile?.puzzles_solved || 0, color: 'text-destructive' },
  ];

  const handleIntroDone = () => {
    try { sessionStorage.setItem('chessmind_intro_seen', '1'); } catch {}
    setIntroDone(true);
  };

  return (
    <>
    {!introDone && <IntroSequence onComplete={handleIntroDone} />}
    {loading ? loadingView : (
    <div className="p-6 md:p-8 max-w-6xl mx-auto">
      <div className="md:hidden flex items-center justify-center overflow-hidden transition-all duration-200" style={{ height: refreshing ? 48 : pull, opacity: pull > 0 || refreshing ? 1 : 0 }}>
        <Loader2 className={`w-6 h-6 text-primary ${refreshing ? 'animate-spin' : ''}`} style={{ transform: `rotate(${pull * 4}deg)` }} />
      </div>
      <div className="mb-8 flex flex-col items-center text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-primary teal-text-glow flex items-center gap-3 mb-2">MIND <Crown className="w-8 h-8 text-primary teal-text-glow" /> CHESS</h1>
        <p className="text-sm text-primary teal-text-glow">From the team that brought you Reel Chess — Let's Chess!</p>
      </div>

      <div className="flex items-center justify-center gap-6 md:gap-8 mb-8">
        {stats.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <s.icon className={`w-5 h-5 ${s.color}`} />
            <span className="text-xl font-bold">{s.value}</span>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-4 text-primary teal-text-glow text-center">Training Modules</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {modules.map((m, i) => (
          <Link key={i} to={m.to} onClick={() => base44.analytics.track({ eventName: 'training_module_click', properties: { module: m.title } })} className="group relative flex flex-col items-center gap-2 p-2 transition-all z-0 hover:z-10">
            <div className="group-hover:scale-[2] transition-transform duration-150">
              <m.icon className={`w-14 h-14 md:w-16 md:h-16 ${m.color} group-hover:animate-shake group-hover:teal-text-glow`} />
            </div>
            <h3 className="text-xs md:text-sm font-bold text-center">{m.title}</h3>
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
    )}
    </>
  );
}