export const ENDGAMES = [
  {
    name: "King and Pawn vs King",
    fen: "4k3/8/8/8/8/8/4P3/4K3 w - - 0 1",
    concept: "opposition",
    difficulty: "beginner",
    description: "The most fundamental endgame. Learn to promote your pawn to a queen!",
    explanation: "The key concept is the OPPOSITION. When kings face each other with one square between them, whoever has to move loses the opposition. Use your king to control the path of the pawn, push the enemy king back, and march your pawn to promotion."
  },
  {
    name: "King and Queen vs King",
    fen: "4k3/8/8/8/8/8/8/4KQ2 w - - 0 1",
    concept: "king_boxing",
    difficulty: "beginner",
    description: "Checkmate with a queen — drive the king to the edge!",
    explanation: "Use the queen to cut off the enemy king, shrinking its available space each move. Bring your king up to support the queen. The checkmate happens on the edge of the board when the king is trapped with your queen supported by your king."
  },
  {
    name: "King and Rook vs King",
    fen: "4k3/8/8/8/8/8/8/4KR2 w - - 0 1",
    concept: "ladder_mate",
    difficulty: "beginner",
    description: "Checkmate with a rook — the ladder technique!",
    explanation: "The technique is called the LADDER MATE. Use your king to take opposition, then check the enemy king with your rook, forcing it to move. Repeat this process, driving the king to the edge of the board for checkmate."
  },
  {
    name: "Two Rooks vs King",
    fen: "4k3/8/8/8/8/8/8/R6R w - - 0 1",
    concept: "ladder_mate",
    difficulty: "beginner",
    description: "The easiest checkmate — two rooks work together!",
    explanation: "The two rooks create a 'staircase' or 'ladder' mate. One rook cuts off a rank, the other checks the king, forcing it to move back. Repeat until the king is on the edge and gets mated. No king support needed!"
  },
  {
    name: "Back Rank Defense",
    fen: "6k1/5ppp/8/8/8/8/5PPP/4R1K1 b - - 0 1",
    concept: "luft",
    difficulty: "beginner",
    description: "Black to move — avoid back rank mate!",
    explanation: "White threatens Re8#. Black must create 'luft' (an escape square for the king). Playing ...h6 or ...g6 creates a flight square on h7 or g7. Always be aware of back rank threats in your own games!"
  },
  {
    name: "Queen vs Pawn Promotion",
    fen: "8/5k2/8/8/8/8/4p3/6K1 b - - 0 1",
    concept: "queen_vs_pawn",
    difficulty: "intermediate",
    description: "Black's pawn is about to promote. Can the queen stop it?",
    explanation: "When the defending king is close to the pawn, the queen can usually stop promotion. The technique involves checking the king to drive it away from the pawn, then capturing the pawn. But if the pawn is on the a/h-file with the king nearby, it can sometimes promote to a knight and fork!"
  },
  {
    name: "King and Two Pawns vs King",
    fen: "4k3/8/8/8/8/8/3PP3/4K3 w - - 0 1",
    concept: "connected_pawns",
    difficulty: "beginner",
    description: "Connected passed pawns are unstoppable!",
    explanation: "Two connected passed pawns are extremely powerful — they protect each other and advance together. Use your king to support them. Even if the enemy king captures one pawn, the other promotes."
  },
  {
    name: "Rook Endgame: Cutting Off the King",
    fen: "8/8/8/8/8/2k5/8/R3K3 w - - 0 1",
    concept: "cut_off_king",
    difficulty: "intermediate",
    description: "Use your rook to cut off the enemy king!",
    explanation: "In rook endgames, cutting off the enemy king from the action is crucial. Here, the rook on a1 cuts off the black king on c3 from the kingside. The white king can now freely advance and support pawn advances on the kingside."
  }
];