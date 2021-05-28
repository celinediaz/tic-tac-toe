const boardcontainer = document.querySelector('.board');
const winnermessage = document.querySelector('.winner');
const startmessage = document.querySelector('.start');
const winner = document.querySelector('.won');
let Player = (mark, name, id) => {
    return {
        mark,
        name,
        id
    }
}
let player1 = Player("x", "You", true);
let player2;

const eventListeners = (() => {
    document.getElementById("submit").addEventListener("click", function (e) {
        e.preventDefault();
        const p1 = document.getElementById("p1").value;
        const p2 = document.getElementById("p2").value;
        player1 = Player("x", p1, true);
        player2 = Player("o", p2, false);
        startmessage.classList.add('none');
        startmessage.classList.remove('flex');
    });
    document.getElementById("AI").addEventListener("click", function (e) {
        e.preventDefault();
        const p1 = document.getElementById("p1").value;
        player1 = Player("x", p1, true);
        startmessage.classList.add('none');
        startmessage.classList.remove('flex');
    });
    document.getElementById("reset").addEventListener("click", () => window.location.reload());
})();

const gameboard = (() => {
    const boardcontainer = document.querySelector('.board');
    let board = [...Array(3)].map(x => Array(3).fill(""));
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const item = document.createElement('div');
            item.dataset.row = i;
            item.dataset.column = j;
            item.classList.add('item');
            item.addEventListener("click", function () {
                gameFunctionality.placeMark(+this.dataset.row, +this.dataset.column);
            });
            boardcontainer.appendChild(item);
        }
    }

    return {
        board
    };
})();

const gameFunctionality = (() => {
    let turn = 0;
    currentPlayer = player1;
    let board = gameboard.board;
    const togglePlayer = () => {
        currentPlayer = currentPlayer.id ? player2 : player1;
    }

    const placeMark = (row, col) => {
        if (board[row][col] === "") {
            board[row][col] = currentPlayer.mark;
            const item = document.querySelector(`[data-row='${row}'][data-column='${col}']`);
            if (currentPlayer.mark === "o") {
                const circle = document.createElement('div');
                circle.classList.add('circle');
                item.appendChild(circle);
            } else {
                const times = document.createElement('i');
                times.classList.add('fas', 'fa-times', 'fa-8x')
                item.appendChild(times);
            }
            checkWinner(row, col, currentPlayer);
            if (player2 !== undefined) {
                togglePlayer();
            } else {
                botPlacesMark();
            }
            turn++;
        }
    }
    const botPlacesMark = () => {
        let availableCoords = [];
        const bot = Player("o", "Bot", false);
        board.forEach((row, rowNum) => row.forEach((mark, colNum) => {
            if (mark === "") { availableCoords.push({ rowNum, colNum }) }
        }));
        let randomCoord = Math.floor(Math.random() * availableCoords.length);
        let row = availableCoords[randomCoord].rowNum;
        let col = availableCoords[randomCoord].colNum;
        board[row][col] = "o";
        const item = document.querySelector(`[data-row='${row}'][data-column='${col}']`);
        const circle = document.createElement('div');
        circle.classList.add('circle');
        setTimeout(function () {
            item.appendChild(circle);
            checkWinner(row, col, bot);
            turn++;
        }, 200);
    }
    const checkWinner = (row, col, currentPlayer) => {
        if (turn >= 4 && (checkHorizontal(row, col, currentPlayer) || checkVertical(row, col, currentPlayer) || checkDiag1(row, col, currentPlayer) || checkDiag2(row, col, currentPlayer))) {
            winnermessage.classList.add('flex');
            winner.textContent = `${currentPlayer.name} won`;
        } else if (turn === 8) {
            winnermessage.classList.add('flex');
            winner.textContent = `Nobody won lol`;
        }
    }
    const checkHorizontal = (row, col, currentPlayer) => {
        let rep = 1;
        for (let i = col; i < 2 && board[row][i + 1] === currentPlayer.mark; i++, ++rep);
        for (let i = col; i >= 1 && board[row][i - 1] === currentPlayer.mark; i--, ++rep);
        return rep >= 3;
    }
    const checkVertical = (row, col, currentPlayer) => {
        let rep = 1;
        for (let i = row; i < 2 && board[i + 1][col] === currentPlayer.mark; i++, ++rep);
        for (let i = row; i >= 1 && board[i - 1][col] === currentPlayer.mark; i--, ++rep);
        return rep >= 3;
    }
    const checkDiag1 = (row, col, currentPlayer) => {
        let rep = 1;
        for (let i = row, j = col; i < 2 && j < 2 && board[i + 1][j + 1] === currentPlayer.mark; i++, j++, rep++);
        for (let i = row, j = col; i >= 1 && j >= 1 && board[i - 1][j - 1] === currentPlayer.mark; i--, j--, rep++);
        return rep >= 3;
    }
    const checkDiag2 = (row, col, currentPlayer) => {
        let rep = 1;
        for (let i = row, j = col; i >= 1 && j < 2 && board[i - 1][j + 1] === currentPlayer.mark; i--, j++, rep++);
        for (let i = row, j = col; i < 2 && j >= 1 && board[i + 1][j - 1] === currentPlayer.mark; i++, j--, rep++);
        return rep >= 3;
    }
    return {
        placeMark
    };
})();

