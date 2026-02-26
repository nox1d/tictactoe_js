class Player {
    constructor(letter){
        this.letter = letter;
    }

    getMove(){}
}

class Human extends Player {
    constructor(letter){
        super(letter);
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
    }

    getMove(cellIndex){
        let move = Math.floor(Math.random() * 9);
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
        
        console.log(this.currentPlayerType);

    }

    initializeGame(){
        this.cells.forEach(cell => cell.addEventListener("click", () => this.executeMove(cell)));
        this.restartBtn.addEventListener("click", this.restartGame.bind(this));
        this.options = ["", "", "", "", "", "", "", "", ""];
        this.statusText.textContent = `${this.currentPlayer.constructor.name}'s turn`;
        if (this.currentPlayerType == "Human") {
            this.click_is_valid = true;
        }
        this.running = true;
    }

    updateCell(index){
        this.options[index] = this.currentPlayer.letter;
        this.cells[index].textContent = this.currentPlayer.letter;
    }

    checkWinner(){
        let roundWon = false;
        for(let i = 0; i < this.winConditions.length; i++){
            let condition = this.winConditions[i];
            let cellA = this.options[condition[0]];
            let cellB = this.options[condition[1]];
            let cellC = this.options[condition[2]];

            if(cellA == "" || cellB == "" || cellC == ""){
                continue;
            }

            if(cellA == cellB && cellB == cellC){
                roundWon = true;
                break;
            }
        }

        if(roundWon){
            this.statusText.textContent = `${this.currentPlayer.constructor.name} is the Winner!`;
            this.running = false;
        }
        else if(!this.options.includes("")){
            this.statusText.textContent = `Draw!`;
            this.running = false;
        }
        else {
            this.changePlayer();
        }
    }

    changePlayer(){
        this.currentPlayer = (this.currentPlayer == this.player_1) ? this.player_2 : this.player_1;
        this.currentPlayerType = this.currentPlayer.constructor.name;
        this.statusText.textContent = `${this.currentPlayer.constructor.name}'s turn`;
        console.log(this.currentPlayer);
        console.log(this.currentPlayerType);

        if (this.currentPlayerType == "Human") {
            this.click_is_valid = true;
        }

        if (this.currentPlayerType == "StupidBot") {
            this.click_is_valid = false;
            this.executeMove(null);
        }
        else {
        }
    }

    executeMove(cell){
        console.log(cell);
        let move;
        // console.log(cellIndex);
        
        if (this.currentPlayerType == "Human") {
            let cellIndex = cell.getAttribute("cellIndex");
            move = this.currentPlayer.getMove(cellIndex);
            if(this.options[move] != "" || !this.running){
                return;
            }
        }

        if (this.currentPlayerType == "StupidBot") {
            let move_is_valid = false;
            while (!move_is_valid) {
                move = this.currentPlayer.getMove(null);
                if (this.options[move] == "") {
                    move_is_valid = true;
                    console.log(move);
                }
            }
        }

        console.log("executing move");
        this.updateCell(move);
        console.log("cell updated");
        this.checkWinner();
        console.log("winner checked");

    }

    restartGame(){
        this.options = ["", "", "", "", "", "", "", "", ""];
        this.cells.forEach(cell => cell.textContent = "");
        this.currentPlayer = this.player_1;
        this.statusText.textContent = `${this.currentPlayer.constructor.name}'s turn`;
        this.running = true;
    }
}



const human = new Human("X");
const bot = new StupidBot("O");

const tictactoe = new Game(human, bot);



tictactoe.initializeGame();

