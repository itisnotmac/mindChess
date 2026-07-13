export const PUZZLES = [
  {
    fen: "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
    solution_moves: ["a1a8"],
    theme: "back_rank_mate",
    rating: 800,
    description: "White to play and deliver checkmate!",
    explanation: "The back rank is weak! The black king is trapped behind its own pawns on f7, g7, and h7. Ra8# delivers checkmate because the king cannot escape to the 7th rank (blocked by its own pawns) or along the 8th rank (controlled by the rook)."
  },
  {
    fen: "6k1/5ppp/8/8/8/8/8/6KQ w - - 0 1",
    solution_moves: ["h1a8"],
    theme: "mate_in_1",
    rating: 950,
    description: "Long diagonal checkmate!",
    explanation: "Qa8# — the queen travels the entire a8-h1 diagonal to deliver back rank mate. The king is trapped behind its pawns on f7, g7, and h7 with no escape."
  },
  {
    fen: "8/4k1q1/8/8/8/6N1/8/6K1 w - - 0 1",
    solution_moves: ["g3f5"],
    theme: "fork",
    rating: 1000,
    description: "Find the knight fork!",
    explanation: "Nf5+ is a devastating fork! The knight attacks both the king on e7 and the queen on g7 simultaneously. After the king moves, Nxg7 wins the queen for free."
  },
  {
    fen: "8/8/8/8/3Q4/8/2K5/k7 w - - 0 1",
    solution_moves: ["d4a4"],
    theme: "mate_in_1",
    rating: 700,
    description: "Queen checkmate on the edge!",
    explanation: "Qa4# — the queen checks the king on a1 along the a-file. The white king on c2 controls the escape squares b1 and b2, and the queen controls a2. This is the classic King + Queen vs King mating technique: drive the enemy king to the edge, then use your king to take away the remaining escape squares."
  },
  {
    fen: "k7/7R1/1K6/8/8/8/8/8 w - - 0 1",
    solution_moves: ["h2h1"],
    theme: "mate_in_1",
    rating: 600,
    description: "Rook checkmate in one!",
    explanation: "Rh1# — the rook checks the king on a1 along the 1st rank. The white king on b3 controls a2 and b2, so the black king has no escape. This is the fundamental King + Rook vs King mating technique: use your king to take away escape squares while the rook delivers check on the edge."
  },
  {
    fen: "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1",
    solution_moves: ["e2e4"],
    theme: "promotion",
    rating: 400,
    description: "Push the pawn to win!",
    explanation: "This is the fundamental King and Pawn vs King endgame. The key is the opposition — when kings face each other with one square between them, whoever must move loses ground. Advance the pawn while using your king to control the path, and you'll promote to a queen and win."
  },
  {
    fen: "7k/8/6K1/8/8/8/8/R7 w - - 0 1",
    solution_moves: ["a1a8"],
    theme: "mate_in_1",
    rating: 500,
    description: "King and Rook checkmate!",
    explanation: "Ra8# — the rook checks the king on h8 along the 8th rank. The white king on g6 controls the escape squares g7 and h7, so the black king is trapped. This demonstrates why driving the enemy king to the edge of the board is the key to mating with a rook."
  },
  {
    fen: "3k4/3q4/8/8/8/8/8/3R2K1 w - - 0 1",
    solution_moves: ["d1d7"],
    theme: "pin",
    rating: 900,
    description: "The black queen is pinned — win it!",
    explanation: "The black queen on d7 is pinned to the king on d8 along the d-file. It cannot move out of the line of attack. Rxd7+ captures the pinned queen! After the king recaptures (Kxd7), you've traded a rook (5 points) for a queen (9 points) — a net gain of 4 points. Always look for pinned pieces: they're sitting ducks."
  },
  {
    fen: "q7/8/8/k7/8/8/8/1R5K w - - 0 1",
    solution_moves: ["b1a1"],
    theme: "skewer",
    rating: 1000,
    description: "Skewer the king and queen!",
    explanation: "Ra1+ is a classic skewer! The rook checks the king on a5 along the a-file. Behind the king, on a8, sits the black queen. The king must step off the a-file, and then Rxa8 captures the queen. A skewer is the opposite of a pin: the more valuable piece is in front, and when it moves, the piece behind is exposed."
  },
  {
    fen: "k3q3/8/8/8/4B3/8/8/4R2K1 w - - 0 1",
    solution_moves: ["e4b7"],
    theme: "discovered_attack",
    rating: 1100,
    description: "Move the bishop to reveal a hidden attack!",
    explanation: "Bb7+ is a discovered attack! The bishop moves to b7, giving check to the king on a8. But the real point: moving the bishop off the e-file reveals the rook on e1, which now attacks the black queen on e8. After the king moves to escape the check, Rxe8 wins the queen. A discovered attack is devastating because the opponent must respond to the visible threat (the check) while the hidden attack (on the queen) is already in motion."
  },
  {
    fen: "6k1/8/8/8/8/3n4/8/3Q2K1 w - - 0 1",
    solution_moves: ["d1d3"],
    theme: "hanging_piece",
    rating: 600,
    description: "The knight is undefended — grab it!",
    explanation: "The black knight on d3 has no defenders — it's a hanging piece. Qxd3 simply captures it for free. Always scan the board for undefended enemy pieces, especially after exchanges. A piece that isn't protected is a gift."
  },
  {
    fen: "5rk1/5ppp/8/4Q3/8/8/8/R5K1 w - - 0 1",
    solution_moves: ["e5e8"],
    theme: "deflection",
    rating: 1200,
    description: "Deflect the defender for checkmate!",
    explanation: "Qe8+ deflects the black rook from its defensive post on f8. The rook must capture (Rxe8) because the king has no escape squares. But now the back rank is undefended! Rxe8# delivers checkmate — the rook from a1 captures on e8, and the king is trapped behind its own pawns. A deflection forces a defending piece away from its duty, exposing what it was guarding."
  },
  {
    fen: "3k4/8/8/8/3B4/8/8/3R2K1 w - - 0 1",
    solution_moves: ["d4f6"],
    theme: "double_check",
    rating: 1300,
    description: "Deliver a devastating double check!",
    explanation: "Bf6+ is a double check! The bishop attacks the king from f6 along the diagonal, and moving the bishop off the d-file reveals the rook on d1, which also checks the king. Two pieces checking simultaneously means the king MUST move — you can't block a double check, and you can't capture both attackers. Double checks are the most forcing moves in chess."
  },
  {
    fen: "6rk/6pp/8/6N1/8/8/8/7K w - - 0 1",
    solution_moves: ["g5f7"],
    theme: "smothered_mate",
    rating: 1400,
    description: "Smothered mate — the king's own pieces trap him!",
    explanation: "Nf7# is a smothered mate! The black king on h8 is completely surrounded by its own pieces: the rook on g8 and pawns on g7 and h7 block every escape square. The knight on f7 delivers check from an L-shape, and since the king can't move, capture the knight, or block a knight check, it's checkmate. Smothered mates are among the most beautiful patterns in chess."
  },
  {
    fen: "5rk1/5ppp/8/3Q4/8/8/8/3R2K1 w - - 0 1",
    solution_moves: ["d5d8"],
    theme: "mate_in_2",
    rating: 1100,
    description: "Find the queen sacrifice that leads to mate!",
    explanation: "Qd8+ is a queen sacrifice that forces mate in two! The queen checks the king on g8 along the 8th rank. The black rook on f8 must capture (Rxd8) because the king has no escape (pawns block f7, g7, h7). But now the back rank is open: Rd1xd8# delivers checkmate! The rook captures on d8, and the king is trapped behind its own pawns. Sacrificing your queen to force a mating sequence is one of the most satisfying moves in chess."
  },
  {
    fen: "8/4N2k/5P2/8/8/8/8/K6R w - - 0 1",
    solution_moves: ["h1h5"],
    theme: "mate_in_1",
    rating: 1300,
    description: "Anastasia's Mate — a classic pattern!",
    explanation: "Rh5# is Anastasia's Mate! The knight on e7 controls the king's escape squares on g6 and g8 (both are knight's L-shape moves away). The pawn on f6 controls g7. With the king on h7 fully boxed in, the rook delivers checkmate along the h-file. Anastasia's Mate is a classic mating pattern where a knight and rook work together to trap a king on the h-file."
  }
];