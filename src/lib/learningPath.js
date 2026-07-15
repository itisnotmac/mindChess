// Chess Mind — Learning Path curriculum
// `module` maps a lesson to one of the app's existing tools.
// `to` is the route the "Start" button links to.

export const MODULES = {
  play: { label: 'Play vs AI', color: 'text-primary' },
  tactics: { label: 'Tactics Trainer', color: 'text-[#39FF14]' },
  openings: { label: 'Opening Explorer', color: 'text-[#FFB300]' },
  endgames: { label: 'Endgame Lab', color: 'text-[#FF8A3D]' },
  library: { label: 'Game Library', color: 'text-[#B388FF]' },
  analyze: { label: 'Analyze My Game', color: 'text-primary' },
};

export const STAGES = [
  {
    id: 'foundations',
    title: 'Foundations',
    subtitle: 'The absolute basics — how to start, attack, and finish a game.',
    lessons: [
      { id: 'f1', title: 'Play your first game', concept: 'How the pieces move and the goal of checkmate.', task: 'Play one full game against the Beginner AI.', to: '/play', module: 'play', xp: 50 },
      { id: 'f2', title: 'The fastest checkmates', concept: 'Fool\'s Mate & Scholar\'s Mate — what NOT to let happen to your king.', task: 'Study Fool\'s Mate and Scholar\'s Mate in the Library.', to: '/library/fools-mate', module: 'library', xp: 50 },
      { id: 'f3', title: 'Your first tactic', concept: 'Spotting an undefended piece or a one-move mate.', task: 'Solve 3 puzzles in the Tactics Trainer.', to: '/tactics', module: 'tactics', xp: 75 },
      { id: 'f4', title: 'Checkmate with the queen', concept: 'The K+Q vs K technique — drive the king to the edge.', task: 'Practice a basic checkmate in the Endgame Lab.', to: '/endgames', module: 'endgames', xp: 75 },
    ],
  },
  {
    id: 'tactical-awareness',
    title: 'Tactical Awareness',
    subtitle: 'Recognize the patterns that win material and games.',
    lessons: [
      { id: 't1', title: 'Forks & pins', concept: 'Two patterns that win pieces in almost every game.', task: 'Solve 5 tactics puzzles — watch for fork and pin themes.', to: '/tactics', module: 'tactics', xp: 100 },
      { id: 't2', title: 'The back-rank mate', concept: 'The most common mating pattern in chess.', task: 'Solve 3 mate-in-1 puzzles focusing on the back rank.', to: '/tactics', module: 'tactics', xp: 100 },
      { id: 't3', title: 'Morphy\'s Opera Game', concept: 'Rapid development and coordinated attack.', task: 'Study the Opera Game move-by-move in the Library.', to: '/library/opera-game', module: 'library', xp: 100 },
      { id: 't4', title: 'Opening principles', concept: 'Center, develop, castle — the rules that open every game.', task: 'Explore the Italian Game in the Opening Explorer.', to: '/openings', module: 'openings', xp: 100 },
    ],
  },
  {
    id: 'strategy',
    title: 'Strategy & Positional Play',
    subtitle: 'Think beyond the next move — plans, structure, and technique.',
    lessons: [
      { id: 's1', title: 'Build a repertoire', concept: 'Two openings you actually understand beats twenty you don\'t.', task: 'Master one opening for White and one for Black in the Explorer.', to: '/openings', module: 'openings', xp: 150 },
      { id: 's2', title: 'Endgame technique', concept: 'K+R, K+Q, and pawn promotion — the must-know finishes.', task: 'Drill 3 endgame studies in the Endgame Lab.', to: '/endgames', module: 'endgames', xp: 150 },
      { id: 's3', title: 'Légal\'s combination', concept: 'Development and a queen sacrifice for mate.', task: 'Study Légal\'s Mate in the Library.', to: '/library/legal-trap', module: 'library', xp: 150 },
      { id: 's4', title: 'Review your own play', concept: 'Improvement comes from finding your own mistakes.', task: 'Play a game vs Intermediate AI, then Analyze it.', to: '/play', module: 'play', xp: 200 },
    ],
  },
  {
    id: 'competitive-edge',
    title: 'Competitive Edge',
    subtitle: 'Sharpen the skills that win rated games.',
    lessons: [
      { id: 'c1', title: 'Advanced tactics', concept: 'Discovered attacks, deflections, and combinations.', task: 'Solve 5 puzzles rated 1200+ in the Tactics Trainer.', to: '/tactics', module: 'tactics', xp: 200 },
      { id: 'c2', title: 'Sharper openings', concept: 'The Sicilian — dynamic, asymmetric, competitive.', task: 'Explore the Sicilian Defense in the Opening Explorer.', to: '/openings', module: 'openings', xp: 200 },
      { id: 'c3', title: 'Master endgames', concept: 'Convert small advantages into full points.', task: 'Drill a complex endgame study to a win.', to: '/endgames', module: 'endgames', xp: 200 },
      { id: 'c4', title: 'Analyze like a master', concept: 'Use the engine review on a real master game.', task: 'Load the Opera Game PGN into Analyze My Game and review it.', to: '/analyze', module: 'analyze', xp: 200 },
      { id: 'c5', title: 'Consistency', concept: 'Skill under pressure comes from repetition.', task: 'Play 3 games at Advanced AI and review each one.', to: '/play', module: 'play', xp: 250 },
    ],
  },
];

export function levelFromXp(xp) {
  const level = Math.floor(xp / 300) + 1;
  const titles = ['Novice', 'Apprentice', 'Player', 'Club', 'Tournament', 'Expert', 'Candidate Master', 'Master'];
  const title = titles[Math.min(level - 1, titles.length - 1)];
  return { level, title, into: xp % 300, need: 300 };
}