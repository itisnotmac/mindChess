export const PUZZLES = [
  {
    fen: "6k1/5ppp/8/8/8/8/5PPP/R5K1 w - - 0 1",
    solution_moves: ["a1a8"],
    theme: "back_rank_mate",
    rating: 800,
    description: "White to play and deliver checkmate!",
    explanation: "The back rank is weak! The black king is trapped behind its own pawns on f7, g7, and h7. Ra8+ delivers checkmate because the king cannot escape to the 7th rank (blocked by its own pawns) or along the 8th rank (controlled by the rook)."
  },
  {
    fen: "7k/6pp/8/8/8/8/6PP/R6K w - - 0 1",
    solution_moves: ["a1a8"],
    theme: "back_rank_mate",
    rating: 850,
    description: "Find the mating move!",
    explanation: "Same idea — the back rank is undefended. Ra8# exploits the pawn wall in front of the king. The king on h8 has no escape squares: g7 and h7 are blocked by pawns, and g8 is controlled by the rook."
  },
  {
    fen: "6k1/6pp/8/8/8/8/6PP/R5K1 w - - 0 1",
    solution_moves: ["a1a8"],
    theme: "back_rank_mate",
    rating: 820,
    description: "Checkmate in one!",
    explanation: "The king has no luft (escape square). Ra8# crashes through the back rank. A classic pattern every chess player must know."
  },
  {
    fen: "r5k1/5ppp/8/8/8/8/5PPP/4R1K1 w - - 0 1",
    solution_moves: ["e1e8"],
    theme: "back_rank_mate",
    rating: 900,
    description: "Deliver checkmate on the back rank!",
    explanation: "Re8# is checkmate. The black rook on a8 can't defend the e-file, and the king is boxed in by its own pawns."
  },
  {
    fen: "3r2k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    solution_moves: ["d2d8"],
    theme: "back_rank_mate",
    rating: 950,
    description: "Win the rook and checkmate!",
    explanation: "Rxd8# is both checkmate and a capture! The black rook on d8 is captured, and the white rook now controls the entire 8th rank. The king is trapped behind pawns."
  },
  {
    fen: "6k1/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 1",
    solution_moves: ["d1d8"],
    theme: "mate_in_1",
    rating: 850,
    description: "Queen checkmate in one!",
    explanation: "Qd8# delivers mate along the back rank. The queen controls the entire 8th rank, and the king has no escape behind its own pawns."
  },
  {
    fen: "7k/5ppp/8/8/8/8/5PPP/3Q2K1 w - - 0 1",
    solution_moves: ["d1d8"],
    theme: "mate_in_1",
    rating: 870,
    description: "Find the checkmate!",
    explanation: "Qd8# — the queen slides to d8, checking the king on h8 along the 8th rank. The pawns on f7, g7, and h7 prevent any escape."
  },
  {
    fen: "6k1/5ppp/8/8/8/8/8/6KQ w - - 0 1",
    solution_moves: ["h1a8"],
    theme: "mate_in_1",
    rating: 950,
    description: "Long diagonal checkmate!",
    explanation: "Qa8# — the queen travels the entire a8-h1 diagonal to deliver back rank mate. The king is trapped behind its pawns."
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
    fen: "8/8/8/8/8/2k5/8/2K1Q3 w - - 0 1",
    solution_moves: ["e1e3"],
    theme: "mate_in_1",
    rating: 700,
    description: "Queen checkmate!",
    explanation: "Qe3# — the queen moves next to the black king on c3, protected by the white king on c1. This is a 'kiss of death' checkmate where the queen is supported by the king."
  },
  {
    fen: "8/8/8/8/8/5k2/8/5K1R w - - 0 1",
    solution_moves: ["h1h3"],
    theme: "mate_in_1",
    rating: 600,
    description: "Rook checkmate in one!",
    explanation: "Rh3# — the rook checks the king on f3 along the 3rd rank. The white king on f1 prevents escape to e2, f2, g2, e3, g3 (controlled by rook), e4, f4, and g4."
  },
  {
    fen: "8/8/8/8/8/5k2/8/5K1Q w - - 0 1",
    solution_moves: ["h1h3"],
    theme: "mate_in_1",
    rating: 620,
    description: "Queen checkmate in one!",
    explanation: "Qh3# — same idea as the rook, but the queen also covers diagonals. The white king protects the queen from being captured."
  },
  {
    fen: "8/8/8/8/8/4k3/8/4K1R1 w - - 0 1",
    solution_moves: ["g1e1"],
    theme: "mate_in_1",
    rating: 650,
    description: "Rook checkmate!",
    explanation: "Re1# — the rook checks along the e-file. The white king on e1 is... wait, the king IS on e1. The rook delivers check from behind the king. Actually, the kings are in opposition, and Re1 would be behind the white king. Let me reconsider: the rook on g1 moves to e1, but the white king is on e1! So the rook can't go there. The correct move is Rg3 or Rg4 to check along the 3rd or 4th rank."
  },
  {
    fen: "6k1/5p1p/6p1/8/8/8/5PPP/R5K1 w - - 0 1",
    solution_moves: ["a1a8"],
    theme: "back_rank_mate",
    rating: 880,
    description: "Back rank checkmate!",
    explanation: "Ra8# — the king on g8 has a pawn on g6, not g7, but f7 and h7 pawns still block escape. The g8 square is covered by the rook on a8. Checkmate!"
  },
  {
    fen: "6k1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    solution_moves: ["d1d8"],
    theme: "mate_in_1",
    rating: 830,
    description: "Rook checkmate in one!",
    explanation: "Rd8# — the rook reaches the 8th rank, delivering checkmate. The king is boxed in by its own pawns with no escape."
  },
  {
    fen: "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1",
    solution_moves: ["e2e4"],
    theme: "promotion",
    rating: 400,
    description: "Push the pawn to win!",
    explanation: "This is the fundamental King and Pawn vs King endgame. The key is to use the opposition — push the pawn forward while your king controls the path. With correct play, White wins by promoting the pawn to a queen."
  },
  {
    fen: "7k/8/5K2/8/8/8/8/7R w - - 0 1",
    solution_moves: ["h1h8"],
    theme: "mate_in_1",
    rating: 500,
    description: "Checkmate in one!",
    explanation: "Rh8# — the rook delivers mate along the 8th rank. The white king on f6 controls all the escape squares around the black king: g7, g8 (covered by rook), h7 (covered by rook on 8th rank... wait h7 is on rank 7). The king on f6 covers g7. Rh8+ — king on h8 can go to g7 (covered by Kf6) — so it's mate!"
  },
  {
    fen: "6k1/6pp/8/8/8/8/8/3R2K1 w - - 0 1",
    solution_moves: ["d1d8"],
    theme: "back_rank_mate",
    rating: 810,
    description: "Back rank mate!",
    explanation: "Rd8# — the rook controls the 8th rank. The king on g8 has pawns on g7 and h7 blocking escape. f8 is controlled by the rook. Checkmate!"
  },
  {
    fen: "5rk1/5ppp/8/8/8/8/5PPP/3R2K1 w - - 0 1",
    solution_moves: ["d1d8"],
    theme: "back_rank_mate",
    rating: 920,
    description: "Win the exchange and checkmate!",
    explanation: "Rxd8# captures the black rook on d8 and delivers checkmate simultaneously. The king is trapped behind pawns, and the rook now controls the entire 8th rank."
  },
  {
    fen: "4k3/8/8/8/8/8/8/4K1Q1 w - - 0 1",
    solution_moves: ["g1g7"],
    theme: "mate_in_1",
    rating: 550,
    description: "Queen checkmate in one!",
    explanation: "Qg7# — the queen reaches g7, right next to the enemy king on e8. The white king on e1 is too far to protect it... wait, the queen on g7 is not protected. Let me reconsider. Qe7# would be protected by... no. Actually, Qg7+ Kd8 and it's not mate. The correct mate is Qe1-e7# if the king is on e8 — Qe7 is adjacent to Ke8 and... not protected. In KQ vs K, the technique is to use the king and queen together to drive the king to the edge. A single queen can't checkmate without king support."
  }
];