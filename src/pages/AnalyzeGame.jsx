import React, { useState, useMemo, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import ChessBoard from '@/components/chess/ChessBoard';
import EvalBar from '@/components/chess/EvalBar';
import { createGame, makeSanMove, getBestMove, evaluatePosition, loadPgnGame } from '@/lib/chessEngine';
import { LineChart, Line, XAxis, YAxis, ReferenceLine, ResponsiveContainer, Tooltip } from 'recharts';
import { Microscope, Loader2, ArrowLeft, ChevronLeft, ChevronRight, RotateCcw, Wand2, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ReadAloudButton from '@/components/ReadAloudButton';
import MobileSelect from '@/components/MobileSelect';
import { useLocation } from 'react-router-dom';

const DEPTH = 3;

const QUALITY = {
  good: { label: 'Good', cls: 'text-[#39FF14] border-[#39FF14]/30 bg-[#39FF14]/10' },
  inaccuracy: { label: 'Inaccuracy', cls: 'text-[#FFB300] border-[#FFB300]/30 bg-[#FFB300]/10' },
  mistake: { label: 'Mistake', cls: 'text-[#FF8A3D] border-[#FF8A3D]/30 bg-[#FF8A3D]/10' },
  blunder: { label: 'Blunder', cls: 'text-destructive border-destructive/30 bg-destructive/10' },
};

const SAMPLE = `1. e4 e5 2. Nf3 d6 3. d4 Bg4 4. dxe5 Bxf3 5. Qxf3 dxe5 6. Bc4 Nf6 7. Qb3 Qe7 8. Nc3 c6 9. Bg5 b5 10. Nxb5 cxb5 11. Bxb5+ Nbd7 12. O-O-O Rd8 13. Rxd7 Rxd7 14. Rd1 Qe6 15. Bxd7+ Nxd7 16. Qb8+ Nxb8 17. Rd8# 1-0`;

function classify(loss) {
  if (loss < 50) return 'good';
  if (loss < 150) return 'inaccuracy';
  if (loss < 300) return 'mistake';
  return 'blunder';
}

function fmtEval(cp) {
  const p = (cp / 100).toFixed(2);
  return cp >= 0 ? `+${p}` : p;
}

export default function AnalyzeGame() {
  const [phase, setPhase] = useState('input');
  const [pgn, setPgn] = useState('');
  const [side, setSide] = useState('white');
  const [analysis, setAnalysis] = useState(null);
  const [narrative, setNarrative] = useState('');
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [error, setError] = useState('');
  const [viewIndex, setViewIndex] = useState(0);
  const location = useLocation();

  const runAnalysis = (pgnText = pgn, sideText = side) => {
    setError('');
    const g = loadPgnGame(pgnText);
    if (!g) { setError('Could not read those moves. Check the format and try again.'); return; }
    setPhase('analyzing');
    setTimeout(() => {
      const verbose = g.history({ verbose: true });
      const moves = [];
      const evalSeries = [{ ply: 0, eval: 0 }];
      const replay = createGame();
      for (let i = 0; i < verbose.length; i++) {
        const before = createGame(replay.fen());
        const turn = before.turn();
        const best = getBestMove(createGame(before.fen()), DEPTH);
        const evalBest = best ? best.score : evaluatePosition(before, DEPTH - 1);
        const played = verbose[i];
        makeSanMove(replay, played.san);
        const after = createGame(replay.fen());
        const evalAfter = evaluatePosition(after, DEPTH - 1);
        const loss = turn === 'w' ? evalBest - evalAfter : evalAfter - evalBest;
        const quality = classify(loss);
        moves.push({
          ply: i + 1, san: played.san, from: played.from, to: played.to,
          fenBefore: before.fen(), fenAfter: after.fen(),
          evalAfter, quality, loss: Math.round(loss), bestSan: best ? best.move.san : null,
          side: turn === 'w' ? 'white' : 'black',
        });
        evalSeries.push({ ply: i + 1, eval: Math.max(-1000, Math.min(1000, evalAfter)) });
      }
      const finalGame = createGame(replay.fen());
      let result = 'draw';
      if (finalGame.isCheckmate()) result = finalGame.turn() === 'w' ? '0-1' : '1-0';
      else if (finalGame.isDraw() || finalGame.isStalemate()) result = '½-½';
      const keyMoments = moves.filter(m => m.quality === 'mistake' || m.quality === 'blunder');
      setAnalysis({ moves, evalSeries, result, keyMoments, length: verbose.length });
      setViewIndex(verbose.length);
      setPhase('review');
      base44.analytics.track({ eventName: 'analyze_game', properties: { plies: verbose.length, blunders: keyMoments.filter(m => m.quality === 'blunder').length } });
      fetchNarrative(pgnText, result, sideText, keyMoments);
    }, 50);
  };

  const fetchNarrative = async (pgnText, result, playerSide, moments) => {
    setNarrativeLoading(true); setNarrative('');
    try {
      const momentList = moments.slice(0, 6).map(m =>
        `Move ${m.ply} (${m.side}): played ${m.san}, better was ${m.bestSan} (swing ${fmtEval(-m.loss)} for ${m.side}).`).join('\n');
      const prompt = `You are Mind Chess, an elite, warm, encouraging chess coach. Review this game.
PGN: ${pgnText}
Result: ${result}
The student played ${playerSide}.
Detected key moments:
${momentList || 'No major mistakes detected — a clean game.'}

Write a concise coaching summary (markdown, ~180 words). Cover: what the student did well, the 1-2 most important mistakes with the idea behind the better move (use move notation), and one concrete thing to work on next. Be specific and encouraging.`;
      const res = await base44.integrations.Core.InvokeLLM({ prompt });
      setNarrative(typeof res === 'string' ? res : '');
    } catch (e) {
      setNarrative('Could not generate the narrative summary, but the move-by-move review below is still yours to study.');
    }
    setNarrativeLoading(false);
  };

  const reset = () => {
    setPhase('input'); setAnalysis(null); setNarrative(''); setError(''); setPgn('');
  };

  useEffect(() => {
    if (location.state?.pgn) {
      setPgn(location.state.pgn);
      if (location.state?.side) setSide(location.state.side);
      runAnalysis(location.state.pgn, location.state.side || 'white');
    }
  }, []);

  if (phase === 'input') {
    return (
      <div className="p-6 md:p-8 max-w-2xl mx-auto">
        <button onClick={() => window.history.back()} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Microscope className="w-8 h-8 text-primary teal-text-glow" />
          <h1 className="text-3xl font-bold">Analyze My Game</h1>
        </div>
        <p className="text-sm text-muted-foreground mb-6">
          Paste your game's move list — that long string of chess moves you can copy from most
          chess apps — and get a move-by-move review: an evaluation graph, quality badges,
          best-move suggestions on mistakes, and a coach's written summary.
        </p>
        <label htmlFor="pgn-input" className="text-xs text-muted-foreground uppercase tracking-wide mb-1.5 block">Your game's moves</label>
        <textarea id="pgn-input" value={pgn} onChange={e => setPgn(e.target.value)} rows={8}
          placeholder="1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 ..."
          className="w-full bg-card border border-border rounded-lg p-3 font-mono text-sm focus:outline-none focus:border-primary teal-border-glow resize-y" />
        <div className="flex flex-col sm:flex-row gap-3 mt-3">
          <div className="flex items-center gap-2">
            <label className="text-xs text-muted-foreground uppercase">You played</label>
            <MobileSelect
              value={side}
              onChange={setSide}
              placeholder="You played"
              title="Side"
              triggerClassName="w-28 bg-card border-border rounded-lg px-2 py-1.5 text-sm focus:border-primary"
              options={[{ value: 'white', label: 'White' }, { value: 'black', label: 'Black' }]}
            />
          </div>
          <button onClick={() => setPgn(SAMPLE)} className="text-xs text-primary hover:underline ml-auto">Load sample game</button>
        </div>
        {error && <p className="text-sm text-destructive mt-3">{error}</p>}
        <button onClick={() => runAnalysis()} disabled={!pgn.trim()}
          className="w-full mt-4 bg-primary text-primary-foreground py-3 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all teal-glow disabled:opacity-50 flex items-center justify-center gap-2">
          <Microscope className="w-5 h-5" /> Analyze Game
        </button>
      </div>
    );
  }

  if (phase === 'analyzing') {
    return (
      <div className="flex flex-col items-center justify-center h-full py-32">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Reviewing every move… this takes a few seconds.</p>
      </div>
    );
  }

  const a = analysis;
  const fen = (() => {
    const g = createGame();
    for (let i = 0; i < viewIndex; i++) makeSanMove(g, a.moves[i].san);
    return g.fen();
  })();
  const boardGame = createGame(fen);
  const lastMove = viewIndex > 0 ? { from: a.moves[viewIndex - 1].from, to: a.moves[viewIndex - 1].to } : null;
  const currentEval = viewIndex > 0 ? a.moves[viewIndex - 1].evalAfter : 0;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Microscope className="w-7 h-7 text-primary teal-text-glow" />
          <h1 className="text-2xl font-bold">Game Review</h1>
          <span className="text-sm px-2 py-1 bg-secondary rounded font-mono">{a.result}</span>
        </div>
        <button onClick={reset} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <RotateCcw className="w-4 h-4" /> New Game
        </button>
      </div>

      <div className="grid md:grid-cols-[auto_1fr_320px] gap-6">
        <div className="flex flex-col items-center">
          <div className="flex gap-2 w-full justify-center">
            <div className="h-[400px]"><EvalBar evalCp={currentEval} /></div>
            <ChessBoard game={boardGame} fen={fen} interactive={false} lastMove={lastMove} />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <button onClick={() => setViewIndex(0)} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-border hover:bg-secondary"><RotateCcw className="w-4 h-4" /></button>
            <button onClick={() => setViewIndex(i => Math.max(0, i - 1))} disabled={viewIndex === 0} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-border hover:bg-secondary disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setViewIndex(i => Math.min(a.length, i + 1))} disabled={viewIndex >= a.length} className="p-2 min-w-[44px] min-h-[44px] flex items-center justify-center rounded-lg border border-border hover:bg-secondary disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <div className="mt-1 text-xs text-muted-foreground">Move {viewIndex} of {a.length} · eval {fmtEval(currentEval)}</div>
        </div>

        <div className="space-y-4">
          <div className="bg-card border border-border rounded-xl p-4 teal-border-glow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide flex items-center gap-2"><Wand2 className="w-4 h-4 text-primary" /> Coach's Summary</h3>
              {narrative && !narrativeLoading && <ReadAloudButton text={narrative} />}
            </div>
            {narrativeLoading ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="w-4 h-4 animate-spin" /> Writing your review…</div>
            ) : (
              <div className="text-sm prose prose-invert prose-sm max-w-none [&_p]:my-1.5 [&_strong]:text-primary"><ReactMarkdown>{narrative}</ReactMarkdown></div>
            )}
          </div>

          <div className="bg-card border border-border rounded-xl p-4 teal-border-glow">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2">Evaluation</h3>
            <ResponsiveContainer width="100%" height={130}>
              <LineChart data={a.evalSeries}>
                <XAxis dataKey="ply" hide />
                <YAxis domain={[-1000, 1000]} hide />
                <ReferenceLine y={0} stroke="hsl(var(--border))" />
                <Tooltip formatter={(v) => fmtEval(v)} labelFormatter={(l) => `Move ${l}`} contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="eval" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            <p className="text-[10px] text-muted-foreground text-center mt-1">Up = White advantage · Down = Black advantage</p>
          </div>

          {a.keyMoments.length > 0 && (
            <div className="bg-card border border-border rounded-xl p-4 teal-border-glow">
              <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-2 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-[#FF8A3D]" /> Key Moments</h3>
              <div className="space-y-2 max-h-60 overflow-y-auto scrollbar-thin">
                {a.keyMoments.map((m, i) => {
                  const q = QUALITY[m.quality];
                  return (
                    <button key={i} onClick={() => setViewIndex(m.ply)}
                      className="w-full text-left text-xs bg-secondary/50 hover:bg-secondary rounded-lg p-2 transition-colors">
                      <div className="flex items-center justify-between">
                        <span className="font-mono">Move {m.ply}. {m.side === 'white' ? '' : '…'}{m.san}</span>
                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${q.cls}`}>{q.label}</span>
                      </div>
                      <div className="text-muted-foreground mt-1">Better: <span className="text-primary font-mono">{m.bestSan}</span> · swing {fmtEval(-m.loss)}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="bg-card border border-border rounded-xl p-4 teal-border-glow h-fit max-h-[70vh] overflow-y-auto scrollbar-thin">
          <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wide mb-3">Moves</h3>
          <div className="space-y-1 font-mono text-sm">
            {a.moves.map((m, i) => {
              const num = Math.floor(i / 2) + 1;
              const white = i % 2 === 0;
              const q = QUALITY[m.quality];
              const active = i === viewIndex - 1;
              return (
                <button key={i} onClick={() => setViewIndex(m.ply)}
                  className={`w-full flex items-center gap-2 px-2 py-0.5 rounded text-left ${active ? 'bg-primary/20' : 'hover:bg-secondary'}`}>
                  <span className="text-muted-foreground w-6 shrink-0">{white ? `${num}.` : `${num}…`}</span>
                  <span className={active ? 'text-primary font-bold' : ''}>{m.san}</span>
                  {m.quality !== 'good' && <span className={`ml-auto text-[8px] font-bold uppercase px-1 rounded border ${q.cls}`}>{q.label.slice(0, 3)}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}