import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { sounds } from '../../utils/audio';

const INITIAL_BLOCKS = [
  { id: 1, color: '#ff2a85', points: 10 },
  { id: 2, color: '#00f0ff', points: 10 },
  { id: 3, color: '#39ff14', points: 15 },
  { id: 4, color: '#ffd700', points: 15 },
  { id: 5, color: '#b026ff', points: 20 },
  { id: 6, color: '#ff2a85', points: 20 },
  { id: 7, color: '#00f0ff', points: 25 },
  { id: 8, color: '#39ff14', points: 25 },
  { id: 9, color: '#ffd700', points: 30 }
];

export default function StackSixGame({ onBack }) {
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isWon, setIsWon] = useState(false);

  const resetGame = () => {
    sounds.playClick();
    setBlocks(INITIAL_BLOCKS);
    setScore(0);
    setIsGameOver(false);
    setIsWon(false);
  };

  const handleBlockTap = (id, points) => {
    if (isGameOver || isWon) return;

    sounds.playMove(true);
    const next = blocks.filter(b => b.id !== id);
    setBlocks(next);
    setScore(s => s + points);

    if (next.length === 0) {
      setIsWon(true);
      sounds.playWin();
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          colors: ['#00f0ff', '#39ff14', '#ffd700', '#ff2a85']
        });
      } catch {}
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', paddingTop: '4px' }}>
        <button
          onClick={() => { sounds.playNav(); onBack(); }}
          className="btn-neon-purple"
          style={{ padding: '10px 16px', borderRadius: '14px', fontWeight: 800 }}
        >
          <ArrowLeft size={20} />
          <span>Geri</span>
        </button>

        <h2 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: '1.4rem',
          color: '#00f0ff',
          textShadow: '0 0 10px #00f0ff'
        }}>
          Stack Six
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
        border: '1.5px solid #00f0ff',
        borderRadius: '14px',
        padding: '10px 14px',
        marginBottom: '20px',
        color: '#cbd5e1',
        fontSize: '0.85rem'
      }}>
        Altındaki bloklara dokunarak yok et, altıgeni platforma indir!
        <div style={{ color: '#ffd700', fontWeight: 800, fontSize: '1.1rem', marginTop: '4px' }}>
          Skor: {score}
        </div>
      </div>

      {/* Hexagon on top */}
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <svg viewBox="0 0 100 100" width="80" height="80" style={{ filter: 'drop-shadow(0 0 12px #00f0ff)', animation: 'pulseBadge 1.5s infinite' }}>
          <polygon points="50,10 88,32 88,76 50,98 12,76 12,32" fill="#00f0ff" stroke="#ffffff" strokeWidth="3" />
          <polygon points="50,22 78,38 78,70 50,86 22,70 22,38" fill="#ffffff" fillOpacity="0.4" />
        </svg>
      </div>

      {/* Blocks stack */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '8px',
        width: '100%',
        maxWidth: '300px',
        margin: '0 auto',
        padding: '12px',
        background: 'rgba(10, 2, 24, 0.75)',
        border: '2px solid #b82bf5',
        borderRadius: '16px',
        boxShadow: '0 0 16px rgba(184, 43, 245, 0.3)'
      }}>
        {blocks.map(b => (
          <button
            key={b.id}
            onClick={() => handleBlockTap(b.id, b.points)}
            style={{
              height: '48px',
              borderRadius: '10px',
              border: `2px solid ${b.color}`,
              background: `${b.color}22`,
              boxShadow: `0 0 10px ${b.color}`,
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'transform 0.15s ease'
            }}
          >
            +{b.points}
          </button>
        ))}
      </div>

      {/* Bottom Platform */}
      <div style={{
        width: '85%',
        maxWidth: '340px',
        height: '14px',
        background: '#ffaa00',
        borderRadius: '8px',
        boxShadow: '0 0 14px #ffaa00',
        margin: '16px auto 0 auto'
      }} />

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
          <h3 style={{ color: '#00f0ff', fontSize: '1.3rem', fontWeight: 800 }}>Tebrikler! Bloklar Temizlendi 🔷</h3>
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
