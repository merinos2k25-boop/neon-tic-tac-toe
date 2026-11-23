import React, { useState } from 'react';
import { sounds } from '../utils/audio';

export default function HomeMenu({ onSelectGame }) {
  const [showLegalModal, setShowLegalModal] = useState(null); // 'privacy' | 'terms' | null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '16px' }}>
      {/* 1. Tic Tac Toe Card (Play) */}
      <div 
        className="game-card" 
        onClick={() => {
          sounds.playNav();
          onSelectGame('tictactoe');
        }}
      >
        <div className="game-card-left">
          {/* Tic Tac Toe SVG Art */}
          <svg viewBox="0 0 100 100" width="76" height="76">
            {/* Grid Lines */}
            <line x1="36" y1="12" x2="36" y2="88" stroke="#8a2be2" strokeWidth="4" strokeLinecap="round" />
            <line x1="64" y1="12" x2="64" y2="88" stroke="#8a2be2" strokeWidth="4" strokeLinecap="round" />
            <line x1="12" y1="36" x2="88" y2="36" stroke="#8a2be2" strokeWidth="4" strokeLinecap="round" />
            <line x1="12" y1="64" x2="88" y2="64" stroke="#8a2be2" strokeWidth="4" strokeLinecap="round" />
            
            {/* Top Row: O, X */}
            <circle cx="24" cy="24" r="10" stroke="#ff2a85" strokeWidth="4.5" fill="none" style={{ filter: 'drop-shadow(0 0 4px #ff2a85)' }} />
            <path d="M54 16 L74 32 M74 16 L54 32" stroke="#00f0ff" strokeWidth="4.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #00f0ff)' }} />
            
            {/* Middle Row: X, O */}
            <circle cx="50" cy="50" r="10" stroke="#ff2a85" strokeWidth="4.5" fill="none" style={{ filter: 'drop-shadow(0 0 4px #ff2a85)' }} />
            <path d="M72 42 L88 58 M88 42 L72 58" stroke="#00f0ff" strokeWidth="4.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #00f0ff)' }} />
            
            {/* Bottom Row: X, O */}
            <path d="M16 72 L32 88 M32 72 L16 88" stroke="#00f0ff" strokeWidth="4.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #00f0ff)' }} />
            <circle cx="76" cy="76" r="10" stroke="#ff2a85" strokeWidth="4.5" fill="none" style={{ filter: 'drop-shadow(0 0 4px #ff2a85)' }} />
            
            {/* Winning diagonal strike line */}
            <line x1="14" y1="14" x2="86" y2="86" stroke="#ff007f" strokeWidth="5.5" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 6px #ff007f) drop-shadow(0 0 12px #ff2a85)' }} />
          </svg>
        </div>
        <div className="game-card-divider" />
        <div className="game-card-right">
          Play
        </div>
      </div>

      {/* 2. Stack Six Card */}
      <div 
        className="game-card"
        onClick={() => {
          sounds.playNav();
          onSelectGame('tictactoe');
        }}
      >
        <div className="game-card-left">
          <svg viewBox="0 0 100 100" width="76" height="76">
            {/* Neon Blocks around */}
            <polygon points="50,15 76,30 76,60 50,75 24,60 24,30" fill="#00f0ff" fillOpacity="0.4" stroke="#00f0ff" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 6px #00f0ff)' }} />
            <polygon points="50,22 70,33 70,57 50,68 30,57 30,33" fill="#ffffff" fillOpacity="0.75" />
            {/* Surrounding colorful neon tetris blocks */}
            <path d="M68 35 L86 35 L86 78 L68 78 L68 62 L55 62" fill="none" stroke="#39ff14" strokeWidth="3.5" style={{ filter: 'drop-shadow(0 0 4px #39ff14)' }} />
            <rect x="12" y="32" width="16" height="16" fill="none" stroke="#b026ff" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 4px #b026ff)' }} />
            <rect x="18" y="52" width="22" height="22" fill="none" stroke="#ff2a85" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 4px #ff2a85)' }} />
          </svg>
        </div>
        <div className="game-card-divider" />
        <div className="game-card-right">
          Stack Six
        </div>
      </div>

      {/* 3. Tomb Run Card */}
      <div 
        className="game-card"
        onClick={() => {
          sounds.playNav();
          onSelectGame('tictactoe');
        }}
      >
        <div className="game-card-left">
          <svg viewBox="0 0 100 100" width="76" height="76">
            {/* Maze block border */}
            <g stroke="#ff2a85" strokeWidth="2.5" fill="none" style={{ filter: 'drop-shadow(0 0 3px #ff2a85)' }}>
              <rect x="14" y="14" width="14" height="14" rx="2" />
              <rect x="32" y="14" width="14" height="14" rx="2" />
              <rect x="50" y="14" width="14" height="14" rx="2" />
              <rect x="68" y="14" width="14" height="14" rx="2" />
              
              <rect x="14" y="32" width="14" height="14" rx="2" />
              <rect x="68" y="32" width="14" height="14" rx="2" />
              
              <rect x="14" y="50" width="14" height="14" rx="2" />
              <rect x="68" y="50" width="14" height="14" rx="2" />
              
              <rect x="14" y="68" width="14" height="14" rx="2" />
              <rect x="32" y="68" width="14" height="14" rx="2" />
              <rect x="50" y="68" width="14" height="14" rx="2" />
              <rect x="68" y="68" width="14" height="14" rx="2" />
            </g>
            {/* Cute Yellow Neon Cat */}
            <g stroke="#ffd700" strokeWidth="2.5" fill="none" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 5px #ffd700)' }}>
              {/* Ears */}
              <polygon points="36,44 40,36 44,44" fill="#ffd700" fillOpacity="0.3" />
              <polygon points="46,44 50,36 54,44" fill="#ffd700" fillOpacity="0.3" />
              {/* Head */}
              <circle cx="45" cy="46" r="8" />
              {/* Body */}
              <ellipse cx="54" cy="52" rx="10" ry="7" />
              {/* Legs */}
              <line x1="48" y1="58" x2="48" y2="64" />
              <line x1="58" y1="58" x2="58" y2="64" />
              {/* Tail */}
              <path d="M64 52 Q72 48 70 42" />
            </g>
          </svg>
        </div>
        <div className="game-card-divider" />
        <div className="game-card-right">
          Tomb Run
        </div>
      </div>

      {/* 4. Balance Drop Card */}
      <div 
        className="game-card"
        onClick={() => {
          sounds.playNav();
          onSelectGame('tictactoe');
        }}
      >
        <div className="game-card-left">
          <svg viewBox="0 0 100 100" width="76" height="76">
            {/* Balance platform */}
            <rect x="16" y="74" width="68" height="8" rx="4" fill="#ffaa00" style={{ filter: 'drop-shadow(0 0 6px #ffaa00)' }} />
            {/* Pivot */}
            <polygon points="50,74 44,84 56,84" fill="#888" />
            
            {/* Left character: cute girl figure */}
            <circle cx="34" cy="48" r="6" fill="#ffe0bd" stroke="#ffea79" strokeWidth="1.5" />
            <polygon points="28,54 40,54 43,68 25,68" fill="#3a86ff" />
            <circle cx="30" cy="44" r="3" fill="#ffd700" />
            
            {/* Middle character */}
            <circle cx="46" cy="46" r="6" fill="#ffe0bd" stroke="#ff2a85" strokeWidth="1.5" />
            <polygon points="40,52 52,52 56,68 36,68" fill="#ff006e" />
            <circle cx="44" cy="41" r="3.5" fill="#ff006e" />
            
            {/* Dropping character with arrow */}
            <g transform="translate(62, 34)">
              <circle cx="8" cy="8" r="6" fill="#ffe0bd" stroke="#b026ff" strokeWidth="1.5" />
              <polygon points="3,14 13,14 15,26 1,26" fill="#8338ec" />
              <line x1="8" y1="28" x2="8" y2="36" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
              <polygon points="8,38 5,34 11,34" fill="#ffffff" />
            </g>
          </svg>
        </div>
        <div className="game-card-divider" />
        <div className="game-card-right">
          Balance Drop
        </div>
      </div>

      {/* 5. Arrow Puzzle Card (NEW!) */}
      <div 
        className="game-card"
        onClick={() => {
          sounds.playNav();
          onSelectGame('tictactoe');
        }}
      >
        <div className="badge-new">NEW!</div>
        <div className="game-card-left">
          <svg viewBox="0 0 100 100" width="76" height="76">
            {/* Heart of neon interlocking arrows */}
            {/* Cyan Arrow */}
            <path d="M22 36 L48 36 L48 48" fill="none" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #00f0ff)' }} />
            <polygon points="48,52 44,46 52,46" fill="#00f0ff" />
            
            {/* Pink Arrow */}
            <path d="M78 36 L52 36 L52 24" fill="none" stroke="#ff2a85" strokeWidth="3" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #ff2a85)' }} />
            <polygon points="52,20 48,26 56,26" fill="#ff2a85" />
            
            {/* Yellow Arrow */}
            <path d="M30 50 L64 50 L64 62" fill="none" stroke="#ffd700" strokeWidth="3" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #ffd700)' }} />
            <polygon points="64,66 60,60 68,60" fill="#ffd700" />
            
            {/* Purple Arrow */}
            <path d="M70 64 L36 64 L36 76" fill="none" stroke="#b026ff" strokeWidth="3" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #b026ff)' }} />
            <polygon points="36,80 32,74 40,74" fill="#b026ff" />
            
            {/* Green Arrow */}
            <path d="M44 76 L50 82" fill="none" stroke="#39ff14" strokeWidth="3" strokeLinecap="round" style={{ filter: 'drop-shadow(0 0 4px #39ff14)' }} />
            <polygon points="52,84 46,80 50,76" fill="#39ff14" />
          </svg>
        </div>
        <div className="game-card-divider" />
        <div className="game-card-right">
          Arrow Puzzle
        </div>
      </div>

      {/* 6. Water sort Card */}
      <div 
        className="game-card"
        onClick={() => {
          sounds.playNav();
          onSelectGame('tictactoe');
        }}
      >
        <div className="game-card-left">
          <svg viewBox="0 0 100 100" width="76" height="76">
            {/* Pouring flask (angled) */}
            <g transform="translate(18, 20) rotate(-35)">
              <rect x="0" y="0" width="46" height="18" rx="8" fill="none" stroke="#b026ff" strokeWidth="3" style={{ filter: 'drop-shadow(0 0 4px #b026ff)' }} />
              <rect x="2" y="2" width="28" height="14" rx="6" fill="#ff007f" />
              <rect x="18" y="2" width="24" height="14" rx="6" fill="#ffd700" />
            </g>
            {/* Stream */}
            <path d="M48 42 Q52 55 54 68" stroke="#ffea79" strokeWidth="3" strokeLinecap="round" fill="none" style={{ filter: 'drop-shadow(0 0 4px #ffea79)' }} />
            {/* Test tubes */}
            <rect x="52" y="60" width="14" height="26" rx="4" fill="none" stroke="#00f0ff" strokeWidth="2.5" />
            <rect x="54" y="74" width="10" height="10" rx="2" fill="#ff007f" />
            
            <rect x="70" y="60" width="14" height="26" rx="4" fill="none" stroke="#ff2a85" strokeWidth="2.5" />
            <rect x="72" y="68" width="10" height="16" rx="2" fill="#00f0ff" />
          </svg>
        </div>
        <div className="game-card-divider" />
        <div className="game-card-right">
          Water sort
        </div>
      </div>

      {/* Bottom Scroll Indicator & Legal Links matching screenshot */}
      <div style={{ textAlign: 'center', marginTop: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
        {/* Yellow Down Triangle */}
        <div style={{
          width: 0,
          height: 0,
          borderLeft: '12px solid transparent',
          borderRight: '12px solid transparent',
          borderTop: '16px solid #ffd700',
          filter: 'drop-shadow(0 0 8px #ffd700)',
          animation: 'bounceArrow 1.5s infinite',
          cursor: 'pointer'
        }} />

        <div style={{ display: 'flex', gap: '18px', marginTop: '4px' }}>
          <button
            onClick={() => setShowLegalModal('privacy')}
            style={{
              background: 'none',
              border: 'none',
              color: '#00f0ff',
              textShadow: '0 0 8px rgba(0, 240, 255, 0.7)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setShowLegalModal('terms')}
            style={{
              background: 'none',
              border: 'none',
              color: '#00f0ff',
              textShadow: '0 0 8px rgba(0, 240, 255, 0.7)',
              fontSize: '0.85rem',
              fontWeight: 600,
              textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            User Agreement
          </button>
        </div>
      </div>

      {/* Privacy / Terms Modal */}
      {showLegalModal && (
        <div className="modal-overlay" onClick={() => setShowLegalModal(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#00f0ff', fontFamily: "'Fredoka', sans-serif", fontSize: '1.3rem', marginBottom: '12px', textAlign: 'center' }}>
              {showLegalModal === 'privacy' ? 'Gizlilik Politikası (Privacy Policy)' : 'Kullanıcı Sözleşmesi (User Agreement)'}
            </h3>
            <div style={{ color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.5, maxHeight: '200px', overflowY: 'auto', marginBottom: '16px' }}>
              <p style={{ marginBottom: '8px' }}>
                Bu uygulama kullanıcı gizliliğine %100 saygılıdır. Kişisel veri toplanmaz, satılmaz veya harici sunucularda saklanmaz.
              </p>
              <p style={{ marginBottom: '8px' }}>
                Oyun skorları ve profil ayarları sadece cihazınızın yerel depolama alanında (localStorage) güvenle saklanır.
              </p>
              <p>
                Arkadaşlarınızla P2P (Peer-to-Peer) oda bağlantısıyla doğrudan şifreli WebRTC üzerinden eşleşerek oynayabilirsiniz.
              </p>
            </div>
            <button
              className="btn-neon-cyan"
              style={{ width: '100%' }}
              onClick={() => setShowLegalModal(null)}
            >
              Anladım
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounceArrow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(6px); }
        }
      `}</style>
    </div>
  );
}
