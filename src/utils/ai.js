// Tic Tac Toe AI with Minimax and Heuristics for 3x3 and 5x5

export function checkWinner(board, size = 3, target = 3) {
  // Returns { winner: 'X' | 'O' | 'draw' | null, line: [indices] }
  const lines = getWinningLines(size, target);

  for (const line of lines) {
    const first = board[line[0]];
    if (first && line.every(idx => board[idx] === first)) {
      return { winner: first, line };
    }
  }

  if (board.every(cell => cell !== null)) {
    return { winner: 'draw', line: null };
  }

  return null;
}

export function getWinningLines(size = 3, target = 3) {
  const lines = [];

  // Rows
  for (let r = 0; r < size; r++) {
    for (let c = 0; c <= size - target; c++) {
      const line = [];
      for (let i = 0; i < target; i++) {
        line.push(r * size + (c + i));
      }
      lines.push(line);
    }
  }

  // Columns
  for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - target; r++) {
      const line = [];
      for (let i = 0; i < target; i++) {
        line.push((r + i) * size + c);
      }
      lines.push(line);
    }
  }

  // Diagonals (\)
  for (let r = 0; r <= size - target; r++) {
    for (let c = 0; c <= size - target; c++) {
      const line = [];
      for (let i = 0; i < target; i++) {
        line.push((r + i) * size + (c + i));
      }
      lines.push(line);
    }
  }

  // Anti-diagonals (/)
  for (let r = 0; r <= size - target; r++) {
    for (let c = target - 1; c < size; c++) {
      const line = [];
      for (let i = 0; i < target; i++) {
        line.push((r + i) * size + (c - i));
      }
      lines.push(line);
    }
  }

  return lines;
}

// Minimax for 3x3
function minimax(board, depth, isMaximizing, alpha, beta) {
  const result = checkWinner(board, 3, 3);
  if (result) {
    if (result.winner === 'O') return 10 - depth;
    if (result.winner === 'X') return depth - 10;
    if (result.winner === 'draw') return 0;
  }

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'O';
        const evaluation = minimax(board, depth + 1, false, alpha, beta);
        board[i] = null;
        maxEval = Math.max(maxEval, evaluation);
        alpha = Math.max(alpha, evaluation);
        if (beta <= alpha) break;
      }
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let i = 0; i < 9; i++) {
      if (board[i] === null) {
        board[i] = 'X';
        const evaluation = minimax(board, depth + 1, true, alpha, beta);
        board[i] = null;
        minEval = Math.min(minEval, evaluation);
        beta = Math.min(beta, evaluation);
        if (beta <= alpha) break;
      }
    }
    return minEval;
  }
}

export function getBestMove3x3(board, difficulty = 'hard') {
  const availableMoves = [];
  board.forEach((cell, idx) => {
    if (cell === null) availableMoves.push(idx);
  });

  if (availableMoves.length === 0) return -1;

  // Easy mode: 85% random, 15% smart
  if (difficulty === 'easy') {
    if (Math.random() > 0.15) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }

  // Medium mode: 60% smart, 40% random, but always take immediate win
  if (difficulty === 'medium') {
    // Check immediate win
    for (const move of availableMoves) {
      board[move] = 'O';
      if (checkWinner(board, 3, 3)?.winner === 'O') {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }
    // Check immediate block
    for (const move of availableMoves) {
      board[move] = 'X';
      if (checkWinner(board, 3, 3)?.winner === 'X') {
        board[move] = null;
        return move;
      }
      board[move] = null;
    }

    if (Math.random() < 0.4) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }

  // Hard / Impossible mode: Full Minimax
  // Optimization: If opening move and center is free, center is dominant
  if (availableMoves.length === 8 && board[4] === null) {
    return 4;
  }

  let bestVal = -Infinity;
  let bestMove = availableMoves[0];

  for (const move of availableMoves) {
    board[move] = 'O';
    const moveVal = minimax(board, 0, false, -Infinity, Infinity);
    board[move] = null;

    if (moveVal > bestVal) {
      bestVal = moveVal;
      bestMove = move;
    }
  }

  return bestMove;
}

// Smart heuristic for 5x5 (target 4 to win)
export function getBestMove5x5(board, difficulty = 'hard') {
  const size = 5;
  const target = 4;
  const availableMoves = [];
  board.forEach((cell, idx) => {
    if (cell === null) availableMoves.push(idx);
  });

  if (availableMoves.length === 0) return -1;

  // 1. Check if AI can win immediately
  for (const move of availableMoves) {
    board[move] = 'O';
    if (checkWinner(board, size, target)?.winner === 'O') {
      board[move] = null;
      return move;
    }
    board[move] = null;
  }

  // 2. Check if opponent is about to win and block
  for (const move of availableMoves) {
    board[move] = 'X';
    if (checkWinner(board, size, target)?.winner === 'X') {
      board[move] = null;
      return move;
    }
    board[move] = null;
  }

  if (difficulty === 'easy') {
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  // 3. Heuristic evaluation: score moves based on proximity to center and potential lines
  let bestScore = -Infinity;
  let bestMove = availableMoves[0];

  const lines = getWinningLines(size, target);

  for (const move of availableMoves) {
    let score = 0;
    // Prefer center tiles
    const r = Math.floor(move / size);
    const c = move % size;
    const distToCenter = Math.abs(r - 2) + Math.abs(c - 2);
    score += (4 - distToCenter) * 2;

    // Check relevant lines
    for (const line of lines) {
      if (line.includes(move)) {
        let oCount = 0;
        let xCount = 0;
        for (const idx of line) {
          if (board[idx] === 'O') oCount++;
          if (board[idx] === 'X') xCount++;
        }
        if (xCount === 0) {
          score += Math.pow(4, oCount + 1);
        }
        if (oCount === 0 && xCount >= 2) {
          score += Math.pow(3.5, xCount);
        }
      }
    }

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
}

export function getBotMove(board, size = 3, difficulty = 'hard') {
  if (size === 3) {
    return getBestMove3x3(board, difficulty);
  } else {
    return getBestMove5x5(board, difficulty);
  }
}
