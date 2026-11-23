import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomeMenu from './components/HomeMenu';
import TwoPlayerHub from './components/TwoPlayerHub';
import TicTacToeGame from './components/TicTacToeGame';
import StackSixGame from './components/games/StackSixGame';
import TombRunGame from './components/games/TombRunGame';
import BalanceDropGame from './components/games/BalanceDropGame';
import ArrowPuzzleGame from './components/games/ArrowPuzzleGame';
import WaterSortGame from './components/games/WaterSortGame';

export default function App() {
  const [activeTab, setActiveTab] = useState('home'); // 'home' | '2player'
  const [currentScreen, setCurrentScreen] = useState('menu'); // 'menu' | 'game'
  const [activeGame, setActiveGame] = useState('tictactoe'); // 'tictactoe' | 'stacksix' | 'tombrun' | 'balancedrop' | 'arrowpuzzle' | 'watersort'
  const [selectedGameMode, setSelectedGameMode] = useState('bot'); // 'bot' | 'local' | 'tabletop' | 'online'

  // Profile State (Matching screenshot "HK7 ♂" Bio: ...)
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('neon_profile');
      return saved ? JSON.parse(saved) : {
        name: 'HK7',
        gender: '♂',
        bio: 'Bio: Neon Master',
        avatar: '👤'
      };
    } catch {
      return { name: 'HK7', gender: '♂', bio: 'Bio: Neon Master', avatar: '👤' };
    }
  });

  // Stats State
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('neon_stats');
      return saved ? JSON.parse(saved) : { wins: 12, losses: 3, draws: 2 };
    } catch {
      return { wins: 12, losses: 3, draws: 2 };
    }
  });

  const [soundOn, setSoundOn] = useState(true);
  const [bgmOn, setBgmOn] = useState(false);

  // Save profile to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('neon_profile', JSON.stringify(profile));
    } catch {}
  }, [profile]);

  // Save stats to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('neon_stats', JSON.stringify(stats));
    } catch {}
  }, [stats]);

  // Handle URL room invite if user opened a link
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const roomParam = params.get('room');
      if (roomParam) {
        setActiveGame('tictactoe');
        setSelectedGameMode('online');
        setCurrentScreen('game');
      }
    } catch {}
  }, []);

  const handleUpdateStats = (winDelta = 0, lossDelta = 0, drawDelta = 0) => {
    setStats(prev => ({
      wins: prev.wins + winDelta,
      losses: prev.losses + lossDelta,
      draws: prev.draws + drawDelta
    }));
  };

  const handleLaunchGame = (gameId = 'tictactoe', mode = 'bot') => {
    setActiveGame(gameId);
    setSelectedGameMode(mode);
    setCurrentScreen('game');
  };

  return (
    <>
      {/* Retrowave Perspective 3D Grid Background */}
      <div className="synth-background">
        <div className="synth-stars" />
        <div className="synth-horizon-glow" />
        <div className="synth-grid" />
      </div>

      {/* Main Mobile App Container */}
      <main className="app-container">
        {currentScreen === 'menu' ? (
          <>
            <Header
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              profile={profile}
              setProfile={setProfile}
              stats={stats}
              soundOn={soundOn}
              setSoundOn={setSoundOn}
              bgmOn={bgmOn}
              setBgmOn={setBgmOn}
            />

            {activeTab === 'home' ? (
              <HomeMenu onSelectGame={(gameId) => handleLaunchGame(gameId, 'bot')} />
            ) : (
              <TwoPlayerHub onLaunchGame={(mode) => handleLaunchGame('tictactoe', mode)} />
            )}
          </>
        ) : (
          <>
            {activeGame === 'tictactoe' && (
              <TicTacToeGame
                profile={profile}
                initialMode={selectedGameMode}
                onBack={() => setCurrentScreen('menu')}
                stats={stats}
                onUpdateStats={handleUpdateStats}
              />
            )}
            {activeGame === 'stacksix' && (
              <StackSixGame onBack={() => setCurrentScreen('menu')} />
            )}
            {activeGame === 'tombrun' && (
              <TombRunGame onBack={() => setCurrentScreen('menu')} />
            )}
            {activeGame === 'balancedrop' && (
              <BalanceDropGame onBack={() => setCurrentScreen('menu')} />
            )}
            {activeGame === 'arrowpuzzle' && (
              <ArrowPuzzleGame onBack={() => setCurrentScreen('menu')} />
            )}
            {activeGame === 'watersort' && (
              <WaterSortGame onBack={() => setCurrentScreen('menu')} />
            )}
          </>
        )}
      </main>
    </>
  );
}
