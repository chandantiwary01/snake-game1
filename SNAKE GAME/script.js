const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const box = 20;
const rows = canvas.width / box;
const snakeHeadImg = new Image();
snakeHeadImg.src = 'snake-head.png';


let snake = [{ x: 10 * box, y: 10 * box }];
let direction = 'RIGHT';
let score = 0;
let game = null;
let running = false;

// Food
let food = {
  x: Math.floor(Math.random() * rows) * box,
  y: Math.floor(Math.random() * rows) * box
};

// Hurdles (obstacles)
let hurdles = generateHurdles(5); // generate 5 obstacles

document.addEventListener('keydown', changeDirection);
canvas.addEventListener('dblclick', togglePause);
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('pauseBtn').addEventListener('click', togglePause);

function generateHurdles(count) {
  const obs = [];
  for (let i = 0; i < count; i++) {
    obs.push({
      x: Math.floor(Math.random() * rows) * box,
      y: Math.floor(Math.random() * rows) * box
    });
  }
  return obs;
}

function changeDirection(e) {
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT';
  else if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP';
  else if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT';
  else if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN';
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw snake with gradient
  for (let i = 0; i < snake.length; i++) {
    const gradient = ctx.createLinearGradient(snake[i].x, snake[i].y, snake[i].x + box, snake[i].y + box);
    gradient.addColorStop(0, '#0f0');
    gradient.addColorStop(1, '#060');
    ctx.fillStyle = gradient;
    ctx.fillRect(snake[i].x, snake[i].y, box, box);
  }

  // Draw food
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, box, box);

  // Draw hurdles
  ctx.fillStyle = '#555';
  hurdles.forEach(h => ctx.fillRect(h.x, h.y, box, box));

  let headX = snake[0].x;
  let headY = snake[0].y;

  if (direction === 'LEFT') headX -= box;
  if (direction === 'RIGHT') headX += box;
  if (direction === 'UP') headY -= box;
  if (direction === 'DOWN') headY += box;

  // Check collision
  if (
    headX < 0 || headY < 0 ||
    headX >= canvas.width || headY >= canvas.height ||
    isCollision(headX, headY) ||
    isHittingHurdle(headX, headY)
  ) {
    clearInterval(game);
    alert('Game Over! Score: ' + score);
    location.reload();
  }

  let newHead = { x: headX, y: headY };

  // Eat food
  if (headX === food.x && headY === food.y) {
    score++;
    document.getElementById('score').innerText = 'Score: ' + score;
    food = {
      x: Math.floor(Math.random() * rows) * box,
      y: Math.floor(Math.random() * rows) * box
    };
  } else {
    snake.pop();
  }

  snake.unshift(newHead);
}

function isCollision(x, y) {
  return snake.some(segment => segment.x === x && segment.y === y);
}

function isHittingHurdle(x, y) {
  return hurdles.some(h => h.x === x && h.y === y);
}

function startGame() {
  if (!running) {
    game = setInterval(draw, 100);
    running = true;
  }
}

function togglePause() {
  if (running) {
    clearInterval(game);
    running = false;
  } else {
    startGame();
  }
}
