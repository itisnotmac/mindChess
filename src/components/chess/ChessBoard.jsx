import React, { useState, useEffect } from 'react';
import { getBoard, getLegalMoves, getTurn, getCheckSquare, PIECE_UNICODE } from '@/lib/chessEngine';
import { playSound } from '@/lib/sound';

export default function ChessBoard({ game, fen, onMove, orientation = 'white', interactive = true, lastMove = null, movableColor = null, className = '' }) {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [legalMoves, setLegalMoves] = useState([]);
  const [pendingPromotion, setPendingPromotion] = useState(null);
  const [dragSquare, setDragSquare] = useState(null);

  useEffect(() => {
    setSelectedSquare(null);
    setLegalMoves([]);
  }, [fen]);

  if (!game) return null;

  const board = getBoard(game);
  const turn = getTurn(game);
  const checkSquare = getCheckSquare(game);
  const canMove = interactive && (movableColor === null || movableColor === turn);

  const rows = orientation === 'black' ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];
  const cols = orientation === 'black' ? [7, 6, 5, 4, 3, 2, 1, 0] : [0, 1, 2, 3, 4, 5, 6, 7];

  function getSquareName(r, c) {
    return String.fromCharCode(97 + c) + (8 - r);
  }

  function handleSquareClick(square) {
    if (!canMove) return;
    if (selectedSquare) {
      const move = legalMoves.find(m => m.to === square);
      if (move) {
        if (move.promotion) {
          setPendingPromotion({ from: selectedSquare, to: square });
        } else {
          onMove(selectedSquare, square, 'q');
        }
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }
    }
    const moves = getLegalMoves(game, square);
    if (moves.length > 0) {
      playSound('select');
      setSelectedSquare(square);
      setLegalMoves(moves);
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
    }
  }

  function handleDrop(targetSquare) {
    if (!canMove || !dragSquare) return;
    const moves = getLegalMoves(game, dragSquare);
    const move = moves.find(m => m.to === targetSquare);
    if (move) {
      if (move.promotion) {
        setPendingPromotion({ from: dragSquare, to: targetSquare });
      } else {
        onMove(dragSquare, targetSquare, 'q');
      }
    }
    setDragSquare(null);
    setSelectedSquare(null);
    setLegalMoves([]);
  }

  function handleDragStart(square) {
    if (!canMove) return;
    const moves = getLegalMoves(game, square);
    if (moves.length > 0) {
      setDragSquare(square);
      setSelectedSquare(square);
      setLegalMoves(moves);
    }
  }

  function selectPromotion(piece) {
    if (pendingPromotion) {
      onMove(pendingPromotion.from, pendingPromotion.to, piece);
    }
    setPendingPromotion(null);
  }

  return (
    <div className={`relative w-full aspect-square ${className}`} style={{ maxWidth: '600px' }}>
      <div className="grid grid-cols-8 w-full h-full rounded-lg overflow-hidden border-2 teal-border-glow">
        {rows.map((r, ri) =>
          cols.map((c, ci) => {
            const piece = board[r][c];
            const square = getSquareName(r, c);
            const isDark = (r + c) % 2 === 0;
            const isSelected = selectedSquare === square;
            const isLegal = legalMoves.some(m => m.to === square);
            const isCapture = isLegal && (piece || legalMoves.some(m => m.to === square && (m.flags.includes('c') || m.flags.includes('e'))));
            const isLastMove = lastMove && (lastMove.from === square || lastMove.to === square);
            const isCheck = checkSquare === square;

            return (
              <div
                key={square}
                onClick={() => handleSquareClick(square)}
                onDragOver={(e) => canMove && e.preventDefault()}
                onDrop={() => handleDrop(square)}
                className={`relative flex items-center justify-center cursor-pointer select-none
                  ${isDark ? 'board-dark' : 'board-light'}
                  ${isSelected ? 'board-selected' : ''}
                  ${isLastMove && !isSelected ? 'board-last-move' : ''}
                  ${isCheck ? 'board-check' : ''}
                `}
              >
                {ci === 0 && (
                  <span className={`absolute top-0 left-0.5 text-[10px] font-bold ${isDark ? 'text-[#E8D5B7]' : 'text-[#1A1A2E]'}`}>
                    {8 - r}
                  </span>
                )}
                {ri === 7 && (
                  <span className={`absolute bottom-0 right-0.5 text-[10px] font-bold ${isDark ? 'text-[#E8D5B7]' : 'text-[#1A1A2E]'}`}>
                    {String.fromCharCode(97 + c)}
                  </span>
                )}

                {piece && (
                  <span
                    draggable={canMove && piece.color === turn}
                    onDragStart={() => handleDragStart(square)}
                    onDragEnd={() => setDragSquare(null)}
                    className={`text-4xl sm:text-5xl md:text-6xl cursor-grab active:cursor-grabbing transition-transform hover:scale-110
                      ${piece.color === 'w' ? 'text-white' : 'text-[#1A1A2E]'}
                    `}
                    style={{
                      textShadow: piece.color === 'w'
                        ? '0 1px 3px rgba(0,0,0,0.6), 0 0 6px rgba(0,229,204,0.15)'
                        : '0 1px 3px rgba(255,255,255,0.1), 0 0 2px rgba(0,0,0,0.4)'
                    }}
                  >
                    {PIECE_UNICODE[piece.type]}
                  </span>
                )}

                {isLegal && !isCapture && (
                  <div className="absolute w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#00E5CC] opacity-60" />
                )}
                {isLegal && isCapture && (
                  <div className="absolute inset-1 rounded-full border-[3px] border-[#00E5CC] opacity-60" />
                )}
              </div>
            );
          })
        )}
      </div>

      {pendingPromotion && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center z-10 rounded-lg">
          <div className="bg-card border border-primary/30 rounded-lg p-4 flex gap-2 teal-glow-sm">
            {['q', 'r', 'b', 'n'].map(p => (
              <button
                key={p}
                onClick={() => selectPromotion(p)}
                className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center text-4xl sm:text-5xl bg-secondary hover:bg-primary/20 rounded-lg transition-colors ${turn === 'w' ? 'text-white' : 'text-[#1A1A2E]'}`}
                style={{ textShadow: turn === 'w' ? '0 1px 3px rgba(0,0,0,0.6)' : '0 1px 3px rgba(255,255,255,0.1)' }}
              >
                {PIECE_UNICODE[p]}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}