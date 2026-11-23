import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, ArrowUp, ArrowDown, ArrowRight } from 'lucide-react';
import { sounds } from '../../utils/audio';

const MAZE_SIZE = 7;

export default function TombRunGame({ onBack }) {
  // Cat pos, Gems, Traps, Exit
  const [catPos, setCatPos] = useState({ r: 1, c: 1 });
  const [gems, setGems] = useState([
    { r: 1, c: 5 }, { r: 5, c: 1 }, { r: 3, c: 3 }, { r: 5, c: 5 }
  ]);
  const [traps] = useState([
    { r: 2, c: 2 }, { r: 2, c: 4 }, { r: 4, c: 2 }, { r: 4, c: 4 }
  ]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const resetGame = () => {
    sounds.playClick();
    setCatPos({ r: 1, c: 1 });
    setGems([{ r: 1, c: 5 }, { r: 5, c: 1 }, { r: 3, c: 3 }, { r: 5, c: 5 }]);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
  };

  const moveCat = (dr, dc) => {
    if (gameOver || gameWon) return;

    const newR = catPos.r + dr;
    const newC = catPos.c + dc;

    // Walls check (outer perimeter)
    if (newR <= 0 || newR >= MAZE_SIZE - 1 || newC <= 0 || newC >= MAZE_SIZE - 1) {
      sounds.playDraw();
      return;
    }

    // Check traps
    if (traps.some(t => t.r === newR && t.c === newC)) {
      sounds.playDraw();
      setGameOver(true);
      return;
    }

    sounds.playMove(true);
    setCatPos({ r: newR, c: newC });

    // Check gems
    const collectedIdx = gems.findIndex(g => g.r === newR && g.c === newC);
    if (collectedIdx !== -1) {
      sounds.playWin();
      const nextGems = gems.filter((_, idx) => idx !== collectedIdx);
      setGems(nextGems);
      setScore(s => s + 100);

      if (nextGems.length === 0) {
        setGameWon(true);
        sounds.playWin();
        try {
          confetti({
            particleCount: 60,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#ffd700', '#ff2a85', '#00f0ff']
          });
        } catch {}
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <button
          onClick={() => { sounds.playNav(); onBack(); }}
          className="btn-neon-purple"
          style={{ padding: '8px 14px', borderRadius: '12px' }}
        >
          <ArrowLeft size={18} />
          <span>Geri</span>
        </button>

        <h2 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: '1.4rem',
          color: '#ffd700',
          textShadow: '0 0 10px #ffd700'
        }}>
          Tomb Run
        </h2>

        <button
          onClick={resetGame}
          className="btn-neon-cyan"
          style={{ padding: '8px 12px', borderRadius: '12px' }}
        >
          <RotateCcw size={18} />
        </button>
      </div>

      <div style={{
        textAlign: 'center',
        background: 'rgba(18, 5, 38, 0.7)',
        border: '1.5px solid #ff2a85',
        borderRadius: '14px',
        padding: '8px 14px',
        marginBottom: '16px',
        color: '#cbd5e1',
        fontSize: '0.85rem'
      }}>
        Neon kediyi ok tuşlarıyla yönlendir, tuzaklardan kaç ve mücevherleri topla!
        <div style={{ color: '#ffd700', fontWeight: 800, fontSize: '1.1rem', marginTop: '2px' }}>
          Puan: {score} | Kalan: {gems.length}
        </div>
      </div>

      {/* Maze Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${MAZE_SIZE}, 1fr)`,
        gridTemplateRows: `repeat(${MAZE_SIZE}, 1fr)`,
        gap: '4px',
        width: '100%',
        maxWidth: '340px',
        aspectRatio: '1 / 1',
        margin: '0 auto',
        background: 'rgba(10, 2, 24, 0.85)',
        border: '2.5px solid #b82bf5',
        borderRadius: '16px',
        padding: '8px',
        boxShadow: '0 0 20px rgba(184, 43, 245, 0.4)'
      }}>
        {Array.from({ length: MAZE_SIZE * MAZE_SIZE }).map((_, idx) => {
          const r = Math.floor(idx / MAZE_SIZE);
          const c = idx % MAZE_SIZE;

          const isWall = r === 0 || r === MAZE_SIZE - 1 || c === 0 || c === MAZE_SIZE - 1;
          const isCat = catPos.r === r && catPos.c === c;
          const isGem = gems.some(g => g.r === r && g.c === c);
          const isTrap = traps.some(t => t.r === r && t.c === c);

          return (
            <div
              key={idx}
              style={{
                borderRadius: '6px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '18px',
                background: isWall 
                  ? 'rgba(184, 43, 245, 0.35)' 
                  : (isTrap ? 'rgba(255, 42, 133, 0.2)' : 'rgba(255, 255, 255, 0.04)'),
                border: isWall 
                  ? '1px solid #b82bf5' 
                  : (isTrap ? '1px dashed #ff2a85' : '1px solid rgba(255,255,255,0.05)'),
                boxShadow: isWall ? 'inset 0 0 6px #b82bf5' : 'none'
              }}
            >
              {isCat && <span style={{ filter: 'drop-shadow(0 0 6px #ffd700)', animation: 'bounceArrow 1s infinite' }}>🐱</span>}
              {isGem && <span style={{ filter: 'drop-shadow(0 0 6px #00f0ff)' }}>💎</span>}
              {isTrap && !isCat && <span style={{ fontSize: '12px' }}>⚡</span>}
            </div>
          );
        })}
      </div>

      {/* D-Pad Controls for Mobile Phone */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '6px',
        marginTop: '18px'
      }}>
        <button
          className="btn-neon-purple"
          style={{ width: '54px', height: '54px', borderRadius: '14px', padding: 0 }}
          onClick={() => moveCat(-1, 0)}
        >
          <ArrowUp size={24} />
        </button>

        <div style={{ display: 'flex', gap: '20px' }}>
          <button
            className="btn-neon-purple"
            style={{ width: '54px', height: '54px', borderRadius: '14px', padding: 0 }}
            onClick={() => moveCat(0, -1)}
          >
            <ArrowLeft size={24} />
          </button>
          <button
            className="btn-neon-purple"
            style={{ width: '54px', height: '54px', borderRadius: '14px', padding: 0 }}
            onClick={() => moveCat(1, 0)}
          >
            <ArrowDown size={24} />
          </button>
          <button
            className="btn-neon-purple"
            style={{ width: '54px', height: '54px', borderRadius: '14px', padding: 0 }}
            onClick={() => moveCat(0, 1)}
          >
            <ArrowRight size={24} />
          </button>
        </div>
      </div>

      {/* Game Over / Won modal */}
      {(gameOver || gameWon) && (
        <div style={{
          textAlign: 'center',
          background: 'rgba(18, 5, 38, 0.9)',
          border: `2px solid ${gameWon ? '#ffd700' : '#ff2a85'}`,
          borderRadius: '16px',
          padding: '14px',
          marginTop: '16px',
          boxShadow: `0 0 20px ${gameWon ? '#ffd700' : '#ff2a85'}`
        }}>
          <h3 style={{ color: gameWon ? '#ffd700' : '#ff2a85', fontSize: '1.25rem', fontWeight: 800 }}>
            {gameWon ? 'Tüm Mücevherler Toplandı! 👑' : 'Tuzağa Bastın! 💥'}
          </h3>
          <button
            className="btn-neon-cyan"
            style={{ marginTop: '10px', padding: '8px 20px' }}
            onClick={resetGame}
          >
            Yeniden Başla
          </button>
        </div>
      )}
    </div>
  );
}
