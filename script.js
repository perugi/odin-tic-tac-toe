const gameboard = (() => {
  let board = [];
  const DIMENSION = 3;

  // Initialize the board to a square array of empty spaces.
  for (let i = 0; i < DIMENSION; i++) {
    board.push([]);
    for (let j = 0; j < DIMENSION; j++) {
      board[i].push(" ");
    }
  }

  function getBoard() {
    return board;
  }

  function printBoard() {
    console.log(board[0][0] + " | " + board[0][1] + " | " + board[0][2]);
    console.log("---+---+---");
    console.log(board[1][0] + " | " + board[1][1] + " | " + board[1][2]);
    console.log("---+---+---");
    console.log(board[2][0] + " | " + board[2][1] + " | " + board[2][2]);
  }

  function _isCharValid(char) {
    return char === "x" || char === "o";
  }

  function _isSpaceEmpty(row, col) {
    return board[row][col] === " ";
  }

  function setCharacter(row, col, char) {
    if (!_isCharValid(char) || !_isSpaceEmpty(row, col)) {
      return false;
    }

    board[row][col] = char;
    return true;
  }

  return { getBoard, setCharacter };
})();

const Player = (symbol) => {
  return { symbol };
};

const gameController = (() => {})();

const newPlayer = Player("X");
console.log(newPlayer);
console.log(newPlayer.symbol);
