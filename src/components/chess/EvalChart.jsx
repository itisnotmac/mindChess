/**
 * EvalChart — lightweight SVG eval curve, no Recharts dependency.
 * data: Array<{ ply: number, eval: number }> (eval in centipawns, clamped ±1000)
 */
import React from 'react';

export default function EvalChart({ data = [] }) {
  if (!data.length) return null;

  const W = 400, H = 130, PAD = 4;
  const inner_w = W - PAD * 2;
  const inner_h = H - PAD * 2;

  const toX = (i) => PAD + (i / (data.length - 1 || 1)) * inner_w;
  const toY = (v) => PAD + ((1000 - Math.max(-1000, Math.min(1000, v))) / 2000) * inner_h;

  const points = data.map((d, i) => `${toX(i)},${toY(d.eval)}`).join(' ');
  const zeroY = toY(0);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height: 130 }}
      aria-label="Evaluation chart"
    >
      {/* Zero line */}
      <line x1={PAD} y1={zeroY} x2={W - PAD} y2={zeroY} stroke="hsl(var(--border))" strokeWidth="1" />
      {/* Eval polyline */}
      <polyline
        points={points}
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="2"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
