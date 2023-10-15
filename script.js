const gameboard = (() => {
  let board = _createBlankBoard();

  function _createBlankBoard() {
    let board = [];
    for (let i = 0; i < 3; i++) {
      board[i] = [];
      for (let j = 0; j < 3; j++) {
        board[i].push(" ");
      }
    }

    return board;
  }

  function getBoard() {
    return board;
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

const Player = (symbol, isAI) => {
  return { symbol, isAI };
};

const newPlayer = Player("X", false);
console.log(newPlayer);
console.log(newPlayer.symbol);
console.log(newPlayer.isAI);
