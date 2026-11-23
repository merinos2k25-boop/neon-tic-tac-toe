import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  ArrowLeft, RotateCcw, Bot, Users, Globe, Smartphone, 
  Copy, Check, Share2, Sparkles, AlertCircle 
} from 'lucide-react';
import { sounds } from '../utils/audio';
import { checkWinner, getBotMove, getWinningLines } from '../utils/ai';
import { p2p } from '../utils/p2p';

export default function TicTacToeGame({ 
  profile, 
  onBack, 
  stats, 
  onUpdateStats,
  initialMode = 'bot' // 'bot' | 'local' | 'tabletop' | 'online'
}) {
  const [mode, setMode] = useState(initialMode); // 'bot', 'local', 'tabletop', 'online'
  const [boardSize, setBoardSize] = useState(3); // 3 or 5
  const [difficulty, setDifficulty] = useState('hard'); // 'easy', 'medium', 'hard'
  
  // Board state: Array of size*size with 'X' | 'O' | null
  const [board, setBoard] = useState(Array(9).fill(null));
  const [turn, setTurn] = useState('X'); // 'X' starts
  const [gameResult, setGameResult] = useState(null); // { winner: 'X'|'O'|'draw', line: [] }
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [isBotThinking, setIsBotThinking] = useState(false);

  // Online Multiplayer State
  const [onlineRole, setOnlineRole] = useState(null); // 'host' (X) | 'guest' (O)
  const [roomCode, setRoomCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [onlineConnected, setOnlineConnected] = useState(false);
  const [onlineStatusMsg, setOnlineStatusMsg] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [onlineOpponentEmoji, setOnlineOpponentEmoji] = useState(null);

  const boardRef = useRef(null);

  // Initialize or reset board when size changes
  const resetBoard = useCallback((clearScores = false) => {
    sounds.playClick();
    const cellsCount = boardSize * boardSize;
    setBoard(Array(cellsCount).fill(null));
    setTurn('X');
    setGameResult(null);
    setIsBotThinking(false);
    if (clearScores) {
      setScores({ X: 0, O: 0, draws: 0 });
    }
  }, [boardSize]);

  // Handle Board Size Switch
  const handleSizeChange = (newSize) => {
    if (newSize === boardSize) return;
    sounds.playNav();
    setBoardSize(newSize);
    const cellsCount = newSize * newSize;
    setBoard(Array(cellsCount).fill(null));
    setTurn('X');
    setGameResult(null);
    setScores({ X: 0, O: 0, draws: 0 });
  };

  // Launch Victory Confetti
  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#00f0ff', '#ff2a85', '#b026ff', '#ffd700']
      });
    } catch {}
  };

  // Handle cell click
  const handleCellClick = (index) => {
    // Check if cell is playable
    if (board[index] !== null || gameResult || isBotThinking) return;

    // In online mode, verify it's our turn
    if (mode === 'online') {
      if (!onlineConnected) return;
      if (onlineRole === 'host' && turn !== 'X') return;
      if (onlineRole === 'guest' && turn !== 'O') return;
    }

    const currentMark = turn;
    sounds.playMove(currentMark === 'X');

    const nextBoard = [...board];
    nextBoard[index] = currentMark;
    setBoard(nextBoard);

    // If online, broadcast move to peer
    if (mode === 'online' && onlineConnected) {
      p2p.send({ type: 'MOVE', index, mark: currentMark });
    }

    // Check winner
    const target = boardSize === 3 ? 3 : 4;
    const result = checkWinner(nextBoard, boardSize, target);

    if (result) {
      handleGameOver(result, currentMark);
    } else {
      setTurn(currentMark === 'X' ? 'O' : 'X');
    }
  };

  // Handle Game Over
  const handleGameOver = (result, lastMark) => {
    setGameResult(result);

    if (result.winner === 'draw') {
      sounds.playDraw();
      setScores(s => ({ ...s, draws: s.draws + 1 }));
      onUpdateStats(0, 0, 1);
    } else {
      sounds.playWin();
      triggerConfetti();
      setScores(s => ({
        ...s,
        [result.winner]: s[result.winner] + 1
      }));

      if (mode === 'bot') {
        if (result.winner === 'X') {
          onUpdateStats(1, 0, 0);
        } else {
          onUpdateStats(0, 1, 0);
        }
      } else {
        onUpdateStats(1, 0, 0);
      }
    }
  };

  // Bot Turn Trigger
  useEffect(() => {
    if (mode !== 'bot') return;
    if (turn === 'O' && !gameResult && !isBotThinking) {
      setIsBotThinking(true);
      const timer = setTimeout(() => {
        const botIndex = getBotMove(board, boardSize, difficulty);
        if (botIndex !== -1 && board[botIndex] === null) {
          sounds.playMove(false);
          const nextBoard = [...board];
          nextBoard[botIndex] = 'O';
          setBoard(nextBoard);

          const target = boardSize === 3 ? 3 : 4;
          const result = checkWinner(nextBoard, boardSize, target);

          if (result) {
            handleGameOver(result, 'O');
          } else {
            setTurn('X');
          }
        }
        setIsBotThinking(false);
      }, 420);

      return () => clearTimeout(timer);
    }
  }, [turn, mode, board, gameResult, boardSize, difficulty]);

  // Online Multiplayer Setup
  const handleCreateRoom = async () => {
    sounds.playClick();
    setOnlineStatusMsg('Oda oluşturuluyor...');
    try {
      const code = await p2p.createRoom(null, {
        onConnect: () => {
          setOnlineConnected(true);
          setOnlineRole('host');
          setOnlineStatusMsg('Arkadaşın bağlandı! Sen "X" (Mavi) oyuncususun.');
          sounds.playWin();
          resetBoard(true);
        },
        onData: (data) => {
          handleOnlineData(data);
        },
        onClose: () => {
          setOnlineConnected(false);
          setOnlineStatusMsg('Arkadaşının bağlantısı koptu.');
          sounds.playDraw();
        },
        onError: () => {
          setOnlineStatusMsg('Bağlantı hatası oluştu.');
        }
      });
      setRoomCode(code);
      setOnlineRole('host');
      setOnlineStatusMsg(`Oda Kodu: ${code} - Arkadaşını bekliyor...`);
    } catch {
      setOnlineStatusMsg('Oda açılamadı, lütfen tekrar dene.');
    }
  };

  const handleJoinRoom = async () => {
    if (!inputCode.trim()) return;
    sounds.playClick();
    setOnlineStatusMsg('Odaya bağlanılıyor...');
    try {
      await p2p.joinRoom(inputCode, {
        onConnect: () => {
          setOnlineConnected(true);
          setOnlineRole('guest');
          setOnlineStatusMsg('Odaya bağlandın! Sen "O" (Pembe) oyuncususun.');
          sounds.playWin();
          resetBoard(true);
        },
        onData: (data) => {
          handleOnlineData(data);
        },
        onClose: () => {
          setOnlineConnected(false);
          setOnlineStatusMsg('Oda kapandı.');
          sounds.playDraw();
        },
        onError: () => {
          setOnlineStatusMsg('Odaya bağlanılamadı. Kodu kontrol et.');
        }
      });
    } catch {
      setOnlineStatusMsg('Oda bulunamadı.');
    }
  };

  const handleOnlineData = (data) => {
    if (data.type === 'MOVE') {
      sounds.playMove(data.mark === 'X');
      setBoard(prev => {
        const next = [...prev];
        next[data.index] = data.mark;
        return next;
      });

      const nextBoard = [...board];
      nextBoard[data.index] = data.mark;
      const target = boardSize === 3 ? 3 : 4;
      const result = checkWinner(nextBoard, boardSize, target);
      if (result) {
        handleGameOver(result, data.mark);
      } else {
        setTurn(data.mark === 'X' ? 'O' : 'X');
      }
    } else if (data.type === 'RESTART') {
      resetBoard(false);
      setOnlineStatusMsg('Oyun yeniden başlatıldı!');
    } else if (data.type === 'EMOJI') {
      setOnlineOpponentEmoji(data.emoji);
      setTimeout(() => setOnlineOpponentEmoji(null), 2500);
    }
  };

  const sendOnlineEmoji = (emoji) => {
    sounds.playClick();
    if (mode === 'online' && onlineConnected) {
      p2p.send({ type: 'EMOJI', emoji });
    }
  };

  const copyRoomCode = () => {
    sounds.playClick();
    navigator.clipboard?.writeText(roomCode);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Cleanup P2P on unmount
  useEffect(() => {
    return () => {
      p2p.destroy();
    };
  }, []);

  // Calculate Strike Line SVG Coordinates accurately without breaking CSS Grid
  const renderWinningStrikeLine = () => {
    if (!gameResult || !gameResult.line || gameResult.winner === 'draw') return null;
    
    const line = gameResult.line;
    const startIdx = line[0];
    const endIdx = line[line.length - 1];

    const startRow = Math.floor(startIdx / boardSize);
    const startCol = startIdx % boardSize;
    const endRow = Math.floor(endIdx / boardSize);
    const endCol = endIdx % boardSize;

    let x1, y1, x2, y2;

    if (startRow === endRow) {
      // Horizontal row win
      y1 = y2 = ((startRow + 0.5) / boardSize) * 100;
      x1 = 4;
      x2 = 96;
    } else if (startCol === endCol) {
      // Vertical column win
      x1 = x2 = ((startCol + 0.5) / boardSize) * 100;
      y1 = 4;
      y2 = 96;
    } else if (startRow < endRow && startCol < endCol) {
      // Diagonal (\)
      x1 = 6;
      y1 = 6;
      x2 = 94;
      y2 = 94;
    } else {
      // Anti-diagonal (/)
      x1 = 6;
      y1 = 94;
      x2 = 94;
      y2 = 6;
    }

    const lineColor = gameResult.winner === 'X' ? '#00f0ff' : '#ff2a85';

    return (
      <svg
        style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          right: '14px',
          bottom: '14px',
          width: 'calc(100% - 28px)',
          height: 'calc(100% - 28px)',
          pointerEvents: 'none',
          zIndex: 35
        }}
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={lineColor}
          strokeWidth="6"
          strokeLinecap="round"
          style={{
            filter: `drop-shadow(0 0 8px ${lineColor}) drop-shadow(0 0 16px #ffffff)`
          }}
        />
      </svg>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, paddingBottom: '20px' }}>
      {/* Top Header: Back button & Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <button
          onClick={() => {
            sounds.playNav();
            p2p.destroy();
            onBack();
          }}
          className="btn-neon-purple"
          style={{ padding: '8px 14px', borderRadius: '12px' }}
        >
          <ArrowLeft size={18} />
          <span>Geri</span>
        </button>

        <h2 style={{
          fontFamily: "'Fredoka', sans-serif",
          fontSize: '1.45rem',
          color: '#ffea79',
          textShadow: '0 0 12px rgba(255, 215, 0, 0.8)'
        }}>
          Tic Tac Toe Glow
        </h2>

        <button
          onClick={() => {
            if (mode === 'online' && onlineConnected) {
              p2p.send({ type: 'RESTART' });
            }
            resetBoard(false);
          }}
          className="btn-neon-cyan"
          style={{ padding: '8px 12px', borderRadius: '12px' }}
          title="Yeniden Başlat"
        >
          <RotateCcw size={18} />
        </button>
      </div>

      {/* Mode Selector Tabs */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '6px',
        marginBottom: '12px'
      }}>
        <button
          onClick={() => { sounds.playClick(); setMode('bot'); resetBoard(true); }}
          style={{
            padding: '7px 4px',
            borderRadius: '10px',
            background: mode === 'bot' ? 'rgba(0, 240, 255, 0.25)' : 'rgba(255,255,255,0.05)',
            border: mode === 'bot' ? '1.8px solid #00f0ff' : '1px solid rgba(255,255,255,0.1)',
            color: mode === 'bot' ? '#00f0ff' : '#9d80c0',
            fontWeight: 700,
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <Bot size={16} />
          <span>Bot</span>
        </button>

        <button
          onClick={() => { sounds.playClick(); setMode('local'); resetBoard(true); }}
          style={{
            padding: '7px 4px',
            borderRadius: '10px',
            background: mode === 'local' ? 'rgba(255, 42, 133, 0.25)' : 'rgba(255,255,255,0.05)',
            border: mode === 'local' ? '1.8px solid #ff2a85' : '1px solid rgba(255,255,255,0.1)',
            color: mode === 'local' ? '#ff2a85' : '#9d80c0',
            fontWeight: 700,
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <Smartphone size={16} />
          <span>Yan Yana</span>
        </button>

        <button
          onClick={() => { sounds.playClick(); setMode('tabletop'); resetBoard(true); }}
          style={{
            padding: '7px 4px',
            borderRadius: '10px',
            background: mode === 'tabletop' ? 'rgba(184, 43, 245, 0.25)' : 'rgba(255,255,255,0.05)',
            border: mode === 'tabletop' ? '1.8px solid #b82bf5' : '1px solid rgba(255,255,255,0.1)',
            color: mode === 'tabletop' ? '#ffea79' : '#9d80c0',
            fontWeight: 700,
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <Users size={16} />
          <span>Yüzyüze</span>
        </button>

        <button
          onClick={() => { sounds.playClick(); setMode('online'); resetBoard(true); }}
          style={{
            padding: '7px 4px',
            borderRadius: '10px',
            background: mode === 'online' ? 'rgba(0, 240, 255, 0.25)' : 'rgba(255,255,255,0.05)',
            border: mode === 'online' ? '1.8px solid #00f0ff' : '1px solid rgba(255,255,255,0.1)',
            color: mode === 'online' ? '#00f0ff' : '#9d80c0',
            fontWeight: 700,
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px'
          }}
        >
          <Globe size={16} />
          <span>Online</span>
        </button>
      </div>

      {/* Sub-controls: Difficulty (for Bot) */}
      {mode === 'bot' && (
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px',
          background: 'rgba(18, 5, 38, 0.6)',
          padding: '6px 12px',
          borderRadius: '12px',
          border: '1px solid rgba(184, 43, 245, 0.3)'
        }}>
          <span style={{ fontSize: '0.8rem', color: '#9d80c0' }}>Bot Seviyesi:</span>
          {[
            { id: 'easy', label: 'Kolay' },
            { id: 'medium', label: 'Orta' },
            { id: 'hard', label: 'İmkansız 🧠' }
          ].map(d => (
            <button
              key={d.id}
              onClick={() => { sounds.playClick(); setDifficulty(d.id); resetBoard(false); }}
              style={{
                padding: '4px 8px',
                borderRadius: '8px',
                background: difficulty === d.id ? '#ff2a85' : 'transparent',
                border: difficulty === d.id ? '1px solid #ff2a85' : 'none',
                color: difficulty === d.id ? '#ffffff' : '#9d80c0',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: difficulty === d.id ? '0 0 8px #ff2a85' : 'none'
              }}
            >
              {d.label}
            </button>
          ))}
        </div>
      )}

      {/* Board Size Toggle (3x3 vs 5x5) */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginBottom: '14px'
      }}>
        <button
          onClick={() => handleSizeChange(3)}
          style={{
            padding: '5px 14px',
            borderRadius: '10px',
            background: boardSize === 3 ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: boardSize === 3 ? '1.5px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
            color: boardSize === 3 ? '#00f0ff' : '#9d80c0',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Klasik (3x3)
        </button>

        <button
          onClick={() => handleSizeChange(5)}
          style={{
            padding: '5px 14px',
            borderRadius: '10px',
            background: boardSize === 5 ? 'rgba(255, 42, 133, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            border: boardSize === 5 ? '1.5px solid #ff2a85' : '1px solid rgba(255, 255, 255, 0.1)',
            color: boardSize === 5 ? '#ff2a85' : '#9d80c0',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Geniş (5x5 • 4'lü Kazanır)
        </button>
      </div>

      {/* Online Room Modal / Banner */}
      {mode === 'online' && !onlineConnected && (
        <div style={{
          background: 'rgba(18, 5, 38, 0.9)',
          border: '2px solid #00f0ff',
          borderRadius: '16px',
          padding: '14px',
          marginBottom: '14px',
          boxShadow: '0 0 16px rgba(0, 240, 255, 0.35)',
          textAlign: 'center'
        }}>
          <h4 style={{ color: '#00f0ff', marginBottom: '8px', fontSize: '1.05rem', fontWeight: 700 }}>
            🌐 Çevrimiçi Arkadaşınla Oyna
          </h4>
          <p style={{ color: '#9d80c0', fontSize: '0.8rem', marginBottom: '12px' }}>
            İster oda oluşturup kodunu arkadaşına gönder, ister arkadaşının kodunu gir!
          </p>

          <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
            <button
              className="btn-neon-cyan"
              style={{ flex: 1, padding: '8px', fontSize: '0.85rem' }}
              onClick={handleCreateRoom}
            >
              Oda Oluştur
            </button>
            <div style={{ display: 'flex', flex: 1, gap: '4px' }}>
              <input
                type="text"
                placeholder="KOD GİR"
                maxLength={6}
                value={inputCode}
                onChange={e => setInputCode(e.target.value.toUpperCase())}
                style={{
                  width: '65%',
                  background: 'rgba(0,0,0,0.5)',
                  border: '1.5px solid #ff2a85',
                  borderRadius: '10px',
                  color: '#ffffff',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
              <button
                className="btn-neon-pink"
                style={{ flex: 1, padding: '8px 4px', fontSize: '0.8rem' }}
                onClick={handleJoinRoom}
              >
                Katıl
              </button>
            </div>
          </div>

          {roomCode && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              background: 'rgba(0, 240, 255, 0.1)',
              padding: '6px 12px',
              borderRadius: '10px',
              marginTop: '8px'
            }}>
              <span style={{ color: '#ffea79', fontWeight: 800, fontSize: '1.1rem', letterSpacing: '2px' }}>
                {roomCode}
              </span>
              <button
                onClick={copyRoomCode}
                style={{ background: 'none', border: 'none', color: '#00f0ff', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
              >
                {copiedLink ? <Check size={18} color="#39ff14" /> : <Copy size={18} />}
              </button>
            </div>
          )}

          {onlineStatusMsg && (
            <div style={{ marginTop: '8px', color: '#ffea79', fontSize: '0.8rem' }}>
              {onlineStatusMsg}
            </div>
          )}
        </div>
      )}

      {/* Opponent Emoji Popover */}
      {onlineOpponentEmoji && (
        <div style={{
          position: 'fixed',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '64px',
          zIndex: 50,
          animation: 'bounceArrow 0.6s infinite'
        }}>
          {onlineOpponentEmoji}
        </div>
      )}

      {/* Tabletop Player 2 (Top Inverted Header) */}
      {mode === 'tabletop' && (
        <div style={{
          transform: 'rotate(180deg)',
          background: 'rgba(255, 42, 133, 0.15)',
          border: '1.8px solid #ff2a85',
          borderRadius: '14px',
          padding: '8px 14px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          <span style={{ color: '#ff2a85', fontWeight: 800, fontSize: '1rem' }}>
            OYUNCU 2 (O)
          </span>
          <span style={{ color: turn === 'O' ? '#39ff14' : '#9d80c0', fontWeight: 700, fontSize: '0.85rem' }}>
            {turn === 'O' ? '👉 SENİN SIRAN!' : 'Rakip Bekleniyor...'}
          </span>
          <span style={{ color: '#ffea79', fontWeight: 800, fontSize: '1.1rem' }}>
            {scores.O}
          </span>
        </div>
      )}

      {/* Score & Turn Banner */}
      <div className={`turn-banner ${turn === 'X' ? 'turn-x' : 'turn-o'}`}>
        {/* Player X Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(0, 240, 255, 0.2)',
            border: '1.5px solid #00f0ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: turn === 'X' ? '0 0 10px #00f0ff' : 'none'
          }}>
            <span style={{ color: '#00f0ff', fontWeight: 900, fontSize: '1.1rem' }}>X</span>
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#00f0ff' }}>
              {mode === 'bot' ? profile.name : 'Oyuncu 1'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9d80c0' }}>Skor: {scores.X}</div>
          </div>
        </div>

        {/* Center Game Status Message */}
        <div style={{ textAlign: 'center' }}>
          {gameResult ? (
            <div style={{
              color: gameResult.winner === 'draw' ? '#ffd700' : (gameResult.winner === 'X' ? '#00f0ff' : '#ff2a85'),
              fontWeight: 800,
              fontSize: '1rem',
              animation: 'pulseBadge 1s infinite'
            }}>
              {gameResult.winner === 'draw' ? 'BERABERE!' : `${gameResult.winner} KAZANDI! 🏆`}
            </div>
          ) : (
            <div style={{
              color: turn === 'X' ? '#00f0ff' : '#ff2a85',
              fontWeight: 700,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {isBotThinking ? (
                <span>Bot Düşünüyor...</span>
              ) : (
                <span>Sıra: <strong>{turn}</strong></span>
              )}
            </div>
          )}
        </div>

        {/* Player O Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexDirection: 'row-reverse' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(255, 42, 133, 0.2)',
            border: '1.5px solid #ff2a85',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: turn === 'O' ? '0 0 10px #ff2a85' : 'none'
          }}>
            <span style={{ color: '#ff2a85', fontWeight: 900, fontSize: '1.1rem' }}>O</span>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ff2a85' }}>
              {mode === 'bot' ? 'CyberBot' : 'Oyuncu 2'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9d80c0' }}>Skor: {scores.O}</div>
          </div>
        </div>
      </div>

      {/* Main Tic Tac Toe Board Wrapper (Guarantees SVG line NEVER shifts CSS grid cells) */}
      <div 
        ref={boardRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '380px',
          aspectRatio: '1 / 1',
          margin: '0 auto'
        }}
      >
        <div 
          className="neon-board"
          style={{
            width: '100%',
            height: '100%',
            gridTemplateColumns: `repeat(${boardSize}, 1fr)`,
            gridTemplateRows: `repeat(${boardSize}, 1fr)`
          }}
        >
          {board.map((cell, idx) => {
            const isWinningCell = gameResult?.line?.includes(idx);

            return (
              <button
                key={idx}
                className={`cell-btn ${isWinningCell ? 'highlight' : ''}`}
                onClick={() => handleCellClick(idx)}
                disabled={cell !== null || !!gameResult || isBotThinking}
                aria-label={`Kare ${idx}`}
              >
                {cell === 'X' && (
                  <svg viewBox="0 0 50 50" width={boardSize === 3 ? "54" : "36"} height={boardSize === 3 ? "54" : "36"}>
                    <line x1="10" y1="10" x2="40" y2="40" className="neon-svg-x" />
                    <line x1="40" y1="10" x2="10" y2="40" className="neon-svg-x" />
                  </svg>
                )}
                {cell === 'O' && (
                  <svg viewBox="0 0 50 50" width={boardSize === 3 ? "54" : "36"} height={boardSize === 3 ? "54" : "36"}>
                    <circle cx="25" cy="25" r="15" className="neon-svg-o" />
                  </svg>
                )}
              </button>
            );
          })}
        </div>

        {/* Winning Strike Overlay - sibling to grid, prevents all shift bugs */}
        {renderWinningStrikeLine()}
      </div>

      {/* Online Quick Taunt Emojis */}
      {mode === 'online' && onlineConnected && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '14px' }}>
          {['😎', '🔥', '👏', '😱', '👑', '⚡'].map(emoji => (
            <button
              key={emoji}
              onClick={() => sendOnlineEmoji(emoji)}
              style={{
                fontSize: '20px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(0, 240, 255, 0.3)',
                borderRadius: '10px',
                padding: '4px 8px',
                cursor: 'pointer'
              }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Post Game Actions */}
      {gameResult && (
        <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
          <button
            className="btn-neon-cyan"
            style={{ flex: 1, padding: '12px' }}
            onClick={() => {
              if (mode === 'online' && onlineConnected) {
                p2p.send({ type: 'RESTART' });
              }
              resetBoard(false);
            }}
          >
            <RotateCcw size={18} />
            <span>Tekrar Oyna</span>
          </button>

          <button
            className="btn-neon-pink"
            style={{ flex: 1, padding: '12px' }}
            onClick={() => {
              sounds.playNav();
              p2p.destroy();
              onBack();
            }}
          >
            <span>Menüye Dön</span>
          </button>
        </div>
      )}
    </div>
  );
}
