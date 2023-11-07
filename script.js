const events = (() => {
  let events = {};

  function on(eventName, fn) {
    events[eventName] = events[eventName] || [];
    events[eventName].push(fn);
  }

  function off(eventName, fn) {
    if (events[eventName]) {
      for (var i = 0; i < events[eventName].length; i++) {
        if (events[eventName][i] === fn) {
          events[eventName].splice(i, 1);
          break;
        }
      }
    }
  }

  function emit(eventName, data) {
    if (events[eventName]) {
      events[eventName].forEach(function (fn) {
        fn(data);
      });
    }
  }

  return {
    on,
    off,
    emit,
  };
})();

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

  function getRandomEmptyCell() {
    let emptyCells = [];
    for (let i = 0; i < board.length; i++) {
      for (let j = 0; j < board[0].length; j++) {
        if (board[i][j].getValue() === " ") {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    return emptyCells[Math.floor(Math.random() * emptyCells.length)];
  }

  return {
    getBoard,
    setCharacter,
    detectWinner,
    isTie,
    printBoard,
    initializeBoard,
    getRandomEmptyCell,
  };
};

const Player = (name, symbol, isAI) => {
  return {
    name,
    symbol,
    isAI,
  };
};

const PlayerData = (playerXName, playerXIsAi, playerOName, playerOIsAi) => {
  return {
    playerXName,
    playerXIsAi,
    playerOName,
    playerOIsAi,
  };
};

const TurnData = (row, col) => {
  return {
    row,
    col,
  };
};

const GameData = (board, currentPlayer, winner) => {
  return {
    board,
    currentPlayer,
    winner,
  };
};

const gameController = (() => {
  const board = Gameboard();
  let players;
  let currentPlayer;

  events.on("newGame", newGame);
  events.on("playRound", playRound);

  function _switchPlayerTurn() {
    currentPlayer = currentPlayer === players[0] ? players[1] : players[0];
  }

  function getCurrentPlayer() {
    return currentPlayer;
  }

  function getWinner() {
    return winner;
  }

  async function newGame(playerData) {
    board.initializeBoard();
    players = [
      Player(playerData.playerXName, "X", playerData.playerXIsAi),
      Player(playerData.playerOName, "O", playerData.playerOIsAi),
    ];
    console.log(players);
    currentPlayer = players[0];
    winner = null;

    board.printBoard();

    events.emit("newGameSetUp", GameData(board, currentPlayer, winner));

    if (currentPlayer.isAI) {
      _makeAiMove();
    } else {
      console.log(`It's ${currentPlayer.name}'s turn.`);
    }
  }

  async function playRound(turnData) {
    if (board.setCharacter(turnData.row, turnData.col, currentPlayer.symbol)) {
      board.printBoard();

      if (board.detectWinner()) {
        console.log(`${currentPlayer.name} wins!`);
        winner = currentPlayer.name;
        currentPlayer = null;
      } else if (board.isTie()) {
        console.log("It's a tie!");
        winner = "tie";
        currentPlayer = null;
      } else {
        _switchPlayerTurn();
      }

      events.emit("roundFinished", GameData(board, currentPlayer, winner));
      if (currentPlayer) {
        if (currentPlayer.isAI) {
          _makeAiMove();
        } else {
          console.log(`It's ${currentPlayer.name}'s turn.`);
        }
      }

      return true;
    }
    return false;
  }

  async function _makeAiMove() {
    console.log(`AI ${currentPlayer.name} is thinking...`);
    await sleep(1000);
    const randomEmptyCell = board.getRandomEmptyCell();
    playRound(TurnData(randomEmptyCell.row, randomEmptyCell.col));
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
  const playerXNameInput = document.querySelector(".playerX");
  const playerONameInput = document.querySelector(".playerO");
  const playerXAiInput = document.querySelector("#playerX-ai");
  const playerOAiInput = document.querySelector("#playerO-ai");
  const startButton = document.querySelector(".start-button");
  startButton.addEventListener("click", () => {
    events.on("roundFinished", _renderGameScreen);
    _startNewGame();
  });

  const gameContainer = document.querySelector(".game-container");
  const gameboard = document.querySelector(".gameboard");
  const gameInfo = document.querySelector(".game-info");
  const restartButon = document.querySelector(".restart-button");
  restartButon.addEventListener("click", _startNewGame);
  const quitButton = document.querySelector(".quit-button");
  quitButton.addEventListener("click", () => {
    events.off("roundFinished", _renderGameScreen);
    _renderSetupScreen();
  });

  _renderSetupScreen();

  events.on("newGameSetUp", _renderGameScreen);
  events.on("roundFinished", _renderGameScreen);

  function _renderSetupScreen() {
    playerXNameInput.value = "";
    playerONameInput.value = "";
    playerXAiInput.value = false;
    playerOAiInput.value = false;
    gameContainer.style.display = "none";
    setupContainer.style.display = "block";
  }

  function _renderGameScreen(gameData) {
    gameContainer.style.display = "block";
    setupContainer.style.display = "none";

    let board = gameData.board.getBoard();
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

    if (gameData.winner) {
      if (gameData.winner == "tie") {
        gameInfo.textContent = "It's a tie!";
      } else {
        gameInfo.textContent = `${gameData.winner} wins!`;
      }
      gameboard.removeEventListener("click", _clickBoardCell);

      let boardCells = document.querySelectorAll(".board-cell");
      boardCells.forEach((cell) => {
        cell.removeEventListener("mouseenter", _fillPlaceholder);
        cell.removeEventListener("mouseleave", _clearPlaceholder);
      });
    } else {
      if (gameData.currentPlayer.isAI) {
        gameInfo.textContent = `AI ${gameData.currentPlayer.name} is thinking...`;
        gameboard.removeEventListener("click", _clickBoardCell);
      } else {
        gameInfo.textContent = `It's ${gameData.currentPlayer.name}'s turn.`;
        gameboard.addEventListener("click", _clickBoardCell);
      }
    }
  }

  function _clickBoardCell(e) {
    const row = e.target.dataset.row;
    const col = e.target.dataset.col;

    events.emit("playRound", TurnData(row, col));
  }

  function _startNewGame() {
    let playerXName = playerXNameInput.value || "X";
    let playerOName = playerONameInput.value || "O";

    events.emit(
      "newGame",
      PlayerData(
        playerXName,
        playerXAiInput.checked,
        playerOName,
        playerOAiInput.checked
      )
    );
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

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
