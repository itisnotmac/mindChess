import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import ChessBoard from '@/components/chess/ChessBoard';
import { createGame, makeMove, getFen, getTurn, isCheckmate, isDraw, isStalemate, isCheck, isGameOver, getAIMoveAsync } from '@/lib/chessEngine';
import { playSound } from '@/lib/sound';
import { Gamepad2, RotateCcw, ArrowLeft, Bot, Loader2 } from 'lucide-react';

const DIFFICULTIES = [
  { value: 'beginner', label: 'Beginner', rating: 800, desc: 'Random moves' },
  { value: 'easy', label: 'Easy', rating: 1000, desc: '1-ply search' },
  { value: 'intermediate', label: 'Intermediate', rating: 1200, desc: '2-ply search' },
  { value: 'advanced', label: 'Advanced', rating: 1500, desc: '3-ply search' },
  { value: 'master', label: 'Master', rating: 1800, desc: '4-ply search' },
];

function calcElo(playerElo, aiElo, result) {
  const expected = 1 / (1 + Math.pow(10, (aiElo - playerElo) / 400));
  const score = result === 'win' ? 1 : result === 'draw' ? 0.5 : 0;
  return Math.round(playerElo + 32 * (score - expected));
}

export default function PlayVsAI() {
  const [phase, setPhase] = useState('setup');
  const [difficulty, setDifficulty] = useState('intermediate');
  const [playerColor, setPlayerColor] = useState('white');
  const [fen, setFen] = useState(createGame().fen());
  const [lastMove, setLastMove] = useState(null);
  const [moves, setMoves] = useState([]);
  const [isAIThinking, setIsAIThinking] = useState(false);
  const [commentary, setCommentary] = useState([]);
  const [gameResult, setGameResult] = useState(null);
  const [eloChange, setEloChange] = useState(0);
  const [profile, setProfile] = useState(null);

  const game = useMemo(() => createGame(fen), [fen]);
  const orientation = playerColor;
  const movableColor = playerColor === 'white' ? 'w' : 'b';

  useEffect(() => {
    (async () => {
      try {
        const user = await base44.auth.me();
        const profiles = await base44.entities.UserProfile.filter({ created_by_id: user.id });
        if (profiles.length > 0) setProfile(profiles[0]);
      } catch (e) {}
    })();
  }, []);

  const fetchCommentary = useCallback(async (currentFen, moveList, lastMoveSan) => {
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `You are a chess coach giving brief live commentary. Position FEN: ${currentFen}. Moves: ${moveList.join(' ')}. Last move: ${lastMoveSan}. Give a 1-2 sentence coaching insight. Be encouraging and specific. Do not use markdown.`,
      });
      setCommentary(prev => [...prev, { moveNum: moveList.length, text: response }]);
    } catch (e) {}
  }, []);

  const startGame = (diff, color) => {
    setDifficulty(diff);
    setPlayerColor(color);
    const g = createGame();
    setFen(g.fen());
    setMoves([]);
    setLastMove(null);
    setCommentary([]);
    setGameResult(null);
    setPhase('playing');
    if (color === 'black') {
      setTimeout(() => makeAIMove(g.fen(), diff, []), 500);
    }
  };

  const makeAIMove = async (currentFen, diff, currentMoves) => {
    setIsAIThinking(true);
    const g = createGame(currentFen);
    const aiMove = await getAIMoveAsync(g, diff);
    if (aiMove) {
      makeMove(g, aiMove.from, aiMove.to, aiMove.promotion);
      const newFen = g.fen();
      setFen(newFen);
      setLastMove({ from: aiMove.from, to: aiMove.to });
      setMoves(prev => [...prev, aiMove.san]);
      if (g.isCheckmate()) { playSound('checkmate'); handleGameOver(g, 'loss'); }
      else if (g.isDraw() || g.isStalemate()) { playSound('check'); handleGameOver(g, 'draw'); }
      else if (g.isCheck()) playSound('check');
      else if (aiMove.flags && (aiMove.flags.includes('c') || aiMove.flags.includes('e'))) playSound('capture');
      else playSound('move');
      fetchCommentary(newFen, [...currentMoves, aiMove.san], aiMove.san);
    }
    setIsAIThinking(false);
  };

  const handleGameOver = (g, result) => {
    setGameResult(result);
    setPhase('gameover');
    const aiElo = DIFFICULTIES.find(d => d.value === difficulty).rating;
    const playerElo = profile?.elo || 1200;
    const newElo = calcElo(playerElo, aiElo, result);
    setEloChange(newElo - playerElo);
    if (profile) {
      const updates = {
        total_games: (profile.total_games || 0) + 1,
        elo: newElo,
        elo_history: [...(profile.elo_history || []), { date: new Date().toISOString(), rating: newElo }],
      };
      if (result === 'win') updates.games_won = (profile.games_won || 0) + 1;
      else if (result === 'loss') updates.games_lost = (profile.games_lost || 0) + 1;
      else updates.games_drawn = (profile.games_drawn || 0) + 1;
      base44.entities.UserProfile.update(profile.id, updates).catch(() => {});
      setProfile({ ...profile, ...updates });
    }
    base44.entities.GameSession.create({
      moves: g.history(),
      result,
      ai_difficulty: difficulty,
      player_color: playerColor,
    }).catch(() => {});
  };

  const handleMove = (from, to, promotion) => {
    if (phase !== 'playing' || isAIThinking) return false;
    const g = createGame(fen);
    const move = makeMove(g, from, to, promotion);
    if (!move) return false;
    const newFen = g.fen();
    setFen(newFen);
    setLastMove({ from, to });
    const newMoves = [...moves, move.san];
    setMoves(newMoves);
    if (g.isCheckmate()) { playSound('checkmate'); handleGameOver(g, 'win'); }
    else if (g.isDraw() || g.isStalemate()) { playSound('check'); handleGameOver(g, 'draw'); }
    else if (g.isCheck()) playSound('check');
    else if (move.captured) playSound('capture');
    else playSound('move');
    fetchCommentary(newFen, newMoves, move.san);
    if (!g.isGameOver()) {
      setTimeout(() => makeAIMove(newFen, difficulty, newMoves), 300);
    }
    return true;
  };

  if (phase === 'setup') {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3 mb-8">
          <Gamepad2 className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Play vs AI</h1>
        </div>
        <h2 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wide">Difficulty</h2>
        <div className="space-y-2 mb-8">
          {DIFFICULTIES.map(d => (
            <button key={d.value} onClick={() => setDifficulty(d.value)}
              className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all
                ${difficulty === d.value ? 'border-primary bg-primary/10 teal-glow-sm' : 'border-border bg-card hover:border-primary/30'}`}>
              <div className="text-left">
                <div className="font-bold">{d.label}</div>
                <div className="text-xs text-muted-foreground">{d.desc}</div>
              </div>
              <span className="text-primary font-mono text-sm">{d.rating}</span>
            </button>
          ))}
        </div>
        <h2 className="text-sm font-bold text-muted-foreground mb-3 uppercase tracking-wide">Your Color</h2>
        <div className="grid grid-cols-2 gap-3 mb-8">
          {['white', 'black'].map(c => (
            <button key={c} onClick={() => setPlayerColor(c)}
              className={`p-6 rounded-lg border transition-all flex flex-col items-center gap-2
                ${playerColor === c ? 'border-primary bg-primary/10 teal-glow-sm' : 'border-border bg-card hover:border-primary/30'}`}>
              <div className={`w-12 h-12 rounded-full border-2 ${c === 'white' ? 'bg-white border-gray-300' : 'bg-card border-gray-600'}`} />
              <span className="font-medium capitalize">{c}</span>
            </button>
          ))}
        </div>
        <button onClick={() => startGame(difficulty, playerColor)}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all teal-glow">
          Start Game
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-3">
            <Bot className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              AI: {DIFFICULTIES.find(d => d.value === difficulty)?.label} ({DIFFICULTIES.find(d => d.value === difficulty)?.rating})
            </span>
            {isAIThinking && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
          </div>
          <div className="w-full flex justify-center">
            <ChessBoard game={game} fen={fen} onMove={handleMove} orientation={orientation}
              interactive={phase === 'playing' && !isAIThinking} lastMove={lastMove} movableColor={movableColor} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 teal-border-glow">
            <h3 className="font-bold mb-2 text-sm text-muted-foreground uppercase tracking-wide">Move History</h3>
            <div className="space-y-0.5 max-h-48 overflow-y-auto scrollbar-thin text-sm font-mono">
              {moves.length === 0 ? <p className="text-muted-foreground text-xs">No moves yet</p> : 
                moves.map((m, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-muted-foreground w-6">{Math.floor(i / 2) + 1}.{i % 2 === 0 ? '' : '..'}</span>
                    <span>{m}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-4 teal-border-glow">
            <h3 className="font-bold mb-2 text-sm text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary" /> Coach Commentary
            </h3>
            <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin">
              {commentary.length === 0 ? <p className="text-muted-foreground text-xs">Live commentary appears here as you play...</p> :
                commentary.map((c, i) => (
                  <p key={i} className="text-xs text-foreground/90 bg-secondary/50 rounded p-2">{c.text}</p>
                ))}
            </div>
          </div>

          {phase === 'playing' && (
            <button onClick={() => setPhase('setup')} className="w-full flex items-center justify-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground border border-border rounded-lg">
              <RotateCcw className="w-4 h-4" /> Resign
            </button>
          )}
        </div>
      </div>

      {phase === 'gameover' && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-primary/30 rounded-xl p-8 max-w-md w-full teal-glow text-center">
            <h2 className="text-3xl font-bold mb-2">
              {gameResult === 'win' ? <span className="text-[#39FF14]">Victory!</span> :
               gameResult === 'loss' ? <span className="text-destructive">Defeat</span> :
               <span className="text-[#FFB300]">Draw</span>}
            </h2>
            <p className="text-muted-foreground mb-4">
              {gameResult === 'win' ? 'You outplayed the AI!' : gameResult === 'loss' ? 'The AI got the better of you this time.' : 'A balanced fight.'}
            </p>
            {eloChange !== 0 && (
              <div className="mb-4">
                <span className="text-sm text-muted-foreground">ELO </span>
                <span className={`font-bold text-lg ${eloChange > 0 ? 'text-[#39FF14]' : 'text-destructive'}`}>
                  {eloChange > 0 ? '+' : ''}{eloChange}
                </span>
              </div>
            )}
            <div className="flex gap-3">
              <button onClick={() => startGame(difficulty, playerColor)}
                className="flex-1 bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all">
                Play Again
              </button>
              <button onClick={() => setPhase('setup')}
                className="flex-1 border border-border py-2.5 rounded-lg font-medium hover:bg-secondary transition-all">
                New Setup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}