import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ChessBoard from '@/components/chess/ChessBoard';
import { createGame, makeSanMove } from '@/lib/chessEngine';
import { MASTER_GAMES, CATEGORIES } from '@/lib/masterGames';
import { ChevronLeft, ChevronRight, RotateCcw, Play, Pause, ArrowLeft, BookOpen } from 'lucide-react';
import ReadAloudButton from '@/components/ReadAloudButton';

export default function GameDetail() {
  const { id } = useParams();
  const game = MASTER_GAMES.find(g => g.id === id);
  const [moveIndex, setMoveIndex] = useState(0);
  const [autoPlay, setAutoPlay] = useState(false);

  useEffect(() => {
    setMoveIndex(0);
    setAutoPlay(false);
  }, [id]);

  const fen = useMemo(() => {
    if (!game) return createGame().fen();
    const g = createGame();
    for (let i = 0; i < moveIndex; i++) makeSanMove(g, game.moves[i]);
    return g.fen();
  }, [moveIndex, game]);

  const boardGame = useMemo(() => createGame(fen), [fen]);

  const lastMove = useMemo(() => {
    if (!game || moveIndex === 0) return null;
    const g = createGame();
    for (let i = 0; i < moveIndex - 1; i++) makeSanMove(g, game.moves[i]);
    makeSanMove(g, game.moves[moveIndex - 1]);
    const verbose = g.history({ verbose: true });
    const last = verbose[verbose.length - 1];
    return last ? { from: last.from, to: last.to } : null;
  }, [moveIndex, game]);

  useEffect(() => {
    if (autoPlay && game && moveIndex < game.moves.length) {
      const timer = setTimeout(() => setMoveIndex(i => i + 1), 1300);
      return () => clearTimeout(timer);
    }
    if (autoPlay && game && moveIndex >= game.moves.length) setAutoPlay(false);
  }, [autoPlay, moveIndex, game]);

  if (!game) {
    return (
      <div className="p-8 max-w-2xl mx-auto text-center">
        <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
        <h1 className="text-2xl font-bold mb-2">Game not found</h1>
        <p className="text-muted-foreground mb-4">That game isn't in the library yet.</p>
        <Link to="/library" className="text-primary hover:underline">← Back to the library</Link>
      </div>
    );
  }

  const cat = CATEGORIES.find(c => c.id === game.category);
  const annotation = game.annotations[moveIndex];
  const currentMove = moveIndex > 0 ? game.moves[moveIndex - 1] : null;
  const moveNum = Math.floor((moveIndex - 1) / 2) + 1;
  const isWhite = moveIndex > 0 && moveIndex % 2 === 1;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <Link to="/library" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Library
      </Link>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primary teal-text-glow">{game.title}</h1>
        <div className="text-sm text-muted-foreground mt-1">
          {game.white} vs {game.black}
          {game.year && ` · ${game.year}`}
          {game.event && ` · ${game.event}`}
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-2">
          <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded font-medium uppercase">{game.opening}</span>
          <span className="text-xs px-2 py-0.5 bg-secondary rounded text-muted-foreground">{cat?.label}</span>
          <span className="text-xs px-2 py-0.5 bg-secondary rounded text-muted-foreground capitalize">{game.difficulty}</span>
          <span className="text-xs px-2 py-0.5 bg-secondary rounded text-muted-foreground">Result: {game.result}</span>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-6">
        <div className="flex flex-col items-center">
          <div className="w-full flex justify-center">
            <ChessBoard game={boardGame} fen={fen} interactive={false} lastMove={lastMove} />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button onClick={() => { setMoveIndex(0); setAutoPlay(false); }}
              className="p-2 rounded-lg border border-border hover:bg-secondary transition-all">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={() => setMoveIndex(i => Math.max(0, i - 1))} disabled={moveIndex === 0}
              className="p-2 rounded-lg border border-border hover:bg-secondary transition-all disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setAutoPlay(!autoPlay)} disabled={moveIndex >= game.moves.length}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-30 teal-glow-sm flex items-center gap-2">
              {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {autoPlay ? 'Pause' : 'Auto-Play'}
            </button>
            <button onClick={() => setMoveIndex(i => Math.min(game.moves.length, i + 1))} disabled={moveIndex >= game.moves.length}
              className="p-2 rounded-lg border border-border hover:bg-secondary transition-all disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            {moveIndex === 0 ? 'Starting position' : `${moveNum}.${isWhite ? '' : '..'}${currentMove}`} · Move {moveIndex} of {game.moves.length}
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 teal-border-glow">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">About this game</h3>
            <p className="text-sm text-foreground/90 leading-relaxed">{game.description}</p>
          </div>

          <div className={`rounded-xl p-4 border ${annotation ? 'bg-primary/5 border-primary/30 teal-border-glow' : 'bg-card border-border'}`}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-primary uppercase tracking-wide">Lesson</h3>
              {annotation && <ReadAloudButton text={annotation} />}
            </div>
            {annotation ? (
              <p className="text-sm text-foreground/90 leading-relaxed">{annotation}</p>
            ) : (
              <p className="text-sm text-muted-foreground italic">Step forward to see the lesson for this move.</p>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-4 teal-border-glow">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Moves</h3>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 max-h-64 overflow-y-auto scrollbar-thin font-mono text-sm">
              {game.moves.map((m, i) => {
                const num = Math.floor(i / 2) + 1;
                const white = i % 2 === 0;
                const active = i === moveIndex - 1;
                return (
                  <button key={i} onClick={() => setMoveIndex(i + 1)}
                    className={`text-left px-2 py-0.5 rounded ${active ? 'bg-primary/20 text-primary font-bold' : 'text-foreground/80 hover:bg-secondary'}`}>
                    {white && <span className="text-muted-foreground mr-1">{num}.</span>}{m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}