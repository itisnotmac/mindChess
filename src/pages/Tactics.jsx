import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { storage } from '@/lib/storage';
import ChessBoard from '@/components/chess/ChessBoard';
import { createGame, makeMove, getFen, getTurn } from '@/lib/chessEngine';
import { playSound } from '@/lib/sound';
import { PUZZLES } from '@/lib/puzzles';
import { Brain, Flame, CheckCircle2, XCircle, Lightbulb, SkipForward, Loader2 } from 'lucide-react';
import ReadAloudButton from '@/components/ReadAloudButton';

export default function Tactics() {
  const [puzzle, setPuzzle] = useState(null);
  const [fen, setFen] = useState('');
  const [lastMove, setLastMove] = useState(null);
  const [status, setStatus] = useState('solving');
  const [streak, setStreak] = useState(0);
  const [solved, setSolved] = useState(0);
  const [explanation, setExplanation] = useState('');
  const [failed, setFailed] = useState(false);
  const [profile, setProfile] = useState(null);

  const game = useMemo(() => createGame(fen), [fen]);
  const orientation = puzzle ? (getTurn(createGame(puzzle.fen)) === 'w' ? 'white' : 'black') : 'white';

  useEffect(() => {
    setProfile(storage.getProfile());
    loadNewPuzzle();
  }, []);

  const loadNewPuzzle = useCallback(() => {
    const p = PUZZLES[Math.floor(Math.random() * PUZZLES.length)];
    setPuzzle(p);
    setFen(p.fen);
    setLastMove(null);
    setStatus('solving');
    setExplanation('');
    setFailed(false);
  }, []);

  const handleMove = (from, to, promotion) => {
    if (status !== 'solving') return false;
    const userMove = from + to;
    if (puzzle.solution_moves.includes(userMove)) {
      const g = createGame(fen);
      makeMove(g, from, to, promotion);
      setFen(g.fen());
      setLastMove({ from, to });
      playSound('correct');
      setStatus('correct');
      setSolved(s => s + 1);
      setStreak(s => s + 1);
      setExplanation(puzzle.explanation);
      {
        const updated = {
          ...profile,
          xp: (profile.xp || 0) + 10,
          puzzlesSolved: (profile.puzzlesSolved || 0) + 1,
        };
        storage.saveProfile(updated);
        setProfile(updated);
      }
      return true;
    } else {
      playSound('wrong');
      setFailed(true);
      setStreak(0);
      return false;
    }
  };

  if (!puzzle) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Tactics Trainer</h1>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 mb-3">
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5 teal-border-glow">
              <Flame className="w-4 h-4 text-[#FFB300]" />
              <span className="text-sm font-bold">Streak: {streak}</span>
            </div>
            <div className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5 teal-border-glow">
              <CheckCircle2 className="w-4 h-4 text-[#39FF14]" />
              <span className="text-sm font-bold">Solved: {solved}</span>
            </div>
            <div className="bg-card border border-border rounded-lg px-3 py-1.5 teal-border-glow">
              <span className="text-sm font-bold text-primary">Rating: {puzzle.rating}</span>
            </div>
          </div>
          <div className="w-full flex justify-center">
            <ChessBoard game={game} fen={fen} onMove={handleMove} orientation={orientation}
              interactive={status === 'solving'} lastMove={lastMove} movableColor={getTurn(createGame(puzzle.fen))} />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 teal-border-glow">
            <h3 className="font-bold mb-2 text-sm text-muted-foreground uppercase tracking-wide">Puzzle</h3>
            <p className="text-sm mb-1">{puzzle.description}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded font-medium uppercase">{puzzle.theme.replace(/_/g, ' ')}</span>
            </div>
          </div>

          {failed && status === 'solving' && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-5 h-5 text-destructive" />
                <span className="font-bold text-destructive">Not quite!</span>
              </div>
              <p className="text-xs text-muted-foreground">Streak reset. Try again or skip to the next puzzle.</p>
            </div>
          )}

          {status === 'correct' && (
            <div className="bg-[#39FF14]/10 border border-[#39FF14]/30 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#39FF14]" />
                  <span className="font-bold text-[#39FF14]">Correct!</span>
                </div>
                <ReadAloudButton text={explanation} />
              </div>
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-[#FFB300] mt-0.5 shrink-0" />
                <p className="text-xs text-foreground/90">{explanation}</p>
              </div>
            </div>
          )}

          <button onClick={loadNewPuzzle}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-all teal-glow-sm">
            <SkipForward className="w-4 h-4" /> {status === 'correct' ? 'Next Puzzle' : 'Skip Puzzle'}
          </button>
        </div>
      </div>
    </div>
  );
}