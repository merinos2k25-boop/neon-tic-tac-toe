import React from 'react';
import { Smartphone, Users, Globe, Flame, Award, Swords } from 'lucide-react';
import { sounds } from '../utils/audio';

export default function TwoPlayerHub({ onLaunchGame }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', paddingBottom: '20px' }}>
      <div style={{
        textAlign: 'center',
        padding: '12px 14px',
        background: 'rgba(255, 42, 133, 0.12)',
        border: '1.8px solid #ff2a85',
        borderRadius: '16px',
        boxShadow: '0 0 16px rgba(255, 42, 133, 0.35)',
        marginBottom: '6px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
          <Swords size={22} color="#ff2a85" style={{ filter: 'drop-shadow(0 0 6px #ff2a85)' }} />
          <h3 style={{
            fontFamily: "'Fredoka', sans-serif",
            fontSize: '1.35rem',
            color: '#ff2a85',
            textShadow: '0 0 10px #ff2a85'
          }}>
            2 Kişilik Kapışma Alanı
          </h3>
        </div>
        <p style={{ color: '#cbd5e1', fontSize: '0.85rem', marginTop: '4px' }}>
          İster tek telefonda arkadaşınla otur, ister uzaktaki arkadaşına link yolla!
        </p>
      </div>

      {/* Mode 1: Tabletop Duel (Face-to-Face) */}
      <div 
        className="game-card"
        onClick={() => {
          sounds.playNav();
          onLaunchGame('tabletop');
        }}
      >
        <div className="game-card-left" style={{ flexDirection: 'column', gap: '4px' }}>
          <Users size={36} color="#ffd700" style={{ filter: 'drop-shadow(0 0 8px #ffd700)' }} />
          <span style={{ fontSize: '0.72rem', color: '#ffea79', fontWeight: 700 }}>MASADA DÜELLO</span>
        </div>
        <div className="game-card-divider" />
        <div className="game-card-right" style={{ flexDirection: 'column', padding: '10px' }}>
          <span style={{ fontSize: '1.15rem' }}>Yüzyüze Modu</span>
          <span style={{ fontSize: '0.72rem', color: '#9d80c0', fontWeight: 500 }}>Ters Ekran • Masada Karşılıklı</span>
        </div>
      </div>

      {/* Mode 2: Pass & Play (Local Phone) */}
      <div 
        className="game-card"
        onClick={() => {
          sounds.playNav();
          onLaunchGame('local');
        }}
      >
        <div className="game-card-left" style={{ flexDirection: 'column', gap: '4px' }}>
          <Smartphone size={36} color="#00f0ff" style={{ filter: 'drop-shadow(0 0 8px #00f0ff)' }} />
          <span style={{ fontSize: '0.72rem', color: '#00f0ff', fontWeight: 700 }}>TEK TELEFON</span>
        </div>
        <div className="game-card-divider" />
        <div className="game-card-right" style={{ flexDirection: 'column', padding: '10px' }}>
          <span style={{ fontSize: '1.15rem' }}>Yan Yana Oyna</span>
          <span style={{ fontSize: '0.72rem', color: '#9d80c0', fontWeight: 500 }}>Sırayla Dokun • Klasik 2 Kişilik</span>
        </div>
      </div>

      {/* Mode 3: Online Peer-to-Peer Room */}
      <div 
        className="game-card"
        onClick={() => {
          sounds.playNav();
          onLaunchGame('online');
        }}
      >
        <div className="game-card-left" style={{ flexDirection: 'column', gap: '4px' }}>
          <Globe size={36} color="#ff2a85" style={{ filter: 'drop-shadow(0 0 8px #ff2a85)' }} />
          <span style={{ fontSize: '0.72rem', color: '#ff2a85', fontWeight: 700 }}>İNTERNETTEN</span>
        </div>
        <div className="game-card-divider" />
        <div className="game-card-right" style={{ flexDirection: 'column', padding: '10px' }}>
          <span style={{ fontSize: '1.15rem' }}>Online Oda Kodu</span>
          <span style={{ fontSize: '0.72rem', color: '#9d80c0', fontWeight: 500 }}>Kod Paylaş • Canlı Bağlan</span>
        </div>
      </div>

      {/* Quick Play against Bot bonus card */}
      <div 
        className="game-card"
        onClick={() => {
          sounds.playNav();
          onLaunchGame('bot');
        }}
        style={{ borderColor: '#ffd700', boxShadow: '0 0 14px rgba(255, 215, 0, 0.4)' }}
      >
        <div className="game-card-left" style={{ flexDirection: 'column', gap: '4px' }}>
          <Flame size={36} color="#ffd700" style={{ filter: 'drop-shadow(0 0 8px #ffd700)' }} />
          <span style={{ fontSize: '0.72rem', color: '#ffd700', fontWeight: 700 }}>YAPAY ZEKA</span>
        </div>
        <div className="game-card-divider" style={{ background: '#ffd700', boxShadow: '0 0 8px #ffd700' }} />
        <div className="game-card-right" style={{ flexDirection: 'column', padding: '10px' }}>
          <span style={{ fontSize: '1.15rem', color: '#ffd700' }}>Bot ile Antrenman</span>
          <span style={{ fontSize: '0.72rem', color: '#9d80c0', fontWeight: 500 }}>Kolay / Normal / İmkansız</span>
        </div>
      </div>
    </div>
  );
}
