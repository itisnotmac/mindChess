import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MASTER_GAMES, CATEGORIES, DIFFICULTIES } from '@/lib/masterGames';
import { Library, Search, ChevronRight, Calendar } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const DIFFICULTY_COLOR = {
  beginner: 'text-[#39FF14] border-[#39FF14]/30 bg-[#39FF14]/10',
  intermediate: 'text-[#FFB300] border-[#FFB300]/30 bg-[#FFB300]/10',
  advanced: 'text-primary border-primary/30 bg-primary/10',
  master: 'text-[#FF6B6B] border-[#FF6B6B]/30 bg-[#FF6B6B]/10',
};

export default function GameLibrary() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');
  const [difficulty, setDifficulty] = useState('all');

  const filtered = useMemo(() => {
    return MASTER_GAMES.filter(g => {
      if (category !== 'all' && g.category !== category) return false;
      if (difficulty !== 'all' && g.difficulty !== difficulty) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${g.title} ${g.white} ${g.black} ${g.opening} ${g.summary}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, category, difficulty]);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <Library className="w-8 h-8 text-primary teal-text-glow" />
        <h1 className="text-3xl font-bold">Game Library</h1>
      </div>
      <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
        Study the great games of chess history, move by move, with a lesson on every key position. From the
        fastest checkmate to Morphy's masterpieces — the foundation of chess understanding lives here.
      </p>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search by title, player, or opening..."
            className="w-full pl-9 pr-3 py-2 bg-card border border-border rounded-lg text-sm focus:outline-none focus:border-primary teal-border-glow"
          />
        </div>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-auto bg-card border-border rounded-lg px-3 py-2 text-sm focus:border-primary teal-border-glow">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All categories</SelectItem>
            {CATEGORIES.map(c => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={difficulty} onValueChange={setDifficulty}>
          <SelectTrigger className="w-auto bg-card border-border rounded-lg px-3 py-2 text-sm focus:border-primary teal-border-glow">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All levels</SelectItem>
            {DIFFICULTIES.map(d => <SelectItem key={d.id} value={d.id}>{d.label}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Library className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>No games match your search yet — the library is growing.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(g => {
            const cat = CATEGORIES.find(c => c.id === g.category);
            return (
              <Link key={g.id} to={`/library/${g.id}`}
                className="group bg-card border border-border rounded-xl p-4 flex flex-col transition-all hover:border-primary/40 hover:teal-glow-sm teal-border-glow">
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded border ${DIFFICULTY_COLOR[g.difficulty]}`}>
                    {g.difficulty}
                  </span>
                  {g.result === '1-0' ? <span className="text-xs text-primary font-bold">White wins</span>
                    : g.result === '0-1' ? <span className="text-xs text-[#FF6B6B] font-bold">Black wins</span>
                    : <span className="text-xs text-muted-foreground font-bold">Draw</span>}
                </div>
                <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{g.title}</h3>
                <div className="text-xs text-muted-foreground mb-2">
                  {g.white} vs {g.black}
                  {g.year && <span className="inline-flex items-center gap-1 ml-1"><Calendar className="w-3 h-3" />{g.year}</span>}
                </div>
                <p className="text-sm text-foreground/80 flex-1">{g.summary}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">{cat?.label}</span>
                  <span className="flex items-center gap-1 text-xs text-primary font-medium group-hover:gap-2 transition-all">
                    Study <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}