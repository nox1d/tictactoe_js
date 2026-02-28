class Player {
    constructor(letter){
        this.letter = letter;
    }

    getMove(){}
}

class Human extends Player {
    constructor(letter){
        super(letter);

        this.is_bot = false;
    }

    getMove(cellIndex){
        const move = cellIndex;
        console.log(move);

        return move
        }
}

class StupidBot extends Player {
    constructor(letter){
        super(letter);

        this.is_bot = true;
    }

    getMove(cells){
        let move = Math.floor(Math.random() * 9);
        return move;
    }
}

class SmartBot extends Player {
    constructor(letter){
        super(letter);

        this.is_bot = true;
        this.enemyLetter = (this.letter == "X") ? "O" : "X";

        this.scores;

        if (this.letter == "X") {
            this.scores = {
                X: 1,
                O: -1,
                tie: 0,
            };
        } else {
            this.scores = {
                X: -1,
                O: 1,
                tie: 0,
            }
        }
        
        this.winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
    }

    checkWinner(board){
        let roundWon = false;
        let currentLetter;
        for(let i = 0; i < this.winConditions.length; i++){
            let condition = this.winConditions[i];
            let cellA = board[condition[0]];
            let cellB = board[condition[1]];
            let cellC = board[condition[2]];

            if(cellA == "" || cellB == "" || cellC == ""){
                continue;
            }

            if(cellA == cellB && cellB == cellC){
                roundWon = true;
                currentLetter = cellA;
                break;
            }
        }

        if(roundWon){
            return currentLetter;
        }
        else if(!board.includes("")){
            return "tie";
        }
        else {
            return null;
        }
    }

    minimax(board, depth, isMaximizing){
        let result = this.checkWinner(board);

        if (result != null) {
            let score = this.scores[result];
            return score;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i=0; i < 9; i++) {
                if (board[i] == "") {
                    board[i] = this.letter;

                    let score = this.minimax(board, depth + 1, false);
                    board[i] = "";

                    bestScore = Math.max(score, bestScore);
                }
            } return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i=0; i < 9; i++) {
                if (board[i] == "") {
                    board[i] = this.enemyLetter;

                    let score = this.minimax(board, depth + 1, true);
                    board[i] = "";

                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    getMove(board){
        let bestScore = -Infinity;
        let move;

        if (new Set(board).size == 1) {
            let move = Math.floor(Math.random() * 9);
            return move;
        }

        for (let i=0; i < 9; i++) {
            if (board[i] == "") {
                board[i] = this.letter;

                let score = this.minimax(board, 0, false);
                board[i] = "";

                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }

            }
        }

        return move;
    }
}

class Game {
    constructor(player_1, player_2) {
        this.player_1 = player_1;
        this.player_2 = player_2;
        this.cells = document.querySelectorAll(".cell");
        this.statusText = document.querySelector("#statusText");
        this.restartBtn = document.querySelector("#restartBtn");
        
        this.winConditions = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];
        this.options = ["", "", "", "", "", "", "", "", ""];
        
        this.currentPlayer = player_1;
        this.currentPlayerType = this.currentPlayer.constructor.name;
        this.click_is_valid = false;
        this.running = false;

    }

    initializeGame(){
        this.cells.forEach(cell => cell.addEventListener("click", () => this.executeMove(cell)));
        this.restartBtn.addEventListener("click", this.restartGame.bind(this));
        this.options = ["", "", "", "", "", "", "", "", ""];
        this.statusText.textContent = `${this.currentPlayer.letter}'s turn`;
        this.running = true;
        if (!this.currentPlayer.is_bot) {
            this.click_is_valid = true;
        } else {
            this.click_is_valid = false;
            this.executeMove(null);
        }
    }

    updateCell(index){
        this.options[index] = this.currentPlayer.letter;
        this.cells[index].textContent = this.currentPlayer.letter;
    }

    checkWinner(board){
        let roundWon = false;
        let currentLetter;
        for(let i = 0; i < this.winConditions.length; i++){
            let condition = this.winConditions[i];
            let cellA = board[condition[0]];
            let cellB = board[condition[1]];
            let cellC = board[condition[2]];

            if(cellA == "" || cellB == "" || cellC == ""){
                continue;
            }

            if(cellA == cellB && cellB == cellC){
                roundWon = true;
                currentLetter = cellA;
                break;
            }
        }

        if(roundWon){
            return currentLetter;
        }
        else if(!board.includes("")){
            return "tie";
        }
        else {
            return null;
        }
    }

    changePlayer(){
        this.currentPlayer = (this.currentPlayer == this.player_1) ? this.player_2 : this.player_1;
        this.currentPlayerType = this.currentPlayer.constructor.name;

        if (!this.currentPlayer.is_bot) {
            this.click_is_valid = true;
        } else {
            this.click_is_valid = false;
        }
    }

    stopGame(){
        this.running = false;
    }

    executeMove(cell){
        if (!this.running) return;
        console.log(cell);
        let move;
        // console.log(cellIndex);
        
        if (!this.currentPlayer.is_bot) {
            if (!cell) return;

            let cellIndex = cell.getAttribute("cellIndex");
            move = this.currentPlayer.getMove(cellIndex);

            if(this.options[move] != ""){
                return;
            }
        } else {
            let move_is_valid = false;
            while (!move_is_valid) {
                move = this.currentPlayer.getMove(this.options);
                if (this.options[move] == "") {
                    move_is_valid = true;
                }
            }
        }

        console.log("executing move");
        this.updateCell(move);
        console.log("cell updated");
        let result = this.checkWinner(this.options);

        if (result == "tie") {
            this.statusText.textContent = "It's a tie!";
            this.stopGame();
        } else if (result != null) {
            this.statusText.textContent = `${result} is the winner!`;
            this.stopGame();
        } else {
            this.changePlayer();
            console.log(`${this.currentPlayer.letter}'s turn`);
            this.statusText.textContent = `${this.currentPlayer.letter}'s turn`;

            if (this.currentPlayer.is_bot) {

                setTimeout(() => this.executeMove(null), 500);
            }
        }

        

    }

    restartGame(){
        this.options = ["", "", "", "", "", "", "", "", ""];
        this.cells.forEach(cell => cell.textContent = "");
        this.currentPlayer = this.player_1;
        this.statusText.textContent = `${this.currentPlayer.letter}'s turn`;
        this.running = true;
        if (!this.currentPlayer.is_bot) {
            this.click_is_valid = true;
        } else {
            this.click_is_valid = false;
            this.executeMove(null);
        }
    }
}



const human = new SmartBot("X");
const bot = new SmartBot("O");

const tictactoe = new Game(human, bot);



tictactoe.initializeGame();

