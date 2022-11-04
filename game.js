const canvas = document.querySelector("#game");
const btnUp = document.querySelector("#up");
const btnDown = document.querySelector("#down");
const btnLeft = document.querySelector("#left");
const btnRight = document.querySelector("#right");
const spanLives = document.querySelector("#lives");
const spanTime = document.querySelector("#time");
const spanRecord = document.querySelector("#record");
const recordText = document.querySelector("#recordText");
const msgGameWin = document.querySelector(".msgGameWin");
const btnReset = document.querySelector("#btnReset");
const msgWinRecord = document.querySelector("#msgWinRecord");

const game = canvas.getContext("2d");

window.addEventListener("load", setCanvasSize);
window.addEventListener("resize", setCanvasSize);

let canvasSize;
let elementSize;
let lives = 4;
let level = 0;
let bol = true;

let timeStart;
let timeInterval;
let record = localStorage.getItem("record");

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

  elementSize = (canvasSize / 10);
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
  // Ejecuta al inicio del juego
  if (!timeStart) {
    timeStart = Date.now();
    timeInterval = setInterval(showTime, 100);
    showRecord(record);
  }
  showLives();

  game.clearRect(0, 0, canvasSize, canvasSize);

  mapRowsCols.forEach((row, iRow) => {
    const lol = row.split("");
    lol.forEach((col, icol) => {
      const emoji = emojis[col];
      let posX = elementSize * (icol + 1);
      let posY = elementSize * (iRow + 1);
      // posX += 1;

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
  lives--;
  console.log("BOOOMMM");
  console.log("vidas: " + lives);
  if (lives <= 0) {
    console.log("SOS MALISIMO, PERDISTE");
    window.alert("SOS MALISIMO, PERDISTE");
    level = 0;
    lives = 4;
    bol = true;
    bombPosition = [];
    timeStart = undefined;
  }
  playerPosition = {
    x: undefined,
    y: undefined,
  };
  startGame();
}

function gameWin() {
  msgGameWin.classList.toggle("inactive");
  console.log("GANASTE ALGO EN TU VIDA");
  clearInterval(timeInterval);

  const time = Date.now() - timeStart;
  let newRecord = localStorage.getItem("record");
  if (newRecord > time || !newRecord) {
    console.log("Nuevo record");

    localStorage.setItem("record", time);
    newRecord = localStorage.getItem("record");
    msgWinRecord.innerHTML = `Este es tu nuevo record: ${formatTime(newRecord)}`;
  } else {
    msgWinRecord.innerHTML = `Aun no supera el record: ${formatTime(newRecord)}`; 
  }
  // showRecord(newRecord);
}

function showLives() {
  const heartArray = Array(lives).fill(emojis["HEART"]);
  spanLives.innerHTML = heartArray.join("");
}

function showTime() {
  const time = Date.now() - timeStart;
  spanTime.innerHTML = formatTime(time);
}

function showRecord(time) {
  spanRecord.innerHTML = formatTime(time);
}

function formatTime(timeMs) {
  const ms = timeMs;
  const seg = parseInt(ms / 1000) % 60;
  const min = parseInt(ms / 60000) % 60;
  const hr = parseInt(ms / 3600000) % 24;
  const segStr = `0${seg}`.slice(-2);
  const minStr = `0${min}`.slice(-2);
  const hrStr = `0${hr}`.slice(-2);
  const time = `${hrStr}:${minStr}:${segStr}`;
  return time;
  // spanTime.innerHTML = `0${hr}:0${min}:0${seg}`;
}

window.addEventListener("keydown", moveByKeys);
btnUp.addEventListener("click", moveUp);
btnDown.addEventListener("click", moveDown);
btnLeft.addEventListener("click", moveLeft);
btnRight.addEventListener("click", moveRight);
recordText.addEventListener("click", resetSave);
btnReset.addEventListener("click", resetGame);

function resetGame() {
  msgGameWin.classList.toggle("inactive");
  level = 0;
  lives = 4;
  bol = true;
  bombPosition = [];
  timeStart = undefined;
  record = localStorage.getItem("record");
  playerPosition = {
    x: undefined,
    y: undefined,
  };
  startGame();
}

function resetSave() {
  let result = window.confirm("deseas reiniciar el record?");
  if (result) {
    console.log("reset cuidado");
    localStorage.removeItem("record");
    record = localStorage.getItem("record");
    showRecord(record);
  }
}

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