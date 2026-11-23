import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { sounds } from '../../utils/audio';

export default function BalanceDropGame({ onBack }) {
  const [tilt, setTilt] = useState(0); // -45 to 45 degrees
  const [score, setScore] = useState(0);
  const [drops, setDrops] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);

  const resetGame = () => {
    sounds.playClick();
    setTilt(0);
    setScore(0);
    setDrops([]);
    setIsGameOver(false);
  };

  const handleDrop = (side) => {
    if (isGameOver) return;

    sounds.playMove(side === 'left');
    const delta = side === 'left' ? -8 : 8;
    const newTilt = tilt + delta;

    setDrops(prev => [...prev.slice(-4), { id: Date.now(), side }]);
    setTilt(newTilt);
    setScore(s => s + 10);

    if (Math.abs(newTilt) >= 32) {
      sounds.playDraw();
      setIsGameOver(true);
    } else if (score + 10 >= 100) {
      sounds.playWin();
      try {
        confetti({ particleCount: 60, spread: 60 });
      } catch {}
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
          color: '#ffea79',
          textShadow: '0 0 10px #ffd700'
        }}>
          Balance Drop
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
        border: '1.5px solid #ffea79',
        borderRadius: '14px',
        padding: '10px 14px',
        marginBottom: '28px',
        color: '#cbd5e1',
        fontSize: '0.85rem'
      }}>
        Sol ve Sağ butonlarıyla ağırlığı dengele, platformun devrilmesini engelle!
        <div style={{ color: '#00f0ff', fontWeight: 800, fontSize: '1.1rem', marginTop: '4px' }}>
          Skor: {score} | Eğim: {tilt}°
        </div>
      </div>

      {/* Physics Seesaw Beam */}
      <div style={{ minHeight: '160px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          width: '80%',
          maxWidth: '320px',
          height: '14px',
          background: '#ffaa00',
          borderRadius: '7px',
          boxShadow: '0 0 16px #ffaa00',
          transform: `rotate(${tilt}deg)`,
          transition: 'transform 0.25s ease-out',
          position: 'relative'
        }}>
          {/* Character on left */}
          <div style={{ position: 'absolute', left: '15px', bottom: '16px', fontSize: '24px' }}>
            👧
          </div>
          {/* Character on right */}
          <div style={{ position: 'absolute', right: '15px', bottom: '16px', fontSize: '24px' }}>
            🐱
          </div>
        </div>

        {/* Pivot */}
        <div style={{
          width: 0,
          height: 0,
          borderLeft: '20px solid transparent',
          borderRight: '20px solid transparent',
          borderBottom: '35px solid #b82bf5',
          filter: 'drop-shadow(0 0 10px #b82bf5)',
          marginTop: '-4px'
        }} />
      </div>

      {/* Drop Controls */}
      <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', marginTop: '36px' }}>
        <button
          className="btn-neon-cyan"
          style={{ padding: '16px 28px', fontSize: '1.1rem' }}
          onClick={() => handleDrop('left')}
          disabled={isGameOver}
        >
          Sol Dengele 👈
        </button>

        <button
          className="btn-neon-pink"
          style={{ padding: '16px 28px', fontSize: '1.1rem' }}
          onClick={() => handleDrop('right')}
          disabled={isGameOver}
        >
          Sağ Dengele 👉
        </button>
      </div>

      {isGameOver && (
        <div style={{
          textAlign: 'center',
          background: 'rgba(255, 42, 133, 0.2)',
          border: '2px solid #ff2a85',
          borderRadius: '16px',
          padding: '16px',
          marginTop: '24px',
          boxShadow: '0 0 20px #ff2a85'
        }}>
          <h3 style={{ color: '#ff2a85', fontSize: '1.3rem', fontWeight: 800 }}>Denge Bozuldu! ⚖️</h3>
          <button
            className="btn-neon-cyan"
            style={{ marginTop: '10px', padding: '10px 20px' }}
            onClick={resetGame}
          >
            Yeniden Dene
          </button>
        </div>
      )}
    </div>
  );
}
