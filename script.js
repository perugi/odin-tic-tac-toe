const gameboard = (() => {
  let board = [];
  _createBlankBoard();

  function _createBlankBoard() {
    for (let i = 0; i < 3; i++) {
      board[i] = [];
      for (let j = 0; j < 3; j++) {
        board[i].push(" ");
      }
    }
    console.table(board);
  }

  return { board };
})();
