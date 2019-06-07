var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var grid = 16;
var count = 0;
var snakeScore = 0;
var running = false;

var snake = {
  x: 160,
  y: 160,

  // snake velocity. moves one grid length every frame in either the x or y direction
  dx: grid,
  dy: 0,

  // keep track of all grids the snake body occupies
  cells: [],

  // length of the snake. grows when eating a red block
  maxCells: 4
};

var apple = {
  x: 320,
  y: 320
};

var snakeScore = {
  count: 0,
  text: "SCORE: "
};

// get random whole numbers in a specific range
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function menu() {
  anyKey();
  listen();
}

// game loop
function loop() {
  // slow game loop to 15 fps instead of 60 (60/15 = 4)
  if (++count < 4) {
    return;
  }
  count = 0;
  context.clearRect(0,0,canvas.width,canvas.height);
  // move snake by it's velocity
  snake.x += snake.dx;
  snake.y += snake.dy;
  // wrap snake position horizontally on edge of screen
  if (snake.x < 0) {
    snake.x = canvas.width - grid;
  }
  else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  // wrap snake position vertically on edge of screen
  if (snake.y < 0) {
    snake.y = canvas.height - grid;
  }
  else if (snake.y >= canvas.height) {
    snake.y = 0;
  }
  // keep track of where snake has been. front of the array is always the head
  snake.cells.unshift({x: snake.x, y: snake.y});
  // remove cells as we move away from them
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }
  // draw red block
  context.fillStyle = 'red';
  context.fillRect(apple.x, apple.y, grid-1, grid-1);
  // draw snake one cell at a time
  context.fillStyle = 'green';
  snake.cells.forEach(function(cell, index)
  {
    // drawing 1 px smaller than the grid creates a grid effect in the snake body so you can see how long it is
    context.fillRect(cell.x, cell.y, grid-1, grid-1);
    // snake ate red block
    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;
      snakeScore.count++;

      updateScoreSnake();

      // canvas is 400x400 which is 25x25 grids
      apple.x = getRandomInt(0, 25) * grid;
      apple.y = getRandomInt(0, 25) * grid;
    }
    // check collision with all cells after this one (modified bubble sort)
    for (var i = index + 1; i < snake.cells.length; i++) {

      // snake occupies same space as a body part. reset game
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
        snakeScore.count = 0;
        updateScoreSnake();
      }
    }
  });
}

function anyKey()
{
  context.font = '20px Courier New';
  context.fillStyle = 'white';
  context.fillText('Press any key to begin',
  canvas.width / 2 - 120,
  canvas.height / 2);
}

function updateScoreSnake() {
  document.getElementById('snakeScore').innerText = snakeScore.text + snakeScore.count;
}

function listen() {
  // listen to keyboard events to move the snake
document.addEventListener('keydown', function(key) {
  // prevent snake from backtracking on itself by checking that it's
  // not already moving on the same axis (pressing left while moving
  // left won't do anything, and pressing right while moving left
  // shouldn't let you collide with your own body)

  // Handle the 'Press any key to begin' function and start the game.
  if (running === false) {
    running = true;
    window.requestAnimationFrame(loop);
  }

  // left arrow key
  if (key.which === 37 && snake.dx === 0) {
    key.preventDefault();
    snake.dx = -grid;
    snake.dy = 0;
  }
  // up arrow key
  else if (key.which === 38 && snake.dy === 0) {
    key.preventDefault();
    snake.dy = -grid;
    snake.dx = 0;
  }
  // right arrow key
  else if (key.which === 39 && snake.dx === 0) {
    key.preventDefault();
    snake.dx = grid;
    snake.dy = 0;
  }
  // down arrow key
  else if (key.which === 40 && snake.dy === 0) {
    key.preventDefault();
    snake.dy = grid;
    snake.dx = 0;
  }
});
}

// start the game
updateScoreSnake();
loop();
