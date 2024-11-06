const cells = document.querySelectorAll('[data-cell]');
const board = document.getElementById('board');
const restartButton = document.getElementById('restartButton');
const gameModeSelect = document.getElementById('gameModeSelect');
const difficultySelect = document.getElementById('difficultySelect');

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

let isCircleTurn;
let gameMode = 'single';
let difficulty = 'easy';

function startGame() {
  isCircleTurn = false;
  cells.forEach(cell => {
    cell.classList.remove('x', 'circle');
    cell.textContent = ''; // Clear cell text for new game
    cell.removeEventListener('click', handleClick);
    cell.addEventListener('click', handleClick, { once: true });
  });
  setBoardHoverClass();
  toggleDifficultyOption();
}

function handleClick(e) {
  const cell = e.target;
  const currentClass = isCircleTurn ? 'circle' : 'x';
  placeMark(cell, currentClass);

  if (checkWin(currentClass)) {
    setTimeout(() => endGame(false), 100);
  } else if (isDraw()) {
    setTimeout(() => endGame(true), 100);
  } else {
    swapTurns();
    if (gameMode === 'single' && isCircleTurn) {
      setTimeout(computerMove, 200);
    }
  }
}

function computerMove() {
  let move;
  if (difficulty === 'easy') {
    move = getRandomMove();
  } else {
    move = getBestMove();
  }
  if (move !== undefined) {
    const cell = cells[move];
    placeMark(cell, 'circle');
    if (checkWin('circle')) {
      setTimeout(() => endGame(false), 100);
    } else if (isDraw()) {
      setTimeout(() => endGame(true), 100);
    } else {
      swapTurns();
    }
  }
}

function endGame(draw) {
  if (draw) {
    alert("It's a draw!");
  } else {
    alert(`${isCircleTurn ? "O" : "X"} Wins!`);
  }
  startGame();
}

function isDraw() {
  return [...cells].every(cell => cell.classList.contains('x') || cell.classList.contains('circle'));
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
  cell.textContent = currentClass === 'x' ? 'X' : 'O'; // Display X or O
}

function swapTurns() {
  isCircleTurn = !isCircleTurn;
  setBoardHoverClass();
}

function setBoardHoverClass() {
  board.classList.remove('x', 'circle');
  board.classList.add(isCircleTurn ? 'circle' : 'x');
}

function checkWin(currentClass) {
  return WINNING_COMBINATIONS.some(combination => {
    return combination.every(index => cells[index].classList.contains(currentClass));
  });
}

function getRandomMove() {
  const availableCells = [...cells].filter(cell => !cell.classList.contains('x') && !cell.classList.contains('circle'));
  if (availableCells.length) {
    const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    return Array.from(cells).indexOf(randomCell);
  }
  return undefined;
}

function getBestMove() {
  return minimax([...cells].map(cell => cell.classList.contains('x') ? 'x' : cell.classList.contains('circle') ? 'o' : ''), 'o').index;
}

function minimax(newBoard, player) {
  const availSpots = newBoard.filter(cell => cell === '');

  if (checkWinner(newBoard, 'x')) return { score: -10 };
  if (checkWinner(newBoard, 'o')) return { score: 10 };
  if (availSpots.length === 0) return { score: 0 };

  const moves = [];
  for (let i = 0; i < availSpots.length; i++) {
    const move = {};
    move.index = newBoard.indexOf('');
    newBoard[move.index] = player;

    move.score = minimax(newBoard, player === 'o' ? 'x' : 'o').score;
    newBoard[move.index] = '';
    moves.push(move);
  }

  return moves.reduce((best, move) => {
    if ((player === 'o' && move.score > best.score) || (player === 'x' && move.score < best.score)) return move;
    return best;
  });
}

function checkWinner(board, player) {
  return WINNING_COMBINATIONS.some(combo => combo.every(i => board[i] === player));
}

function toggleDifficultyOption() {
  if (gameMode === 'single') {
    difficultySelect.disabled = false;
  } else {
    difficultySelect.disabled = true;
  }
}

gameModeSelect.addEventListener('change', (e) => {
  gameMode = e.target.value;
  startGame();
});

difficultySelect.addEventListener('change', (e) => {
  difficulty = e.target.value;
  startGame();
});

restartButton.addEventListener('click', startGame);
startGame();
