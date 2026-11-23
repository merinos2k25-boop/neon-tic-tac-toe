import React, { useState } from 'react';
import { Home, Users, Volume2, VolumeX, Trophy, ShieldCheck, Edit3, MessageSquare } from 'lucide-react';
import { sounds } from '../utils/audio';

export default function Header({
  activeTab,
  setActiveTab,
  profile,
  setProfile,
  stats,
  soundOn,
  setSoundOn,
  bgmOn,
  setBgmOn
}) {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [showVipModal, setShowVipModal] = useState(false);
  const [showChatModal, setShowChatModal] = useState(false);

  const [tempName, setTempName] = useState(profile.name);
  const [tempBio, setTempBio] = useState(profile.bio);
  const [tempGender, setTempGender] = useState(profile.gender);

  const handleSoundToggle = () => {
    const next = sounds.toggleSound();
    setSoundOn(next);
  };

  const handleBgmToggle = () => {
    const next = sounds.toggleBgm();
    setBgmOn(next);
  };

  const saveProfile = () => {
    sounds.playClick();
    setProfile({
      ...profile,
      name: tempName.trim() || 'Oyuncu',
      bio: tempBio.trim() || 'Neon Ustası',
      gender: tempGender
    });
    setShowProfileModal(false);
  };

  return (
    <header style={{ marginBottom: '16px' }}>
      {/* Top Bar: Profile Pill & Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        {/* Profile Pill */}
        <div 
          className="profile-pill" 
          onClick={() => {
            sounds.playClick();
            setTempName(profile.name);
            setTempBio(profile.bio);
            setTempGender(profile.gender);
            setShowProfileModal(true);
          }}
          title="Profili Düzenle"
        >
          <div className="avatar-circle">
            <span style={{ fontSize: '20px' }}>{profile.avatar || '👤'}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ 
                fontFamily: "'Chakra Petch', sans-serif", 
                fontWeight: 700, 
                fontSize: '1.05rem', 
                color: '#00f0ff',
                textShadow: '0 0 8px rgba(0, 240, 255, 0.7)'
              }}>
                {profile.name}
              </span>
              <span style={{ color: '#00f0ff', fontWeight: 700, fontSize: '0.9rem' }}>
                {profile.gender}
              </span>
              <Edit3 size={14} color="#ffd700" style={{ filter: 'drop-shadow(0 0 4px #ffd700)' }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: '#9d80c0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '90px' }}>
              {profile.bio || 'Bio:'}
            </span>
          </div>
        </div>

        {/* Right Action Icons: Chat, Leaderboard, AD Remove */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Chat / Quick Taunts */}
          <button 
            className="circle-action-btn" 
            onClick={() => {
              sounds.playClick();
              setShowChatModal(true);
            }}
            title="Sohbet ve İfadeler"
          >
            <MessageSquare size={20} strokeWidth={2.5} />
          </button>

          {/* Leaderboard Podium */}
          <button 
            className="circle-action-btn" 
            onClick={() => {
              sounds.playClick();
              setShowLeaderboard(true);
            }}
            title="Lider Tablosu & Başarılar"
          >
            <Trophy size={20} strokeWidth={2.5} />
          </button>

          {/* AD Slash Icon */}
          <button 
            className="circle-action-btn" 
            onClick={() => {
              sounds.playClick();
              setShowVipModal(true);
            }}
            title="Reklamsız VIP"
          >
            <span style={{ 
              fontWeight: 800, 
              fontSize: '0.9rem', 
              fontFamily: "'Chakra Petch', sans-serif",
              position: 'relative'
            }}>
              AD
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '-3px',
                right: '-3px',
                height: '2px',
                background: '#ff2a85',
                boxShadow: '0 0 6px #ff2a85',
                transform: 'rotate(-45deg)'
              }} />
            </span>
          </button>
        </div>
      </div>

      {/* Navigation Tab Bar: Home vs 2-Player */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
        <button
          className={`nav-tab-button ${activeTab === 'home' ? 'nav-tab-home-active' : 'nav-tab-inactive'}`}
          onClick={() => {
            sounds.playNav();
            setActiveTab('home');
          }}
        >
          <Home size={22} color={activeTab === 'home' ? '#ffd700' : '#9d80c0'} />
          <span>Home</span>
        </button>

        <button
          className={`nav-tab-button ${activeTab === '2player' ? 'nav-tab-2player-active' : 'nav-tab-inactive'}`}
          onClick={() => {
            sounds.playNav();
            setActiveTab('2player');
          }}
        >
          <Users size={22} color={activeTab === '2player' ? '#00f0ff' : '#9d80c0'} />
          <span>2-Player</span>
        </button>
      </div>

      {/* Profile Edit Modal */}
      {showProfileModal && (
        <div className="modal-overlay" onClick={() => setShowProfileModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ 
              color: '#00f0ff', 
              fontFamily: "'Fredoka', sans-serif", 
              fontSize: '1.4rem', 
              marginBottom: '16px',
              textAlign: 'center',
              textShadow: '0 0 10px #00f0ff'
            }}>
              Profili Düzenle
            </h3>

            {/* Avatar Select */}
            <div style={{ marginBottom: '14px', textAlign: 'center' }}>
              <span style={{ color: '#9d80c0', fontSize: '0.85rem' }}>Avatarını Seç:</span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '8px' }}>
                {['👤', '🤖', '👾', '👑', '⚡', '🐱'].map(emoji => (
                  <button
                    key={emoji}
                    onClick={() => {
                      sounds.playClick();
                      setProfile(p => ({ ...p, avatar: emoji }));
                    }}
                    style={{
                      fontSize: '24px',
                      padding: '6px 10px',
                      background: profile.avatar === emoji ? 'rgba(0, 240, 255, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                      border: profile.avatar === emoji ? '2px solid #00f0ff' : '1px solid #555',
                      borderRadius: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* Nickname Input */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#ffea79', marginBottom: '4px' }}>
                Kullanıcı Adı:
              </label>
              <input
                type="text"
                maxLength={12}
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(9, 2, 22, 0.9)',
                  border: '1.8px solid #b82bf5',
                  color: '#00f0ff',
                  fontSize: '1.1rem',
                  outline: 'none',
                  fontFamily: "'Chakra Petch', sans-serif",
                  fontWeight: 700
                }}
              />
            </div>

            {/* Symbol / Gender */}
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#ffea79', marginBottom: '4px' }}>
                Sembol:
              </label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['♂', '♀', '★', '⚡', '☠'].map(sym => (
                  <button
                    key={sym}
                    onClick={() => {
                      sounds.playClick();
                      setTempGender(sym);
                    }}
                    style={{
                      flex: 1,
                      padding: '8px',
                      borderRadius: '10px',
                      background: tempGender === sym ? 'rgba(255, 42, 133, 0.35)' : 'rgba(255, 255, 255, 0.05)',
                      border: tempGender === sym ? '2px solid #ff2a85' : '1px solid #555',
                      color: '#ffffff',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {sym}
                  </button>
                ))}
              </div>
            </div>

            {/* Bio Input */}
            <div style={{ marginBottom: '18px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#ffea79', marginBottom: '4px' }}>
                Biyografi:
              </label>
              <input
                type="text"
                maxLength={24}
                value={tempBio}
                onChange={e => setTempBio(e.target.value)}
                placeholder="Neon Ustası"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(9, 2, 22, 0.9)',
                  border: '1.8px solid #b82bf5',
                  color: '#ffffff',
                  fontSize: '0.95rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="btn-neon-purple"
                style={{ flex: 1 }}
                onClick={() => setShowProfileModal(false)}
              >
                İptal
              </button>
              <button
                className="btn-neon-cyan"
                style={{ flex: 1 }}
                onClick={saveProfile}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Modal */}
      {showLeaderboard && (
        <div className="modal-overlay" onClick={() => setShowLeaderboard(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <Trophy size={48} color="#ffd700" style={{ filter: 'drop-shadow(0 0 12px #ffd700)', margin: '0 auto' }} />
              <h3 style={{ 
                color: '#ffd700', 
                fontFamily: "'Fredoka', sans-serif", 
                fontSize: '1.5rem',
                marginTop: '8px',
                textShadow: '0 0 10px rgba(255, 215, 0, 0.8)'
              }}>
                İstatistikler & Liderlik
              </h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: 'rgba(0, 240, 255, 0.1)', border: '1.5px solid #00f0ff', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#9d80c0' }}>TOPLAM GALİBİYET</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#00f0ff' }}>{stats.wins}</div>
              </div>
              <div style={{ background: 'rgba(255, 42, 133, 0.1)', border: '1.5px solid #ff2a85', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#9d80c0' }}>MAĞLUBİYET</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ff2a85' }}>{stats.losses}</div>
              </div>
              <div style={{ background: 'rgba(184, 43, 245, 0.1)', border: '1.5px solid #b82bf5', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#9d80c0' }}>BERABERLİK</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffd700' }}>{stats.draws}</div>
              </div>
              <div style={{ background: 'rgba(255, 215, 0, 0.1)', border: '1.5px solid #ffd700', borderRadius: '12px', padding: '10px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#9d80c0' }}>KAZANMA ORANI</div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffea79' }}>
                  {stats.wins + stats.losses > 0 
                    ? Math.round((stats.wins / (stats.wins + stats.losses)) * 100) + '%' 
                    : '100%'}
                </div>
              </div>
            </div>

            <button
              className="btn-neon-cyan"
              style={{ width: '100%' }}
              onClick={() => setShowLeaderboard(false)}
            >
              Kapat
            </button>
          </div>
        </div>
      )}

      {/* VIP Modal */}
      {showVipModal && (
        <div className="modal-overlay" onClick={() => setShowVipModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '16px' }}>
              <ShieldCheck size={52} color="#00f0ff" style={{ filter: 'drop-shadow(0 0 12px #00f0ff)', margin: '0 auto' }} />
              <h3 style={{ color: '#00f0ff', fontFamily: "'Fredoka', sans-serif", fontSize: '1.4rem', marginTop: '8px' }}>
                VIP Reklamsız Sürüm
              </h3>
              <p style={{ color: '#9d80c0', fontSize: '0.9rem', marginTop: '6px' }}>
                Bu sürümde hiçbir reklam yoktur! Arkadaşlarınla ve botla sınırsızca keyifle oyna.
              </p>
            </div>

            <div style={{ 
              background: 'rgba(184, 43, 245, 0.15)', 
              border: '1.5px dashed #b82bf5', 
              borderRadius: '12px', 
              padding: '12px',
              textAlign: 'center',
              marginBottom: '16px'
            }}>
              <span style={{ color: '#ffea79', fontWeight: 700, fontSize: '1rem' }}>
                ✨ %100 Ücretsiz & Reklamsız Deneyim
              </span>
            </div>

            <button
              className="btn-neon-pink"
              style={{ width: '100%' }}
              onClick={() => setShowVipModal(false)}
            >
              Harika!
            </button>
          </div>
        </div>
      )}

      {/* Sound Settings & Chat Modal */}
      {showChatModal && (
        <div className="modal-overlay" onClick={() => setShowChatModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3 style={{ color: '#00f0ff', fontFamily: "'Fredoka', sans-serif", fontSize: '1.4rem', textAlign: 'center', marginBottom: '16px' }}>
              Ses ve Efekt Ayarları
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>Neon Ses Efektleri (SFX)</span>
                <button 
                  className={soundOn ? 'btn-neon-cyan' : 'btn-neon-purple'}
                  style={{ padding: '6px 14px', fontSize: '0.9rem' }}
                  onClick={handleSoundToggle}
                >
                  {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
                  {soundOn ? 'Açık' : 'Kapalı'}
                </button>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '10px 14px', borderRadius: '12px' }}>
                <span style={{ fontSize: '1.05rem', fontWeight: 600 }}>Retro Synthwave Müzik (BGM)</span>
                <button 
                  className={bgmOn ? 'btn-neon-pink' : 'btn-neon-purple'}
                  style={{ padding: '6px 14px', fontSize: '0.9rem' }}
                  onClick={handleBgmToggle}
                >
                  {bgmOn ? 'Çalıyor 🎵' : 'Kapalı'}
                </button>
              </div>
            </div>

            <button
              className="btn-neon-cyan"
              style={{ width: '100%' }}
              onClick={() => setShowChatModal(false)}
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
