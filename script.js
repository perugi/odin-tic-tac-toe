const gameboard = (() => {
  let board = [];

  // Initialize the board to a square array of empty spaces.
  for (let i = 0; i < 3; i++) {
    board.push([]);
    for (let j = 0; j < 3; j++) {
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

  function detectWinner() {
    // Check rows
    for (let i = 0; i < board.length; i++) {
      let row = _getRow(i);
      if (_allElementsEqual(row) && row[0] !== " ") {
        return row[0];
      }
    }

    // Check columns
    for (let i = 0; i < board.length; i++) {
      let column = _getColumn(i);
      if (_allElementsEqual(column) && column[0] !== " ") {
        return column[0];
      }
    }

    // Check diagonals
    let diagonal = _getDiagonalOne();
    if (_allElementsEqual(diagonal) && diagonal[0] !== " ") {
      return diagonal[0];
    }

    diagonal = _getDiagonalTwo();
    if (_allElementsEqual(diagonal) && diagonal[0] !== " ") {
      return diagonal[0];
    }

    return null;
  }

  function _getRow(row) {
    return board[row];
  }

  function _getColumn(col) {
    let column = [];
    for (let i = 0; i < board.length; i++) {
      column.push(board[i][col]);
    }
    return column;
  }

  function _getDiagonalOne() {
    let diagonal = [];
    for (let i = 0; i < board.length; i++) {
      diagonal.push(board[i][i]);
    }
    return diagonal;
  }

  function _getDiagonalTwo() {
    let diagonal = [];
    for (let i = 0; i < board.length; i++) {
      diagonal.push(board[i][board.length - 1 - i]);
    }
    return diagonal;
  }

  function isTie() {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j] === " ") {
          return false;
        }
      }
    }
    return true;
  }

  return { getBoard, setCharacter, detectWinner, isTie, printBoard };
})();

function _allElementsEqual(array) {
  return array.every((element) => element === array[0]);
}

const Player = (symbol) => {
  return { symbol };
};

const gameController = (() => {})();