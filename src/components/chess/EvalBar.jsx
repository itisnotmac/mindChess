import React from 'react';

// Vertical evaluation bar. evalCp = White-perspective centipawns.
export default function EvalBar({ evalCp }) {
  const v = Math.max(-1000, Math.min(1000, evalCp || 0));
  const pct = 1 / (1 + Math.exp(-v / 200)); // 0..1, 1 = White winning
  const label = (v / 100).toFixed(1).replace('-', '−');
  return (
    <div className="relative w-6 h-full rounded bg-[#1A1A2E] overflow-hidden border border-border shrink-0">
      <div className="absolute bottom-0 left-0 right-0 bg-[#E8D5B7] transition-all duration-300" style={{ height: `${pct * 100}%` }} />
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[9px] font-bold text-[#1A1A2E]">{label}</span>
    </div>
  );
}