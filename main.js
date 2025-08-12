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
    const span = document.querySelector("#current-player");
    span.textContent = `${player.name}, marker: ${player.maker}`
}
//create a player
function createPlayer(name,marker){
    return {name, marker};
}
///create the board
function createBoard()
{
    displayBoard();
    const gameBoard = [[0,0,0],[0,0,0],[0,0,0]];
    playSpace = function (x,y,player)
    {
        if(gameBoard[x][y] == 0)
        {
            gameBoard[x][y] = player.marker;
        }
    }
    isEmpty = function (x,y)
    {
        if(gameBoard[x][y] == 0)
        {
            return true;
        }
        else{
            return false;
        }
    }
    return{playSpace, isEmpty};
}
function initiateAllObjects(name1,name2){
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

  return { players, board, nextTurn, getCurrentPlayerIndex };
}

//start the game
function startGame(name1,name2)
{
    gameObj = initiateAllObjects(name1,name2);
}
const grid =  document.querySelector(".grid-container");
grid.addEventListener("click",function(e)
{
    
    const currentCell = e.target;
    const x = currentCell.dataset.x;
    const y =currentCell.dataset.y;
    if(gameObj.board.isEmpty(x,y))
    {
        gameObj.board.playSpace(x,y,gameObj.players[gameObj.getCurrentPlayerIndex()]);
        displayCell(currentCell);
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
