import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { sounds } from '../../utils/audio';

const INITIAL_ARROWS = [
  { id: 1, dir: 'up', color: '#00f0ff', cleared: false },
  { id: 2, dir: 'right', color: '#ff2a85', cleared: false },
  { id: 3, dir: 'down', color: '#ffd700', cleared: false },
  { id: 4, dir: 'left', color: '#b026ff', cleared: false },
  { id: 5, dir: 'right', color: '#39ff14', cleared: false },
  { id: 6, dir: 'up', color: '#00f0ff', cleared: false },
  { id: 7, dir: 'left', color: '#ff2a85', cleared: false },
  { id: 8, dir: 'down', color: '#ffd700', cleared: false },
  { id: 9, dir: 'up', color: '#39ff14', cleared: false }
];

export default function ArrowPuzzleGame({ onBack }) {
  const [arrows, setArrows] = useState(INITIAL_ARROWS);
  const [score, setScore] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const resetGame = () => {
    sounds.playClick();
    setArrows(INITIAL_ARROWS.map(a => ({ ...a, cleared: false })));
    setScore(0);
    setIsWon(false);
  };

  const handleArrowTap = (id) => {
    if (isWon) return;

    sounds.playMove(true);
    const next = arrows.map(a => a.id === id ? { ...a, cleared: true } : a);
    setArrows(next);
    setScore(s => s + 50);

    if (next.every(a => a.cleared)) {
      setIsWon(true);
      sounds.playWin();
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          colors: ['#00f0ff', '#ff2a85', '#ffd700', '#b026ff', '#39ff14']
        });
      } catch {}
    }
  };

  const getRotation = (dir) => {
    switch (dir) {
      case 'up': return '0deg';
      case 'right': return '90deg';
      case 'down': return '180deg';
      case 'left': return '270deg';
      default: return '0deg';
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '20px' }}>
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
          color: '#ff2a85',
          textShadow: '0 0 10px #ff2a85'
        }}>
          Arrow Puzzle
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
        padding: '10px 14px',
        marginBottom: '20px',
        color: '#cbd5e1',
        fontSize: '0.85rem'
      }}>
        Bütün neon okları sırayla fırlatarak tahtayı temizle!
        <div style={{ color: '#00f0ff', fontWeight: 800, marginTop: '4px' }}>Puan: {score}</div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        width: '100%',
        maxWidth: '320px',
        margin: '0 auto',
        padding: '16px',
        background: 'rgba(10, 2, 24, 0.85)',
        border: '2.5px solid #b82bf5',
        borderRadius: '20px',
        boxShadow: '0 0 20px rgba(184, 43, 245, 0.4)'
      }}>
        {arrows.map(a => (
          <button
            key={a.id}
            onClick={() => handleArrowTap(a.id)}
            disabled={a.cleared}
            style={{
              aspectRatio: '1/1',
              borderRadius: '14px',
              border: a.cleared ? '1px dashed #333' : `2px solid ${a.color}`,
              background: a.cleared ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
              boxShadow: a.cleared ? 'none' : `0 0 12px ${a.color}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: a.cleared ? 'default' : 'pointer',
              transition: 'all 0.2s ease',
              opacity: a.cleared ? 0.15 : 1
            }}
          >
            {!a.cleared && (
              <svg 
                viewBox="0 0 24 24" 
                width="34" 
                height="34" 
                style={{ 
                  transform: `rotate(${getRotation(a.dir)})`,
                  filter: `drop-shadow(0 0 6px ${a.color})` 
                }}
              >
                <path d="M12 4 L4 12 L9 12 L9 20 L15 20 L15 12 L20 12 Z" fill={a.color} />
              </svg>
            )}
          </button>
        ))}
      </div>

      {isWon && (
        <div style={{
          textAlign: 'center',
          background: 'rgba(0, 240, 255, 0.15)',
          border: '2px solid #00f0ff',
          borderRadius: '16px',
          padding: '16px',
          marginTop: '20px',
          boxShadow: '0 0 20px rgba(0, 240, 255, 0.6)'
        }}>
          <h3 style={{ color: '#00f0ff', fontSize: '1.3rem', fontWeight: 800 }}>Mükemmel! Tahta Temizlendi 💘</h3>
          <button
            className="btn-neon-pink"
            style={{ marginTop: '10px', padding: '10px 20px' }}
            onClick={resetGame}
          >
            Yeniden Oyna
          </button>
        </div>
      )}
    </div>
  );
}
