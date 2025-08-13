//game obj stores all the players and board stuff
let gameObj;
function displayForm()
{
    const mainContainer = document.querySelector(".main-container");
    const form = document.createElement("form");
    const inputsContainer = document.createElement("div")
    inputsContainer.setAttribute("id","input-container");
//create the containers for input and lable
    const section1 = document.createElement("div");
    const section2 = document.createElement("div");
    section1.classList.add("section");
    section2.classList.add("section");

//create input elements
    const name1 = document.createElement("input");
    const name2 = document.createElement("input");
    name1.setAttribute("type", "text");
    name2.setAttribute("type", "text");
    name1.setAttribute("placeholder", "player1");
    name2.setAttribute("placeholder", "player2");
    name1.setAttribute("name", "name1");
    name2.setAttribute("name", "name2");
    name1.setAttribute("required", "");
    name2.setAttribute("required", "");

    //create the label element for each input
    const label1 =document.createElement("label");
    const label2 = document.createElement("label");
    label1.setAttribute("for","name1");
    label2.setAttribute("for","name2");
    label1.textContent = "Player Name 1 (X's):";
    label2.textContent = "Player Name 2 (O's):";

//append section children
    section1.appendChild(label1);
    section1.appendChild(name1);
    section2.appendChild(label2);
    section2.appendChild(name2);
//append inputsections to conatiner
    inputsContainer.appendChild(section1);
    inputsContainer.appendChild(section2);
//append to form
    form.appendChild(inputsContainer);
    form.setAttribute("id","name-form")
//create submit button and add to form
    const submitButton = document.createElement("button");
    submitButton.setAttribute("type","submit");
    submitButton.setAttribute("id","start-button");
    submitButton.textContent="Start";

    form.appendChild(submitButton);
//append the form to the main container
   mainContainer.insertBefore(form, mainContainer.children[1]);
   formListeners();
   
}
function displayBoard()
{
    document.querySelector("form").remove();
    const gameWrapper = document.querySelector(".game-wrapper");
    const grid = document.querySelector(".grid-container");
    const turnDisp = document.createElement("p");
    turnDisp.setAttribute("id", "current-turn");
    gameWrapper.insertBefore(turnDisp, gameWrapper.firstChild); 
    
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

    return{playSpace, isEmpty,incrementPlayCount,getPlayCount,getSpace,winningLines,};
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
            endGame(player,1);
            return true;
        }
        else if(gameObj.board.getPlayCount()==9)
        {
            console.log("in tie check" + gameObj.board.getPlayCount());
            endGame(player,0)
        }

    }
}
function endGame(player,isWinner)
{
    const dialog = document.querySelector("#myModal");
    const dialogText =  document.querySelector("#winner-info");
    const cells = document.querySelectorAll(".grid-cell");
    const turnDisp = document.querySelector("#current-turn");
    cells.forEach(cell => {
        cell.remove();
    });
    turnDisp.remove();
    if(isWinner)
    {
        dialogText.textContent = `Winner is ${player.name}!!`
    }
    else
    {
        dialogText.textContent = `Cats Game(Tie)!!`
    }
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
    addGridListeners();
}
function addGridListeners()
{
    const grid =  document.querySelector(".grid-container");
    grid.addEventListener("click",function(e)
    {
        
        const currentCell = e.target;
        const x = parseInt(currentCell.dataset.x);
        const y =parseInt(currentCell.dataset.y);
        const index = (x*3 +y);
        if(gameObj.board.isEmpty(index))
        {
            gameObj.board.incrementPlayCount();
            gameObj.board.playSpace(index,gameObj.players[gameObj.getCurrentPlayerIndex()]);
            displayCell(currentCell);
            if(checkForWin())
            {
                return;
            }
            else
            {
                gameObj.nextTurn();
                updateTurnDisplay(gameObj.players[gameObj.getCurrentPlayerIndex()]);
                
            }
        }
    })
}
const closeModalBtn = document.querySelector("#closeModal-btn")
closeModalBtn.addEventListener("click",function()
{
    const dialog = document.querySelector("#myModal");
    dialog.close();
    displayForm();
})
function formListeners(){
    const form = document.querySelector("#name-form");
    form.addEventListener("submit",function(e)
    {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name1 = formData.get("name1");
        const name2 = formData.get("name2");
        startGame(name1,name2);
    })
}
formListeners();

