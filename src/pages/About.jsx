import React from 'react';
import { Crown, Brain, Gamepad2, BookOpen, Target, Sparkles } from 'lucide-react';

export default function About() {
  return (
    <div className="p-6 md:p-10 max-w-3xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Crown className="w-8 h-8 text-primary teal-text-glow" />
        <h1 className="text-3xl md:text-4xl font-bold text-primary teal-text-glow">About Mind Chess</h1>
      </div>

      <div className="space-y-5 text-foreground/90 leading-relaxed">
        <p>
          Mind Chess is a dedicated chess training platform built for players who want to improve through
          focused, deliberate practice. From the team that brought you <em>Reel Chess</em>, Mind Chess brings
          the same love of the game into a structured learning environment. Whether you are picking up the
          pieces for the first time or sharpening your tactics before a tournament, every module is designed
          to make real improvement feel natural and rewarding.
        </p>

        <p>
          The app is built around four core training modules. <strong className="text-primary">Play vs AI</strong>
          lets you test your skills against five difficulty levels, each paired with live coaching feedback so
          every game becomes a lesson. The <strong className="text-primary">Tactics Trainer</strong> serves
          verified, engine-checked puzzles across forks, pins, skewers, discovered attacks, and mating
          patterns — each with a rich explanation that teaches the <em>why</em>, not just the move. The
          <strong className="text-primary"> Opening Explorer</strong> walks you through major openings and
          their key variations, while the <strong className="text-primary">Endgame Lab</strong> helps you
          master the critical techniques that decide close games.
        </p>

        <p>
          Mind Chess is for anyone who wants to get better at chess — club players, casual enthusiasts, and
          ambitious improvers alike. We believe great chess instruction should explain the ideas behind the
          moves, track your progress honestly, and never waste your time with broken or unclear material.
          That commitment to quality is why every puzzle in our database is validated by a real chess engine
          before it ever reaches you.
        </p>

        <p>
          Mind Chess is built by a small, independent team that lives and breathes chess. We are constantly
          expanding the curriculum, adding new puzzles, and refining the coaching experience. Your progress,
          your streaks, and your rating all live in one place — so you can see exactly how far you have come
          and what to study next. We are just getting started, and we would love for you to grow with us.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
        {[
          { icon: Gamepad2, label: 'Play vs AI' },
          { icon: Brain, label: 'Tactics' },
          { icon: BookOpen, label: 'Openings' },
          { icon: Target, label: 'Endgames' },
        ].map((m, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-3 flex flex-col items-center gap-1 teal-border-glow">
            <m.icon className="w-6 h-6 text-primary" />
            <span className="text-xs font-medium">{m.label}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mt-8 text-sm text-muted-foreground">
        <Sparkles className="w-4 h-4 text-primary" />
        <span>From the team behind Reel Chess — Let's Chess!</span>
      </div>
    </div>
  );
}