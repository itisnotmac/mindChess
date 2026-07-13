import React, { useState, useMemo } from 'react';
import ChessBoard from '@/components/chess/ChessBoard';
import { createGame, makeMove, isCheckmate, isCheck, isDraw, isStalemate } from '@/lib/chessEngine';
import { playSound } from '@/lib/sound';
import { ENDGAMES } from '@/lib/endgames';
import { Target, Lightbulb } from 'lucide-react';

export default function EndgameLab() {
  const [endgame, setEndgame] = useState(null);
  const [fen, setFen] = useState('');

  const game = useMemo(() => endgame ? createGame(endgame.fen) : createGame(), [endgame, fen]);

  const selectEndgame = (e) => {
    setEndgame(e);
    setFen(e.fen);
  };

  const handleMove = (from, to, promotion) => {
    if (!endgame) return false;
    const g = createGame(fen || endgame.fen);
    const move = makeMove(g, from, to, promotion);
    if (!move) return false;
    if (g.isCheckmate()) playSound('checkmate');
    else if (g.isCheck()) playSound('check');
    else if (move.captured) playSound('capture');
    else playSound('move');
    setFen(g.fen());
    return true;
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Target className="w-8 h-8 text-primary" />
        <h1 className="text-3xl font-bold">Endgame Lab</h1>
      </div>

      <div className="grid md:grid-cols-[280px_1fr_280px] gap-6">
        <div className="space-y-2">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">Positions</h3>
          {ENDGAMES.map((e, i) => (
            <button key={i} onClick={() => selectEndgame(e)}
              className={`w-full text-left p-3 rounded-lg border transition-all
                ${endgame?.name === e.name ? 'border-primary bg-primary/10 teal-glow-sm' : 'border-border bg-card hover:border-primary/30'}`}>
              <div className="font-bold text-sm">{e.name}</div>
              <div className="text-xs text-muted-foreground capitalize">{e.concept.replace(/_/g, ' ')} · {e.difficulty}</div>
            </button>
          ))}
        </div>

        <div className="flex flex-col items-center">
          {endgame ? (
            <>
              <div className="w-full flex justify-center">
                <ChessBoard game={game} fen={fen} interactive={true} onMove={handleMove} movableColor={null} />
              </div>
              <p className="mt-3 text-sm text-muted-foreground text-center">{endgame.description}</p>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              <div className="text-center">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>Select an endgame position to begin training</p>
              </div>
            </div>
          )}
        </div>

        <div>
          {endgame && (
            <div className="bg-card border border-border rounded-xl p-4 teal-border-glow">
              <h3 className="font-bold text-lg mb-1">{endgame.name}</h3>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded font-medium uppercase">{endgame.concept.replace(/_/g, ' ')}</span>
                <span className="text-xs px-2 py-1 bg-secondary text-muted-foreground rounded capitalize">{endgame.difficulty}</span>
              </div>
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-[#FFB300] mt-0.5 shrink-0" />
                <p className="text-xs text-foreground/90">{endgame.explanation}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}