const canvas = document.querySelector("#game");
const btnUp = document.querySelector("#up");
const btnDown = document.querySelector("#down");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");

const game = canvas.getContext("2d");

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

let canvasSize;
let elementSize;
let live = 4;
let level = 0;
let bol = true;
let playerPosition = {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};
let bombPosition = [];

function setCanvasSize() {
  if (window.innerHeight > window.innerWidth) {
    canvasSize = window.innerWidth * 0.7;
  } else {
    canvasSize = window.innerHeight * 0.7;
  }

  canvas.setAttribute("width", canvasSize);
  canvas.setAttribute("height", canvasSize);

  elementSize = (canvasSize / 10) -1 ;
  startGame();
}

function startGame() {
  game.font = elementSize + "px Verdana";
  game.textAlign = "end";

  const mapRowsCols = maps[level];
  if (!mapRowsCols) {
    gameWin();
    return;
  }
  
  game.clearRect(0, 0, canvasSize, canvasSize);

  mapRowsCols.forEach((row, iRow) => {
    const lol = row.split("");
    lol.forEach((col, icol) => {
      const emoji = emojis[col];
      let posX = elementSize * (icol + 1);
      let posY = elementSize * (iRow + 1);
      posX += 16;

      game.fillText(emoji, posX, posY);
      
      if (col == "O" && playerPosition.y == undefined) {
        playerPosition.x = posX;
        playerPosition.y = posY;
      } else if (col == "I") {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == "X" && bol) {
        bombPosition.push({
          x: posX,
          y: posY,
        });
      }
    });
  });
  movePlayer();
  bol = false;
}

function movePlayer() {
  const giftCollisionX =
    playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY =
    playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;

  const bombCollision = bombPosition.some((bomb) => {
    const compa = bomb.x.toFixed(3) == playerPosition.x.toFixed(3);
    const compa2 = bomb.y.toFixed(3) == playerPosition.y.toFixed(3);

    return compa && compa2;
  });

  if (bombCollision) levelFail();

  if (giftCollision) levelWin();

  game.fillText(emojis["PLAYER"], playerPosition.x, playerPosition.y);
}

function levelWin() {
  console.log("GANASTE PEDAZO DE TROLO");
  level++;
  bol = true;
  bombPosition = [];
  startGame();
}

function levelFail() {
  live--;
  console.log("BOOOMMM");
  console.log("vidas: " + live);
  if (live <= 0) {
    console.log("SOS MALISIMO, PERDISTE");
    window.alert("SOS MALISIMO, PERDISTE");
    level = 0;
    live = 4;
    bol = true;
    bombPosition = [];
  }
  playerPosition = {
    x: undefined,
    y: undefined,
  };
  startGame();
}

function gameWin() {
  console.log("GANASTE ALGO EN TU VIDA");
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
    startGame();
    console.log("move to up", playerPosition);
  }
}
function moveDown() {
  if (playerPosition.y < canvasSize - 1) {
    playerPosition.y += elementSize;
    startGame();
    console.log("move to down", playerPosition);
  }
}
function moveLeft() {
  if (playerPosition.x > elementSize + 1) {
    playerPosition.x -= elementSize;
    startGame();
    console.log("move to left", playerPosition);
  }
}
function moveRight() {
  if (playerPosition.x < canvasSize - 1) {
    playerPosition.x += elementSize;
    startGame();
    console.log("move to right", playerPosition);
  }
}
