//game obj stores all the players and board stuff
let gameObj;
function displayBoard()
{
    document.querySelector("form").remove();
    for(let i =0; i<3;i++)
    {
        for(let k =0; k<3;k++)
        {
            const cell = document.createElement("div")
            cell.classList.add("grid-cell")
            cell.dataset.x=i;
            cell.dataset.y=k;
            grid.appendChild(cell);
        }
    }
}
function displayCell(currentCell){
    if(gameObj.getCurrentPlayerIndex())
    {
        //display an x
        currentCell.textContent = "O"
    }
    else
    {
        currentCell.textContent = "X"
    }
}
function updateTurnDisplay(player)
{
    const span = document.querySelector("#current-turn");
    span.textContent = `Current Turn: ${player.name}, Marker: ${player.marker}`
}
//create a player
function createPlayer(name,marker){
    return {name, marker};
}
///create the board
function createBoard()
{
    displayBoard();
    const gameBoard = [0,0,0,0,0,0,0,0,0];
    let playCount =0;
    const winningLines = [[0,1,2],[3,4,5],[6,7,8],//winnning rows
                        [0,3,6],[1,4,7],[2,5,8], // winning cols
                        [0,4,8],[2,4,6]]; //winning diagnoals
    const playSpace = function (index,player)
    {
        if(gameBoard[index] == 0)
        {
            gameBoard[index] = player.marker;
        }
    }
   const isEmpty = function (index)
    {
        if(gameBoard[index] == 0)
        {
            return true;
        }
        else{
            return false;
        }
    }
    const incrementPlayCount = function(){
        playCount++;
    } 
    const getPlayCount = function(){
        return playCount;
    }
    const getSpace = function(index){
        return gameBoard[index];
    }

    return{playSpace, isEmpty,incrementPlayCount,getPlayCount,getSpace,winningLines};
}
function checkForWin()
{
    
    const player = gameObj.players[gameObj.getCurrentPlayerIndex()];
    console.log("in check for winner!" + player.marker)
    for(let i = 0; i < 8;i++)
    {
        let a = gameObj.board.winningLines[i][0];
        let b = gameObj.board.winningLines[i][1];
        let c = gameObj.board.winningLines[i][2];
        if(gameObj.board.getSpace(a) == player.marker && gameObj.board.getSpace(b) == player.marker && gameObj.board.getSpace(c) == player.marker)
        {
            console.log("winner!")
            endGame(player);
        }
    }
}
function endGame(player)
{
    const dialog = document.querySelector("#myModal");
    const cells = document.querySelectorAll(".grid-cell");
    cells.forEach(cell => {
        cell.remove();
    });
    dialog.textContent = `Winner is ${player.name}!!`
    dialog.showModal();
}
function initiateAllObjects(name1,name2)
{
    const board = createBoard();
    const player1 = createPlayer(name1,"X");
    const player2 = createPlayer(name2,"O");
    const players = [player1,player2];
    let currentPlayerIndex = 0;
    const nextTurn = function () 
    {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    };

    const getCurrentPlayerIndex = function () 
    {
        return currentPlayerIndex;
    };
  return { players, board, nextTurn, getCurrentPlayerIndex, checkForWin, checkForWin};
}

//start the game
function startGame(name1,name2)
{
    gameObj = initiateAllObjects(name1,name2);
    updateTurnDisplay(gameObj.players[gameObj.getCurrentPlayerIndex()]);
}
const grid =  document.querySelector(".grid-container");
grid.addEventListener("click",function(e)
{
    
    const currentCell = e.target;
    const x = parseInt(currentCell.dataset.x);
    const y =parseInt(currentCell.dataset.y);
    const index = (x*3 +y);
    if(gameObj.board.isEmpty(index))
    {
        gameObj.board.playSpace(index,gameObj.players[gameObj.getCurrentPlayerIndex()]);
        displayCell(currentCell);
        checkForWin();
        gameObj.nextTurn();
        updateTurnDisplay(gameObj.players[gameObj.getCurrentPlayerIndex()]);
    }
})

const form = document.querySelector("#name-form");
form.addEventListener("submit",function(e){
    e.preventDefault();
    const formData = new FormData(e.target);
    const name1 = formData.get("name1");
    const name2 = formData.get("name2");
    startGame(name1,name2);
})
