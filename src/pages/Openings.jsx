import React, { useState, useMemo } from 'react';
import ChessBoard from '@/components/chess/ChessBoard';
import { createGame, makeSanMove, getFen } from '@/lib/chessEngine';
import { OPENINGS } from '@/lib/openings';
import { BookOpen, ChevronLeft, ChevronRight, RotateCcw, Play, Pause, List } from 'lucide-react';

export default function Openings() {
  const [opening, setOpening] = useState(null);
  const [variation, setVariation] = useState(null);
  const [moveIndex, setMoveIndex] = useState(0);
  const [fen, setFen] = useState(createGame().fen());
  const [autoPlay, setAutoPlay] = useState(false);

  const game = useMemo(() => createGame(fen), [fen]);
  const lastMove = useMemo(() => {
    if (moveIndex === 0 || !variation) return null;
    const g = createGame();
    for (let i = 0; i < moveIndex - 1; i++) makeSanMove(g, variation.moves[i]);
    const before = createGame(g.fen());
    const movesBefore = before.moves({ verbose: true });
    makeSanMove(g, variation.moves[moveIndex - 1]);
    const afterMoves = g.history({ verbose: true });
    if (afterMoves.length === 0) return null;
    const last = afterMoves[afterMoves.length - 1];
    return { from: last.from, to: last.to };
  }, [moveIndex, variation]);

  const selectOpening = (o, v) => {
    setOpening(o);
    setVariation(v || o.variations[0]);
    setMoveIndex(0);
    setFen(createGame().fen());
    setAutoPlay(false);
  };

  const stepForward = () => {
    if (!variation || moveIndex >= variation.moves.length) return;
    const g = createGame(fen);
    makeSanMove(g, variation.moves[moveIndex]);
    setFen(g.fen());
    setMoveIndex(moveIndex + 1);
  };

  const stepBack = () => {
    if (!variation || moveIndex === 0) return;
    const newIndex = moveIndex - 1;
    const g = createGame();
    for (let i = 0; i < newIndex; i++) makeSanMove(g, variation.moves[i]);
    setFen(g.fen());
    setMoveIndex(newIndex);
  };

  const reset = () => {
    setMoveIndex(0);
    setFen(createGame().fen());
    setAutoPlay(false);
  };

  React.useEffect(() => {
    if (autoPlay && variation && moveIndex < variation.moves.length) {
      const timer = setTimeout(stepForward, 1200);
      return () => clearTimeout(timer);
    } else if (autoPlay && moveIndex >= variation?.moves.length) {
      setAutoPlay(false);
    }
  }, [autoPlay, moveIndex, variation]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Opening Explorer</h1>
      </div>

      <div className="grid md:grid-cols-[280px_1fr_280px] gap-6">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">Openings</h3>
          {OPENINGS.map(o => (
            <div key={o.eco}>
              <button onClick={() => selectOpening(o)}
                className={`w-full text-left p-3 rounded-lg border transition-all
                  ${opening?.eco === o.eco ? 'border-primary bg-primary/10 teal-glow-sm' : 'border-border bg-card hover:border-primary/30'}`}>
                <div className="font-bold text-sm">{o.name}</div>
                <div className="text-xs text-muted-foreground">{o.eco} · {o.difficulty}</div>
              </button>
              {opening?.eco === o.eco && (
                <div className="ml-3 mt-1 space-y-1 border-l border-border pl-3">
                  {o.variations.map((v, i) => (
                    <button key={i} onClick={() => selectOpening(o, v)}
                      className={`w-full text-left p-2 rounded text-xs transition-all
                        ${variation?.name === v.name ? 'text-primary bg-primary/5' : 'text-muted-foreground hover:text-foreground'}`}>
                      {v.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center">
          <div className="w-full flex justify-center">
            <ChessBoard game={game} fen={fen} interactive={false} lastMove={lastMove} />
          </div>
          <div className="flex items-center gap-2 mt-4">
            <button onClick={reset} className="p-2 rounded-lg border border-border hover:bg-secondary transition-all">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={stepBack} disabled={moveIndex === 0}
              className="p-2 rounded-lg border border-border hover:bg-secondary transition-all disabled:opacity-30">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setAutoPlay(!autoPlay)} disabled={!variation || moveIndex >= variation?.moves.length}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium disabled:opacity-30 teal-glow-sm flex items-center gap-2">
              {autoPlay ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              {autoPlay ? 'Pause' : 'Auto-Play'}
            </button>
            <button onClick={stepForward} disabled={!variation || moveIndex >= variation?.moves.length}
              className="p-2 rounded-lg border border-border hover:bg-secondary transition-all disabled:opacity-30">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Move {moveIndex} of {variation?.moves.length || 0}
          </div>
        </div>

        <div>
          {opening && (
            <div className="bg-card border border-border rounded-xl p-4 teal-border-glow">
              <h3 className="font-bold text-lg mb-1">{opening.name}</h3>
              <p className="text-xs text-primary mb-3">{opening.eco} · {opening.difficulty}</p>
              <p className="text-sm text-muted-foreground mb-4">{opening.description}</p>
              {variation && (
                <>
                  <h4 className="font-bold text-sm mb-2">{variation.name}</h4>
                  <p className="text-xs text-foreground/90 bg-secondary/50 rounded p-2">{variation.explanation}</p>
                  <div className="mt-3 font-mono text-xs space-y-0.5">
                    {variation.moves.map((m, i) => (
                      <div key={i} className={`flex gap-2 ${i < moveIndex ? 'text-primary' : 'text-muted-foreground'}`}>
                        <span className="w-6">{Math.floor(i / 2) + 1}.{i % 2 === 0 ? '' : '..'}</span>
                        <span>{m}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}