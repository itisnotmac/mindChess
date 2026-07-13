export const OPENINGS = [
  {
    name: "Ruy Lopez",
    eco: "C60",
    difficulty: "intermediate",
    description: "One of the oldest and most respected openings in chess. White attacks the knight defending e5, creating long-term strategic pressure.",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bb5"],
    variations: [
      {
        name: "Morphy Defense",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6"],
        explanation: "Black plays a6 to immediately question the bishop's intentions. This is the most popular and flexible response, used by players of all levels from club to world championship."
      },
      {
        name: "Exchange Variation",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "a6", "Bxc6", "dxc6"],
        explanation: "White trades the bishop for the knight, giving Black doubled pawns. White aims for a superior pawn structure and endgame advantage."
      },
      {
        name: "Berlin Defense",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bb5", "Nf6"],
        explanation: "The rock-solid Berlin Defense. Black invites the endgame after 0-0 Bxc6 dxc6. Kramnik used this to dethrone Kasparov in 2000."
      }
    ]
  },
  {
    name: "Sicilian Defense",
    eco: "B20",
    difficulty: "advanced",
    description: "Black's most aggressive response to 1.e4. Creates an asymmetrical position with winning chances for both sides.",
    moves: ["e4", "c5"],
    variations: [
      {
        name: "Open Sicilian",
        moves: ["e4", "c5", "Nf3", "Nc6", "d4", "cxd4", "Nxd4"],
        explanation: "White opens the center, leading to sharp tactical battles. The most testing response, favored by aggressive players."
      },
      {
        name: "Najdorf Variation",
        moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "a6"],
        explanation: "The Cadillac of Sicilians. Black plays a6 to control b5 and prepare ...e5 or ...b5. Fischer and Kasparov's favorite."
      },
      {
        name: "Dragon Variation",
        moves: ["e4", "c5", "Nf3", "d6", "d4", "cxd4", "Nxd4", "Nf6", "Nc3", "g6"],
        explanation: "Black fianchettoes the bishop to g7, creating the 'dragon' that breathes fire down the long diagonal. Sharp, double-edged play."
      }
    ]
  },
  {
    name: "Italian Game",
    eco: "C50",
    difficulty: "beginner",
    description: "A classic opening ideal for beginners. Develops pieces naturally and targets the weak f7 square.",
    moves: ["e4", "e5", "Nf3", "Nc6", "Bc4"],
    variations: [
      {
        name: "Giuoco Piano",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5"],
        explanation: "The 'Quiet Game.' Both sides develop naturally. Despite the name, it can lead to sharp tactical play."
      },
      {
        name: "Evans Gambit",
        moves: ["e4", "e5", "Nf3", "Nc6", "Bc4", "Bc5", "b4"],
        explanation: "White sacrifices a pawn for rapid development and central control. A romantic gambit from the 19th century, still dangerous today."
      }
    ]
  },
  {
    name: "French Defense",
    eco: "C00",
    difficulty: "intermediate",
    description: "A solid, strategic defense where Black fights for the center with pawns rather than pieces. Leads to rich positional play.",
    moves: ["e4", "e6"],
    variations: [
      {
        name: "Advance Variation",
        moves: ["e4", "e6", "d4", "d5", "e5"],
        explanation: "White grabs space in the center. Black will attack the base of the chain with ...c5 and ...f6."
      },
      {
        name: "Winawer Variation",
        moves: ["e4", "e6", "d4", "d5", "Nc3", "Bb4"],
        explanation: "Black pins the knight, leading to sharp imbalanced positions. A favorite of strategic players."
      }
    ]
  },
  {
    name: "Queen's Gambit",
    eco: "D06",
    difficulty: "intermediate",
    description: "Despite the name, it's not a true gambit. White offers a pawn to control the center, but can easily recover it.",
    moves: ["d4", "d5", "c4"],
    variations: [
      {
        name: "Queen's Gambit Accepted",
        moves: ["d4", "d5", "c4", "dxc4"],
        explanation: "Black accepts the pawn. White gets central control and development in return. Solid and well-tested."
      },
      {
        name: "Slav Defense",
        moves: ["d4", "d5", "c4", "c6"],
        explanation: "Black supports d5 with the c-pawn instead of the knight, keeping the light-squared bishop's diagonal open."
      }
    ]
  },
  {
    name: "King's Indian Defense",
    eco: "E60",
    difficulty: "advanced",
    description: "A hypermodern opening where Black lets White build a big center, then attacks it with piece play and pawn breaks.",
    moves: ["d4", "Nf6", "c4", "g6"],
    variations: [
      {
        name: "Classical Variation",
        moves: ["d4", "Nf6", "c4", "g6", "Nc3", "Bg7", "e4", "d6", "Nf3", "O-O"],
        explanation: "Both sides castle kingside. White expands on the queenside while Black launches a fierce pawn storm on the kingside."
      }
    ]
  },
  {
    name: "Caro-Kann Defense",
    eco: "B10",
    difficulty: "beginner",
    description: "One of the most solid defenses against 1.e4. Black develops soundly with a strong pawn structure.",
    moves: ["e4", "c6"],
    variations: [
      {
        name: "Classical Variation",
        moves: ["e4", "c6", "d4", "d5", "Nc3", "dxe4", "Nxe4", "Bf5"],
        explanation: "Black develops the bishop before playing ...e6, avoiding the bad French bishop. Solid and reliable."
      },
      {
        name: "Advance Variation",
        moves: ["e4", "c6", "d4", "d5", "e5"],
        explanation: "White grabs space. Black attacks the base with ...c5 and develops behind the pawn chain."
      }
    ]
  },
  {
    name: "English Opening",
    eco: "A10",
    difficulty: "intermediate",
    description: "A flexible flank opening. White controls d5 from the side and can transpose into many different structures.",
    moves: ["c4"],
    variations: [
      {
        name: "Symmetrical Variation",
        moves: ["c4", "c5"],
        explanation: "Black mirrors White's move, creating a balanced position. Both sides have full freedom of piece development."
      }
    ]
  }
];