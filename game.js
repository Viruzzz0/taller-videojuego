const canvas = document.querySelector("#game");
const btnUp = document.querySelector("#up");
const btnDown = document.querySelector("#down");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");

const game = canvas.getContext("2d");

let canvasSize;
let elementSize;
const playerPosition = {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};
const tnt = []

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

function startGame() {
  game.font = elementSize + "px Verdana";
  game.textAlign = "end";

  const mapRowsCols = maps[0];

  mapRowsCols.forEach((row, iRow) => {
    const lol = row.split("");
    lol.forEach((col, icol) => {
      const emoji = emojis[col];
      const posX = elementSize * (icol + 1);
      const posY = elementSize * (iRow + 1);

      game.fillText(emoji, posX, posY);
      
      if(col == 'X'){
        tnt.push([posX, posY])
      }

      if (col == "O" && playerPosition.y == undefined) {
        playerPosition.x = posX;
        playerPosition.y = posY;
        console.log(playerPosition);
      } else if (col == "I") {
        giftPosition.x = posX;
        giftPosition.y = posY;
      }
    });
  });
  movePlayer();
}

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementSize = canvasSize / 10;
  startGame();
}

function movePlayer() {
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;

  const tntCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const tntCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const tntCollision = giftCollisionX && giftCollisionY;

  if (giftCollision) {
    console.log('Colicion con regalito');
  } 
  if ()
  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

window.addEventListener("keydown", moveByKeys);
btnUp.addEventListener("click", moveUp);
btnDown.addEventListener("click", moveDown);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);

function moveByKeys(event) {
  if (event.key === "ArrowUp") moveUp();
  else if (event.key === "ArrowDown") moveDown();
  else if (event.key === "ArrowLeft") moveLeft();
  else if (event.key === "ArrowRight") moveRight();
}

function moveUp() {
  if (playerPosition.y > elementSize + 1) {
    playerPosition.y -= elementSize;
    setCanvasSize();
    console.log("move to up", playerPosition);
  }
}
function moveDown() {
  if (playerPosition.y < canvasSize - 1) {
    playerPosition.y += elementSize;
    setCanvasSize();
    console.log("move to down", playerPosition);
  }
}
function moveLeft() {
  if (playerPosition.x > elementSize + 1) {
    playerPosition.x -= elementSize;
    setCanvasSize();
    console.log("move to left", playerPosition);
  }
}
function moveRight() {
  if (playerPosition.x < canvasSize - 1) {
    playerPosition.x += elementSize;
    setCanvasSize();
    console.log("move to right", playerPosition);
  }
}
