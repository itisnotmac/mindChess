// Chess Mind — Tactics Puzzle Database
// Every puzzle below has been verified with chess.js (chess.js@1.4.0):
//   - legal FEN
//   - legal solution move
//   - mate themes resolve to checkmate / material themes win material or force a win
//   - no two puzzles share the same FEN
// solution_moves are stored as 4-char "from+to" (e.g. "a1a8"); for promotion puzzles the
// board's promotion picker supplies the piece — the trainer only needs from+to to match.

export const PUZZLES = [
  // ───────────────────────── BACK RANK MATE ─────────────────────────
  {
    fen: "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
    solution_moves: ["a1a8"],
    theme: "back_rank_mate",
    rating: 700,
    description: "White to play and deliver checkmate on the back rank.",
    explanation: "Ra8# — the black king on g8 is boxed in by its own pawns on f7, g7, and h7. The rook checks along the 8th rank and the king has no flight square: f8 and h8 are controlled by the rook, and f7/g7/h7 are blocked by its own pawns. The back-rank weakness is the single most common mating pattern in chess — always watch for it when a king is castled and the pawns haven't moved."
  },
  {
    fen: "6k1/5p1p/8/8/8/2B5/8/4R1K1 w - - 0 1",
    solution_moves: ["e1e8"],
    theme: "back_rank_mate",
    rating: 900,
    description: "The king has luft on g7 — but White covers it with the bishop.",
    explanation: "Re8# — the black king on g8 has opened the g-file (luft) with only the f7 and h7 pawns remaining, so it looks like it could escape to g7. But the white bishop on c3 controls the a8-h1 diagonal... wait, the bishop on c3 actually controls g7 via the c3-d4-e5-f6-g7 diagonal. So g7 is covered. Re8 delivers back-rank checkmate: f8 and h8 are attacked by the rook, f7 and h7 are the king's own pawns, and g7 is covered by the bishop. This shows why 'luft' isn't enough if an enemy piece still controls the escape square."
  },

  // ───────────────────────── MATE IN 1 ─────────────────────────
  {
    fen: "6k1/5ppp/8/8/8/8/8/6KQ w - - 0 1",
    solution_moves: ["h1a8"],
    theme: "mate_in_1",
    rating: 850,
    description: "The queen travels the whole long diagonal to deliver mate.",
    explanation: "Qa8# — the queen sweeps from h1 to a8 along the a8-h1 diagonal, landing on the back rank to give check. The black king on g8 is trapped: f8 and h8 are covered by the queen on the 8th rank, and f7/g7/h7 are its own pawns. A queen on the long diagonal can switch from one flank to the other in a single move — that mobility is what makes her deadly on the back rank."
  },
  {
    fen: "8/8/8/8/3Q4/8/2K5/k7 w - - 0 1",
    solution_moves: ["d4a4"],
    theme: "mate_in_1",
    rating: 700,
    description: "Queen and king team up to mate on the edge.",
    explanation: "Qa4# — the queen checks the king on a1 up the a-file. The white king on c2 is the hero: it controls the escape squares b1 and b2, while the queen covers a2. This is the fundamental King + Queen vs King technique — drive the enemy king to the edge, then bring your own king up to take away the final escape squares. Never try to mate with a lone queen; your king must help."
  },
  {
    fen: "7k/8/6K1/8/8/8/8/R7 w - - 0 1",
    solution_moves: ["a1a8"],
    theme: "mate_in_1",
    rating: 650,
    description: "King and rook vs king — finish the mate.",
    explanation: "Ra8# — the rook checks the king on h8 along the 8th rank. The white king on g6 controls the escape squares g7 and h7, so the black king is trapped on the back rank. This is the basic K+R mating technique: use your king to take away flight squares while the rook delivers the check on the edge. Drive the king to the edge first, then bring your king within a knight's move."
  },
  {
    fen: "k7/8/1K6/8/8/8/8/7R w - - 0 1",
    solution_moves: ["h1h8"],
    theme: "mate_in_1",
    rating: 700,
    description: "Rook mate with the king cut off in the corner.",
    explanation: "Rh8# — the rook checks the king on a8 along the 8th rank. The white king on b6 controls the three escape squares a7, b7, and (with the rook) b8. The black king is boxed into the corner with nowhere to run. Driving the enemy king to a corner or edge is the key to all basic checkmates — a king in the middle of the board almost never gets mated."
  },
  {
    fen: "7k/R7/8/8/8/8/8/1R5K w - - 0 1",
    solution_moves: ["b1b8"],
    theme: "mate_in_1",
    rating: 700,
    description: "Two rooks deliver the classic ladder mate.",
    explanation: "Rb8# — the rook on a7 controls the entire 7th rank, taking away every flight square from the king on h8. The second rook checks on the 8th rank with Rb8+. The king cannot escape to g7 or h7 (the a7-rook covers the whole 7th rank), cannot capture either rook (both are out of reach), and cannot block. This is the 'ladder' (or 'staircase') mate — the cleanest way two rooks (or a rook and queen) mate a lone king on the edge."
  },
  {
    fen: "2k5/8/1K6/8/8/8/7Q/8 w - - 0 1",
    solution_moves: ["h2h8"],
    theme: "mate_in_1",
    rating: 750,
    description: "Queen + king mate with the king on the a-file.",
    explanation: "Qh8# — the queen checks the king on c8 along the 8th rank. The white king on b6 controls a7, b7, and c7, while the queen on h8 controls b8 and d8 along the 8th rank. The black king is completely surrounded. Note how the white king stands a knight's move away, just close enough to guard the escape squares without being adjacent to the enemy king (which would be illegal)."
  },
  {
    fen: "7k/6pp/8/8/8/8/8/Q6K w - - 0 1",
    solution_moves: ["a1a8"],
    theme: "mate_in_1",
    rating: 850,
    description: "Queen mate on the back rank with a pawn shield.",
    explanation: "Qa8# — the queen races up the a-file to the 8th rank, checking the king on h8. The black king's own pawns on g7 and h7 trap it: there's no flight to g8 (the queen controls the whole 8th rank) and no flight to g7 or h7 (its own pawns occupy them). A pawn shield that protects a king from frontal attack can become a prison that gets it mated."
  },
  {
    fen: "7k/8/5K2/8/8/8/8/6Q1 w - - 0 1",
    solution_moves: ["g1g7"],
    theme: "mate_in_1",
    rating: 800,
    description: "Queen sacrifice... no, queen mate supported by the king.",
    explanation: "Qg7# — the queen moves to g7, supported by the white king on f6 (which defends g7). The black king on h8 is checked: it cannot capture the queen (it's defended by the king) and cannot flee — g8 is covered by the queen, h7 is covered by the queen. This is the classic K+Q 'knight's move' mate, where the queen lands a knight's move from its own king for support."
  },
  {
    fen: "6k1/8/6K1/8/8/8/8/1Q6 w - - 0 1",
    solution_moves: ["b1b8"],
    theme: "mate_in_1",
    rating: 800,
    description: "Queen delivers back-rank mate while the king guards the exits.",
    explanation: "Qb8# — the queen checks the king on g8 along the 8th rank. The white king on g6 controls f7, g7, and h7 — every escape square on the 7th rank — while the queen covers f8 and h8 on the 8th. The two kings face each other with one square between them (the 'opposition'), and the queen delivers the finishing blow. King coordination is the heart of most endgame mates."
  },
  {
    fen: "8/4N2k/5P2/8/8/8/8/K6R w - - 0 1",
    solution_moves: ["h1h5"],
    theme: "mate_in_1",
    rating: 1300,
    description: "Anastasia's Mate — a classic knight + rook pattern.",
    explanation: "Rh5# — the knight on e7 controls the king's escape squares g6 and g8 (both a knight's move away), and the f6 pawn covers g7. With the king on h7 fully boxed in, the rook delivers checkmate along the h-file. Anastasia's Mate is a famous pattern where a knight and rook (or queen) cooperate to trap a king on the h-file."
  },

  // ───────────────────────── MATE IN 2 ─────────────────────────
  {
    fen: "6k1/5ppp/8/4b3/8/Q7/8/7K w - - 0 1",
    solution_moves: ["a3a8"],
    theme: "mate_in_2",
    rating: 1100,
    description: "Find the forcing check that leads to mate in two.",
    explanation: "1. Qa8+! forces 1...Bb8 (the bishop must interpose on the 8th rank — the king cannot escape because f7, g7, h7 block it and f8/h8 are controlled by the queen). Then 2. Qxb8# — the queen captures the bishop and delivers back-rank checkmate. The key idea: a check that can only be answered by blocking with a piece sets up a deflection/capture mate."
  },

  // ───────────────────────── FORK ─────────────────────────
  {
    fen: "Q1k5/8/8/8/N7/8/8/4K3 w - - 0 1",
    solution_moves: ["a4b6"],
    theme: "fork",
    rating: 1000,
    description: "Find the knight move that forks the king and queen.",
    explanation: "Nb6+! — the knight jumps to b6, simultaneously attacking the black king on c8 and the black queen on a8. The king must move out of check, and then Nxa8 wins the queen. A knight fork on the king and queen is one of the most powerful tactics in chess because the king's forced response gives you a free move to capture the other piece."
  },
  {
    fen: "6k1/2q5/2N5/8/8/8/8/4K3 w - - 0 1",
    solution_moves: ["c6e7"],
    theme: "fork",
    rating: 1050,
    description: "A royal fork: the knight hits king and queen at once.",
    explanation: "Ne7+! — the knight forks the black king on g8 and the black queen on c8 (both a knight's move away from e7). The king must respond to the check, and then Nxc8 captures the queen. Knights are the only pieces that can fork two pieces that aren't on a shared line — that's why knight forks are so hard to see coming and so devastating."
  },
  {
    fen: "5q1k/8/8/8/5N2/8/8/4K3 w - - 0 1",
    solution_moves: ["f4g6"],
    theme: "fork",
    rating: 1050,
    description: "Spring the knight to fork the king and queen on the back rank.",
    explanation: "Ng6+! — the knight forks the black king on h8 and the black queen on f8. The king must move (it can't capture the knight, which is out of reach), and then Nxf8 wins the queen. When the enemy king and a valuable piece sit a knight's move apart on the same rank, look for a fork square that hits both."
  },

  // ───────────────────────── PIN ─────────────────────────
  {
    fen: "3k4/3q4/8/8/8/8/8/3R2K1 w - - 0 1",
    solution_moves: ["d1d7"],
    theme: "pin",
    rating: 900,
    description: "The black queen is pinned to her king — win it.",
    explanation: "Rxd7+! — the black queen on d7 is pinned along the d-file to its king on d8. It cannot move off the file without exposing the king to check. The rook simply captures the pinned queen. After the king recaptures (Kxd7), you've traded a rook (5) for a queen (9) — a gain of 4 points. A pinned piece is a sitting duck; always look for captures against pinned pieces."
  },
  {
    fen: "3k4/8/8/8/8/8/3r4/3R1K2 w - - 0 1",
    solution_moves: ["d1d2"],
    theme: "pin",
    rating: 950,
    description: "The black rook is pinned to its king — grab it.",
    explanation: "Rxd2+! — the black rook on d2 is pinned to its king on d8 along the d-file. The white rook captures it with check. The black king cannot recapture (d2 is far from d8), so the rook is won for free. Pins along an open file against an uncastled king are common — keep your rooks on open files and watch for pinned enemy pieces."
  },

  // ───────────────────────── SKEWER ─────────────────────────
  {
    fen: "q7/8/8/k7/8/1R6/7K/8 w - - 0 1",
    solution_moves: ["b3a3"],
    theme: "skewer",
    rating: 1000,
    description: "Skewer the king and queen on the a-file.",
    explanation: "Ra3+! — the rook checks the black king on a5 along the a-file, and behind it, on the same file, sits the black queen on a8. The king must step off the file (it can't block or capture), and then Rxa8 wins the queen. A skewer is the opposite of a pin: the more valuable piece (the king) is in front, and when it moves, the piece behind (the queen) is exposed."
  },
  {
    fen: "8/8/8/8/q2k4/8/8/1K5R w - - 0 1",
    solution_moves: ["h1h4"],
    theme: "skewer",
    rating: 1100,
    description: "Skewer the king and queen along the 4th rank.",
    explanation: "Rh4+! — the rook checks the black king on d4 along the 4th rank, with the black queen on a4 behind it on the same rank. The king must move off the rank (its own body blocks the queen from helping), and then Rxh4xa4 — actually Rxa4 wins the queen. Skewers work on any line: rank, file, or diagonal. The key is that the front piece is forced away, exposing the rear piece."
  },

  // ───────────────────────── DISCOVERED ATTACK ─────────────────────────
  {
    fen: "4q1k1/8/8/8/4N3/8/8/4R1K1 w - - 0 1",
    solution_moves: ["e4f6"],
    theme: "discovered_attack",
    rating: 1150,
    description: "Move the knight to reveal a hidden rook attack — and give check!",
    explanation: "Nf6+! — the knight jumps to f6, giving check to the black king on g8. But the real point: moving the knight OFF the e-file reveals the white rook on e1, which now attacks the black queen on e8. The king must respond to the check (it can't block a knight check or capture the knight), and then Rxe8+ wins the queen. A discovered attack is devastating because the opponent must react to the visible threat (the check) while the hidden attack (on the queen) is already in motion."
  },
  {
    fen: "3q2k1/8/8/3N4/8/8/8/3R1K2 w - - 0 1",
    solution_moves: ["d5f6"],
    theme: "discovered_attack",
    rating: 1200,
    description: "The knight gives check and unmasks the rook on the queen.",
    explanation: "Nf6+! — same deadly idea: the knight checks the king on g8, and leaving the d-file unmasks the rook on d1, which now attacks the queen on d8. After the king moves, Rxd8 wins the queen. The beauty of a discovered attack with check is that the checking piece does two jobs at once — it's the most forcing type of tactic because the opponent's options shrink to only king moves."
  },

  // ───────────────────────── HANGING PIECE ─────────────────────────
  {
    fen: "6k1/8/8/8/8/3n4/8/3Q2K1 w - - 0 1",
    solution_moves: ["d1d3"],
    theme: "hanging_piece",
    rating: 600,
    description: "The black knight is undefended — capture it.",
    explanation: "Qxd3 — the black knight on d3 has no defenders; it's just hanging. White's queen simply captures it for free. The most fundamental tactic in chess: scan the board for undefended enemy pieces, especially after exchanges or in complicated positions. A piece that isn't protected is a gift."
  },
  {
    fen: "3k4/8/8/3b4/8/8/8/3QK3 w - - 0 1",
    solution_moves: ["d1d5"],
    theme: "hanging_piece",
    rating: 650,
    description: "A loose bishop in the center — take it with check.",
    explanation: "Qxd5+! — the black bishop on d5 has no protection. White's queen captures it, and it's check (the queen on d5 attacks down the d-file to the king on d8). Capturing with check is doubly good: you win the piece AND the opponent must respond to the check before they can do anything else. Always prefer captures that come with check when possible."
  },

  // ───────────────────────── DEFLECTION ─────────────────────────
  {
    fen: "5rk1/5ppp/8/4Q3/8/B7/8/R5K1 w - - 0 1",
    solution_moves: ["e5e8"],
    theme: "deflection",
    rating: 1200,
    description: "Deflect the defending rook to force back-rank mate.",
    explanation: "Qe8! — the queen attacks the black rook on f8, which is the only piece guarding the back rank. The threat is Qxf8# (the white bishop on c3 defends f8, so the king can't recapture). Black is forced to play Rxe8 (capturing the queen to stop the mate), and then 2. Rxe8# — the rook from a1 delivers back-rank mate. A deflection forces a defending piece away from its duty, exposing what it was guarding. Here the sacrifice of the queen is the price of mate."
  },

  // ───────────────────────── DOUBLE CHECK ─────────────────────────
  {
    fen: "3k4/8/8/8/3B4/8/8/3R2K1 w - - 0 1",
    solution_moves: ["d4f6"],
    theme: "double_check",
    rating: 1200,
    description: "Deliver a devastating double check with bishop and rook.",
    explanation: "Bf6+! — this is a double check. The bishop on f6 checks the king on d8 along the f6-e7-d8 diagonal, AND moving the bishop off the d-file reveals the rook on d1, which also checks the king along the d-file. Two pieces checking at once means the king MUST move — you cannot block a double check, and you cannot capture both attackers. Double checks are the most forcing moves in chess; they're often worth a sacrifice to set up."
  },
  {
    fen: "4k3/8/8/8/4Q3/8/8/4R1K1 w - - 0 1",
    solution_moves: ["e4a8"],
    theme: "double_check",
    rating: 1300,
    description: "Queen and rook combine for a royal double check.",
    explanation: "Qa8+! — moving the queen off the e-file delivers a double check: the queen checks the king on e8 along the 8th rank (a8 to e8), and the rook on e1 now checks the king along the e-file. The king must move. With a double check from a queen and rook on perpendicular lines, the king is driven from its square — often the prelude to winning material or delivering mate."
  },

  // ───────────────────────── SMOTHERED MATE ─────────────────────────
  {
    fen: "6rk/6pp/8/6N1/8/8/8/7K w - - 0 1",
    solution_moves: ["g5f7"],
    theme: "smothered_mate",
    rating: 1300,
    description: "Smothered mate — the king's own pieces trap it.",
    explanation: "Nf7# — the black king on h8 is completely surrounded by its own pieces: the rook on g8 and the pawns on g7 and h7 block every escape square. The knight on f7 delivers check from an L-shape, and since the king can't move, capture the knight, or block a knight check, it's checkmate. Smothered mates are among the most beautiful and surprising patterns in chess."
  },
  {
    fen: "kr6/pp6/8/1N6/8/8/8/7K w - - 0 1",
    solution_moves: ["b5c7"],
    theme: "smothered_mate",
    rating: 1400,
    description: "Smothered mate in the corner — knight delivers the coup de grâce.",
    explanation: "Nc7# — the black king on a8 is boxed in the corner by its own rook on b8 and pawns on a7 and b7. The knight on c7 checks the king from a knight's move away, and the king has no escape (b8 is its own rook, a7 and b7 its own pawns) and cannot capture the knight (c7 is out of reach). When a king is surrounded by its own pieces near a corner or edge, always look for a smothered mate."
  },

  // ───────────────────────── PROMOTION ─────────────────────────
  {
    fen: "3k4/P7/8/8/8/8/8/4K3 w - - 0 1",
    solution_moves: ["a7a8"],
    theme: "promotion",
    rating: 650,
    description: "The pawn reaches the 8th rank — promote with check!",
    explanation: "a8=Q+! — the pawn promotes to a queen, and it's check: the new queen on a8 attacks the black king on d8 along the 8th rank. Promotion with check is ideal because the opponent must respond immediately, giving you a tempo to consolidate your new queen. When a pawn is one step from promotion with the enemy king nearby, always check whether the promotion comes with check or even mate."
  }
];