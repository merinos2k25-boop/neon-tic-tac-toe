import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';
import { sounds } from '../../utils/audio';

const COLORS = {
  cyan: '#00f0ff',
  pink: '#ff2a85',
  yellow: '#ffd700',
  purple: '#b026ff'
};

const INITIAL_LEVELS = [
  // Level 1: 3 tubes with 2 colors + 1 empty
  [
    ['cyan', 'pink', 'cyan', 'pink'],
    ['pink', 'cyan', 'pink', 'cyan'],
    [],
    []
  ],
  // Level 2: 3 colors
  [
    ['yellow', 'cyan', 'pink', 'yellow'],
    ['pink', 'yellow', 'cyan', 'purple'],
    ['purple', 'pink', 'cyan', 'purple'],
    ['yellow', 'purple', 'cyan', 'pink'],
    [],
    []
  ]
];

export default function WaterSortGame({ onBack }) {
  const [levelIdx, setLevelIdx] = useState(0);
  const [tubes, setTubes] = useState(INITIAL_LEVELS[0]);
  const [selectedTube, setSelectedTube] = useState(null);
  const [isWon, setIsWon] = useState(false);
  const [moves, setMoves] = useState(0);

  const resetLevel = () => {
    sounds.playClick();
    setTubes(JSON.parse(JSON.stringify(INITIAL_LEVELS[levelIdx])));
    setSelectedTube(null);
    setIsWon(false);
    setMoves(0);
  };

  const checkWinCondition = (currentTubes) => {
    return currentTubes.every(tube => {
      if (tube.length === 0) return true;
      if (tube.length !== 4) return false;
      const firstColor = tube[0];
      return tube.every(c => c === firstColor);
    });
  };

  const handleTubeClick = (index) => {
    if (isWon) return;

    if (selectedTube === null) {
      if (tubes[index].length === 0) return;
      sounds.playClick();
      setSelectedTube(index);
    } else if (selectedTube === index) {
      sounds.playClick();
      setSelectedTube(null);
    } else {
      // Attempt to pour from selectedTube to index
      const sourceTube = tubes[selectedTube];
      const targetTube = tubes[index];

      if (sourceTube.length === 0) {
        setSelectedTube(null);
        return;
      }

      if (targetTube.length >= 4) {
        sounds.playDraw();
        setSelectedTube(null);
        return;
      }

      const topSourceColor = sourceTube[sourceTube.length - 1];

      if (targetTube.length === 0 || targetTube[targetTube.length - 1] === topSourceColor) {
        // Valid pour
        sounds.playMove(true);
        const newTubes = tubes.map(t => [...t]);
        
        // Pour all continuous matching layers that fit
        while (
          newTubes[selectedTube].length > 0 &&
          newTubes[index].length < 4 &&
          newTubes[selectedTube][newTubes[selectedTube].length - 1] === topSourceColor
        ) {
          const poured = newTubes[selectedTube].pop();
          newTubes[index].push(poured);
        }

        setTubes(newTubes);
        setSelectedTube(null);
        setMoves(m => m + 1);

        if (checkWinCondition(newTubes)) {
          setIsWon(true);
          sounds.playWin();
          try {
            confetti({
              particleCount: 60,
              spread: 60,
              origin: { y: 0.6 },
              colors: ['#00f0ff', '#ff2a85', '#ffd700', '#b026ff']
            });
          } catch {}
        }
      } else {
        sounds.playDraw();
        setSelectedTube(null);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '20px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
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
          Water Sort
        </h2>

        <button
          onClick={resetLevel}
          className="btn-neon-cyan"
          style={{ padding: '8px 12px', borderRadius: '12px' }}
          title="Yeniden Başlat"
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
        Tüpleri seçerek aynı renkteki sıvıları tek bir tüpte topla!
        <div style={{ color: '#00f0ff', fontWeight: 700, marginTop: '4px' }}>Hamle: {moves}</div>
      </div>

      {/* Tubes Grid */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '24px',
        padding: '20px 10px',
        alignItems: 'flex-end',
        minHeight: '280px'
      }}>
        {tubes.map((tube, idx) => {
          const isSelected = selectedTube === idx;

          return (
            <div
              key={idx}
              onClick={() => handleTubeClick(idx)}
              style={{
                width: '54px',
                height: '170px',
                border: isSelected ? '2.5px solid #00f0ff' : '2px solid rgba(184, 43, 245, 0.6)',
                borderRadius: '0 0 24px 24px',
                borderTop: 'none',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column-reverse',
                padding: '4px',
                background: 'rgba(10, 2, 24, 0.6)',
                boxShadow: isSelected 
                  ? '0 0 20px #00f0ff, inset 0 0 12px rgba(0, 240, 255, 0.4)' 
                  : '0 0 12px rgba(184, 43, 245, 0.3)',
                transform: isSelected ? 'translateY(-20px)' : 'none',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'pointer'
              }}
            >
              {tube.map((colorKey, cIdx) => (
                <div
                  key={cIdx}
                  style={{
                    width: '100%',
                    height: '36px',
                    backgroundColor: COLORS[colorKey] || '#fff',
                    borderRadius: cIdx === 0 ? '0 0 20px 20px' : '4px',
                    boxShadow: `0 0 10px ${COLORS[colorKey] || '#fff'}`,
                    marginBottom: '2px',
                    transition: 'all 0.2s ease'
                  }}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Victory Modal */}
      {isWon && (
        <div style={{
          textAlign: 'center',
          background: 'rgba(255, 42, 133, 0.15)',
          border: '2px solid #ff2a85',
          borderRadius: '16px',
          padding: '16px',
          marginTop: '20px',
          boxShadow: '0 0 20px rgba(255, 42, 133, 0.6)'
        }}>
          <h3 style={{ color: '#ffea79', fontSize: '1.4rem', fontWeight: 800 }}>Tebrikler! Kazandın! 🏆</h3>
          <p style={{ color: '#cbd5e1', fontSize: '0.9rem', margin: '8px 0' }}>Bütün sıvıları başarıyla ayrıştırdın.</p>
          <button
            className="btn-neon-cyan"
            style={{ marginTop: '8px', padding: '10px 20px' }}
            onClick={resetLevel}
          >
            Tekrar Oyna
          </button>
        </div>
      )}
    </div>
  );
}
