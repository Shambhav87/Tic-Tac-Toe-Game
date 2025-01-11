// Basic variables
const board = document.getElementById('board'); // Board container
const winnerMessage = document.getElementById('winner-message'); // Winner message
const resetButton = document.getElementById('reset-button'); // Reset button
const scoreX = document.getElementById('score-x'); // Player X score
const scoreO = document.getElementById('score-o'); // Player O score
const boardButtons = document.querySelectorAll('.board-btn'); // Board size buttons

let currentPlayer = 'X'; // Current player
let gameActive = true; // Game status
let boardSize = 3; // Default board size
let boardState = []; // Dynamic board state
let scores = { X: 0, O: 0 }; // Player scores

// Generate dynamic board based on size
function generateBoard(size) {
  board.innerHTML = ''; // Clear existing board
  board.style.gridTemplateColumns = `repeat(${size}, 1fr)`; // Dynamic columns
  board.style.gridTemplateRows = `repeat(${size}, 1fr)`; // Dynamic rows

  boardState = Array(size * size).fill(null); // Reset board state

  for (let i = 0; i < size * size; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.index = i; // Index for tracking
    cell.addEventListener('click', handleCellClick);
    board.appendChild(cell);
  }
}

// Handle cell click
function handleCellClick(e) {
  const cell = e.target;
  const cellIndex = parseInt(cell.dataset.index);

  // Ignore click if already filled or game over
  if (boardState[cellIndex] !== null || !gameActive) return;

  // Update cell and state
  boardState[cellIndex] = currentPlayer;
  cell.textContent = currentPlayer;

  // Check winner
  if (checkWinner()) {
    winnerMessage.textContent = `Player ${currentPlayer} Wins! 🎉`;
    scores[currentPlayer]++;
    updateScore();
    gameActive = false;
    return;
  }

  // Check draw
  if (boardState.every(cell => cell !== null)) {
    winnerMessage.textContent = "It's a Draw! 🤝";
    gameActive = false;
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

// Check winner
function checkWinner() {
  const size = boardSize;
  const winPatterns = [];

  // Rows and Columns
  for (let i = 0; i < size; i++) {
    winPatterns.push(Array.from({ length: size }, (_, k) => i * size + k)); // Rows
    winPatterns.push(Array.from({ length: size }, (_, k) => i + size * k)); // Columns
  }

  // Diagonals
  winPatterns.push(Array.from({ length: size }, (_, k) => k * size + k)); // Main diagonal
  winPatterns.push(Array.from({ length: size }, (_, k) => (k + 1) * (size - 1))); // Anti-diagonal

  return winPatterns.some(pattern =>
    pattern.every(index => boardState[index] === currentPlayer)
  );
}

// Update score on UI
function updateScore() {
  scoreX.textContent = `Player X: ${scores.X}`;
  scoreO.textContent = `Player O: ${scores.O}`;
}

// Reset game
function resetGame() {
  generateBoard(boardSize);
  winnerMessage.textContent = '';
  gameActive = true;
  currentPlayer = 'X';
}

// Event listener for board size selection
boardButtons.forEach(button => {
  button.addEventListener('click', () => {
    boardSize = parseInt(button.id.split('-')[1][0]); // Extract size from button ID
    resetGame();
  });
});

// Initial board setup
generateBoard(boardSize);
resetButton.addEventListener('click', resetGame);