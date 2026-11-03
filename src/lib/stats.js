import { TrendingUp, Brain, Flame, Award, Gamepad2, Puzzle, Target, Percent } from 'lucide-react';

// Single source of truth for the metrics shown on the Dashboard and Profile pages,
// so both pages always display the same set with the same icons, labels and tooltips.
export const STAT_DEFS = [
  {
    label: 'ELO Rating',
    icon: TrendingUp,
    color: 'text-primary',
    tooltip: 'Your chess rating from games against the AI. Every result updates it. Everyone starts at 1200.',
    value: (p) => p.elo ?? 1200,
  },
  {
    label: 'Puzzle Rating',
    icon: Brain,
    color: 'text-[#39FF14]',
    tooltip: 'Your tactics rating from the Tactics Trainer. Solving harder puzzles raises it faster.',
    value: (p) => p.puzzle_rating ?? 1200,
  },
  {
    label: 'Current Streak',
    icon: Flame,
    color: 'text-[#FFB300]',
    tooltip: 'Puzzles you have solved correctly in a row right now. One miss resets it to zero.',
    value: (p) => p.puzzle_streak ?? 0,
  },
  {
    label: 'Longest Streak',
    icon: Award,
    color: 'text-[#FF8A3D]',
    tooltip: 'Your all-time record for consecutive puzzles solved without a miss.',
    value: (p) => p.longest_streak ?? 0,
  },
  {
    label: 'Games Played',
    icon: Gamepad2,
    color: 'text-[#A78BFA]',
    tooltip: 'Total games you have played against the AI.',
    value: (p) => p.total_games ?? 0,
  },
  {
    label: 'Puzzles Solved',
    icon: Puzzle,
    color: 'text-destructive',
    tooltip: 'Total puzzles you have solved in the Tactics Trainer.',
    value: (p) => p.puzzles_solved ?? 0,
  },
  {
    label: 'Puzzle Accuracy',
    icon: Target,
    color: 'text-primary',
    tooltip: 'Share of attempted puzzles you have solved correctly.',
    value: (p) => (p.total_puzzles > 0 ? `${Math.round((p.puzzles_solved / p.total_puzzles) * 100)}%` : '—'),
  },
  {
    label: 'Win Rate',
    icon: Percent,
    color: 'text-[#39FF14]',
    tooltip: 'Share of your AI games that you have won.',
    value: (p) => (p.total_games > 0 ? `${Math.round((p.games_won / p.total_games) * 100)}%` : '—'),
  },
];