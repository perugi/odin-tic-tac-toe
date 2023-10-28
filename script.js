const Cell = () => {
  let value = " ";

  function getValue() {
    return value;
  }

  function setValue(char) {
    if (!_isCharValid(char) || !_isCellEmpty()) {
      return false;
    }

    value = char;
    return true;
  }

  function _isCharValid(char) {
    return char === "X" || char === "O";
  }

  function _isCellEmpty() {
    return value === " ";
  }

  return { getValue, setValue };
};

const Gameboard = () => {
  let board;
  initializeBoard();

  function initializeBoard() {
    board = [];
    for (let i = 0; i < 3; i++) {
      board.push([]);
      for (let j = 0; j < 3; j++) {
        board[i].push(Cell());
      }
    }
  }

  function getBoard() {
    return board;
  }

  function printBoard() {
    console.log(
      board[0][0].getValue() +
        " | " +
        board[0][1].getValue() +
        " | " +
        board[0][2].getValue()
    );
    console.log("---+---+---");
    console.log(
      board[1][0].getValue() +
        " | " +
        board[1][1].getValue() +
        " | " +
        board[1][2].getValue()
    );
    console.log("---+---+---");
    console.log(
      board[2][0].getValue() +
        " | " +
        board[2][1].getValue() +
        " | " +
        board[2][2].getValue()
    );
  }

  function setCharacter(row, col, char) {
    return board[row][col].setValue(char);
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
    return board[row].map((cell) => cell.getValue());
  }

  function _getColumn(col) {
    let column = [];
    for (let i = 0; i < board.length; i++) {
      column.push(board[i][col].getValue());
    }
    return column;
  }

  function _getDiagonalOne() {
    let diagonal = [];
    for (let i = 0; i < board.length; i++) {
      diagonal.push(board[i][i].getValue());
    }
    return diagonal;
  }

  function _getDiagonalTwo() {
    let diagonal = [];
    for (let i = 0; i < board.length; i++) {
      diagonal.push(board[i][board.length - 1 - i].getValue());
    }
    return diagonal;
  }

  function isTie() {
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j].getValue() === " ") {
          return false;
        }
      }
    }
    return true;
  }

  function _allElementsEqual(array) {
    return array.every((element) => element === array[0]);
  }

  return {
    getBoard,
    setCharacter,
    detectWinner,
    isTie,
    printBoard,
    initializeBoard,
  };
};

const Player = (name, symbol) => {
  return { name, symbol };
};

const gameController = (() => {
  const board = Gameboard();
  let players;
  let currentPlayer;

  function _switchPlayerTurn() {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function getWinner() {
    return winner;
  }

  function newGame(playerXName, playerOName) {
    board.initializeBoard();
    players = [Player(playerXName, "X"), Player(playerOName, "O")];
    console.log(players);
    currentPlayer = players[0];
    winner = null;

    board.printBoard();
    console.log(`It's ${currentPlayer.name}'s turn.`);
  }

  function playRound(row, col) {
    if (board.setCharacter(row, col, currentPlayer.symbol)) {
      board.printBoard();

      if (board.detectWinner()) {
        console.log(`${currentPlayer.name} wins!`);
        winner = currentPlayer.name;
        return true;
      }

      if (board.isTie()) {
        console.log("It's a tie!");
        winner = "tie";
        return true;
      }

      _switchPlayerTurn();
      console.log(`It's ${currentPlayer.name}'s turn.`);
      return true;
    }
    return false;
  }

  return {
    playRound,
    getCurrentPlayer,
    getBoard: board.getBoard,
    getWinner,
    newGame,
  };
})();

const screenController = (() => {
  const setupContainer = document.querySelector(".setup-container");
  const playerXField = document.querySelector(".playerX");
  const playerOField = document.querySelector(".playerO");
  const startButton = document.querySelector(".start-button");
  startButton.addEventListener("click", _startNewGame);

  const gameContainer = document.querySelector(".game-container");
  const gameboard = document.querySelector(".gameboard");
  const gameInfo = document.querySelector(".game-info");
  const restartButon = document.querySelector(".restart-button");
  restartButon.addEventListener("click", _startNewGame);
  const quitButton = document.querySelector(".quit-button");
  quitButton.addEventListener("click", _renderSetupScreen);

  _renderSetupScreen();

  function _renderSetupScreen() {
    gameContainer.style.display = "none";
    setupContainer.style.display = "block";
  }

  function _renderGameScreen() {
    gameContainer.style.display = "block";
    setupContainer.style.display = "none";

    const board = gameController.getBoard();
    gameboard.innerHTML = "";

    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        const boardCell = document.createElement("div");
        boardCell.classList.add("board-cell");

        boardCell.dataset.row = i;
        boardCell.dataset.col = j;
        boardCell.textContent = board[i][j].getValue();
        if (boardCell.textContent === " ") {
          boardCell.classList.add("empty");
        }
        boardCell.addEventListener("mouseenter", _fillPlaceholder);
        boardCell.addEventListener("mouseleave", _clearPlaceholder);

        gameboard.appendChild(boardCell);
      }
    }

    if (gameController.getWinner()) {
      if (gameController.getWinner() == "tie") {
        gameInfo.textContent = "It's a tie!";
      } else {
        gameInfo.textContent = `${gameController.getWinner()} wins!`;
      }
      gameboard.removeEventListener("click", _clickBoardCell);

      let boardCells = document.querySelectorAll(".board-cell");
      boardCells.forEach((cell) => {
        cell.removeEventListener("mouseenter", _fillPlaceholder);
        cell.removeEventListener("mouseleave", _clearPlaceholder);
      });
    } else {
      gameInfo.textContent = `It's ${
        gameController.getCurrentPlayer().name
      }'s turn.`;
    }
  }

  function _clickBoardCell(e) {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;

    if (gameController.playRound(row, col)) {
      _renderGameScreen();
      console.log(e.target);
    }
  }

  function _startNewGame() {
    let playerXName = playerXField.value || "X";
    let playerOName = playerOField.value || "O";
    playerXField.value = "";
    playerOField.value = "";
    gameController.newGame(playerXName, playerOName);

    _renderGameScreen();
    gameboard.addEventListener("click", _clickBoardCell);
  }

  function _fillPlaceholder() {
    if (this.classList.contains("empty")) {
      this.textContent = gameController.getCurrentPlayer().symbol;
    }
  }

  function _clearPlaceholder() {
    if (this.classList.contains("empty")) {
      this.textContent = " ";
    }
  }

  return {};
})();
