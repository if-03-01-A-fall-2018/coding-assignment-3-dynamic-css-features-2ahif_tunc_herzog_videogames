
/*// Global Variables
var DIRECTION = {
  IDLE: 0,
  UP: 1,
  DOWN: 2,
  LEFT: 3,
  RIGHT: 4
};

var rounds = [5, 5, 3, 3, 2];
var colors = ['#1abc9c', '#2ecc71', '#3498db', '#e74c3c', '#9b59b6'];

// The ball object (The cube that bounces back and forth)
var Ball = {
  new: function (incrementedSpeed) {
    return {
      width: 18,
      height: 18,
      x: (this.canvas.width / 2) - 9,
      y: (this.canvas.height / 2) - 9,
      moveX: DIRECTION.IDLE,
      moveY: DIRECTION.IDLE,
      speed: incrementedSpeed || 9
    };
  }
};

// The paddle object (The two lines that move up and down)
var Paddle = {
  new: function (side) {
    return {
      width: 18,
      height: 70,
      x: side === 'left' ? 150 : this.canvas.width - 150,
      y: (this.canvas.height / 2) - 35,
      score: 0,
      move: DIRECTION.IDLE,
      speed: 10
    };
  }
};

var Game = {
  initialize: function () {
    this.canvas = document.querySelector('canvas');
    this.context = this.canvas.getContext('2d');

    this.canvas.width = 1400;
    this.canvas.height = 1000;

    this.canvas.style.width = (this.canvas.width / 2) + 'px';
    this.canvas.style.height = (this.canvas.height / 2) + 'px';

    this.player = Paddle.new.call(this, 'left');
    this.paddle = Paddle.new.call(this, 'right');
    this.ball = Ball.new.call(this);

    this.paddle.speed = 8;
    this.running = this.over = false;
    this.turn = this.paddle;
    this.timer = this.round = 0;
    this.color = '#2c3e50';

    Pong.menu();
    Pong.listen();
  },

  endGameMenu: function (text) {
    // Change the canvas font size and color
    Pong.context.font = '50px Courier New';
    Pong.context.fillStyle = this.color;

    // Draw the rectangle behind the 'Press any key to begin' text.
    Pong.context.fillRect(
      Pong.canvas.width / 2 - 350,
      Pong.canvas.height / 2 - 48,
      700,
      100
    );

    // Change the canvas color;
    Pong.context.fillStyle = '#ffffff';

    // Draw the end game menu text ('Game Over' and 'Winner')
    Pong.context.fillText(text,
      Pong.canvas.width / 2,
      Pong.canvas.height / 2 + 15
    );

    setTimeout(function () {
      Pong = Object.assign({}, Game);
      Pong.initialize();
    }, 3000);
  },

  menu: function () {
    // Draw all the Pong objects in their current state
    Pong.draw();

    // Change the canvas font size and color
    this.context.font = '50px Courier New';
    this.context.fillStyle = this.color;

    // Draw the rectangle behind the 'Press any key to begin' text.
    this.context.fillRect(
      this.canvas.width / 2 - 350,
      this.canvas.height / 2 - 48,
      700,
      100
    );

    // Change the canvas color;
    this.context.fillStyle = '#ffffff';

    // Draw the 'press any key to begin' text
    this.context.fillText('Press any key to begin',
      this.canvas.width / 2,
      this.canvas.height / 2 + 15
    );
  },

  // Update all objects (move the player, paddle, ball, increment the score, etc.)
  update: function () {
    if (!this.over) {
      // If the ball collides with the bound limits - correct the x and y coords.
      if (this.ball.x <= 0) Pong._resetTurn.call(this, this.paddle, this.player);
      if (this.ball.x >= this.canvas.width - this.ball.width) Pong._resetTurn.call(this, this.player, this.paddle);
      if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
      if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;

      // Move player if they player.move value was updated by a keyboard event
      if (this.player.move === DIRECTION.UP) this.player.y -= this.player.speed;
      else if (this.player.move === DIRECTION.DOWN) this.player.y += this.player.speed;

      // On new serve (start of each turn) move the ball to the correct side
      // and randomize the direction to add some challenge.
      if (Pong._turnDelayIsOver.call(this) && this.turn) {
        this.ball.moveX = this.turn === this.player ? DIRECTION.LEFT : DIRECTION.RIGHT;
        this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
        this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
        this.turn = null;
      }

      // If the player collides with the bound limits, update the x and y coords.
      if (this.player.y <= 0) this.player.y = 0;
      else if (this.player.y >= (this.canvas.height - this.player.height)) this.player.y = (this.canvas.height - this.player.height);

      // Move ball in intended direction based on moveY and moveX values
      if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
      else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
      if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
      else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;

      // Handle paddle (AI) UP and DOWN movement
      if (this.paddle.y > this.ball.y - (this.paddle.height / 2)) {
        if (this.ball.moveX === DIRECTION.RIGHT) this.paddle.y -= this.paddle.speed / 1.5;
        else this.paddle.y -= this.paddle.speed / 4;
      }
      if (this.paddle.y < this.ball.y - (this.paddle.height / 2)) {
        if (this.ball.moveX === DIRECTION.RIGHT) this.paddle.y += this.paddle.speed / 1.5;
        else this.paddle.y += this.paddle.speed / 4;
      }

      // Handle paddle (AI) wall collision
      if (this.paddle.y >= this.canvas.height - this.paddle.height) this.paddle.y = this.canvas.height - this.paddle.height;
      else if (this.paddle.y <= 0) this.paddle.y = 0;

      // Handle Player-Ball collisions
      if (this.ball.x - this.ball.width <= this.player.x && this.ball.x >= this.player.x - this.player.width) {
        if (this.ball.y <= this.player.y + this.player.height && this.ball.y + this.ball.height >= this.player.y) {
          this.ball.x = (this.player.x + this.ball.width);
          this.ball.moveX = DIRECTION.RIGHT;
        }
      }

      // Handle paddle-ball collision
      if (this.ball.x - this.ball.width <= this.paddle.x && this.ball.x >= this.paddle.x - this.paddle.width) {
        if (this.ball.y <= this.paddle.y + this.paddle.height && this.ball.y + this.ball.height >= this.paddle.y) {
          this.ball.x = (this.paddle.x - this.ball.width);
          this.ball.moveX = DIRECTION.LEFT;
        }
      }
    }

    // Handle the end of round transition
    // Check to see if the player won the round.
    if (this.player.score === rounds[this.round]) {
      // Check to see if there are any more rounds/levels left and display the victory screen if
      // there are not.
      if (!rounds[this.round + 1]) {
        this.over = true;
        setTimeout(function () { Pong.endGameMenu('Winner!'); }, 1000);
      } else {
        // If there is another round, reset all the values and increment the round number.
        this.color = this._generateRoundColor();
        this.player.score = this.paddle.score = 0;
        this.player.speed += 0.5;
        this.paddle.speed += 1;
        this.ball.speed += 1;
        this.round += 1;
      }
    }
    // Check to see if the paddle/AI has won the round.
    else if (this.paddle.score === rounds[this.round]) {
      this.over = true;
      setTimeout(function () { Pong.endGameMenu('Game Over!'); }, 1000);
    }
  },

  // Draw the objects to the canvas element
  draw: function () {
    // Clear the Canvas
    this.context.clearRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // Set the fill style to black
    this.context.fillStyle = this.color;

    // Draw the background
    this.context.fillRect(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );

    // Set the fill style to white (For the paddles and the ball)
    this.context.fillStyle = '#ffffff';

    // Draw the Player
    this.context.fillRect(
      this.player.x,
      this.player.y,
      this.player.width,
      this.player.height
    );

    // Draw the Paddle
    this.context.fillRect(
      this.paddle.x,
      this.paddle.y,
      this.paddle.width,
      this.paddle.height
    );

    // Draw the Ball
    if (Pong._turnDelayIsOver.call(this)) {
      this.context.fillRect(
        this.ball.x,
        this.ball.y,
        this.ball.width,
        this.ball.height
      );
    }

    // Draw the net (Line in the middle)
    this.context.beginPath();
    this.context.setLineDash([7, 15]);
    this.context.moveTo((this.canvas.width / 2), this.canvas.height - 140);
    this.context.lineTo((this.canvas.width / 2), 140);
    this.context.lineWidth = 10;
    this.context.strokeStyle = '#ffffff';
    this.context.stroke();

    // Set the default canvas font and align it to the center
    this.context.font = '100px Courier New';
    this.context.textAlign = 'center';

    // Draw the players score (left)
    this.context.fillText(
      this.player.score.toString(),
      (this.canvas.width / 2) - 300,
      200
    );

    // Draw the paddles score (right)
    this.context.fillText(
      this.paddle.score.toString(),
      (this.canvas.width / 2) + 300,
      200
    );

    // Change the font size for the center score text
    this.context.font = '30px Courier New';

    // Draw the winning score (center)
    this.context.fillText(
      'Round ' + (Pong.round + 1),
      (this.canvas.width / 2),
      35
    );

    // Change the font size for the center score value
    this.context.font = '40px Courier';

    // Draw the current round number
    this.context.fillText(
      rounds[Pong.round] ? rounds[Pong.round] : rounds[Pong.round - 1],
      (this.canvas.width / 2),
      100
    );
  },

  loop: function () {
    Pong.update();
    Pong.draw();

    // If the game is not over, draw the next frame.
    if (!Pong.over) requestAnimationFrame(Pong.loop);
  },

  listen: function () {
    document.addEventListener('keydown', function (key) {
      // Handle the 'Press any key to begin' function and start the game.
      if (Pong.running === false) {
        Pong.running = true;
        window.requestAnimationFrame(Pong.loop);
      }

      // Handle up arrow and w key events
      if (key.keyCode === 38 || key.keyCode === 87) Pong.player.move = DIRECTION.UP;

      // Handle down arrow and s key events
      if (key.keyCode === 40 || key.keyCode === 83) Pong.player.move = DIRECTION.DOWN;
    });

    // Stop the player from moving when there are no keys being pressed.
    document.addEventListener('keyup', function (key) { Pong.player.move = DIRECTION.IDLE; });
  },

  // Reset the ball location, the player turns and set a delay before the next round begins.
  _resetTurn: function (victor, loser) {
    this.ball = Ball.new.call(this, this.ball.speed);
    this.turn = loser;
    this.timer = (new Date()).getTime();

    victor.score++;
  },

  // Wait for a delay to have passed after each turn.
  _turnDelayIsOver: function () {
    return ((new Date()).getTime() - this.timer >= 1000);
  },

  // Select a random color as the background of each level/round.
  _generateRoundColor: function () {
    var newColor = colors[Math.floor(Math.random() * colors.length)];
    if (newColor === this.color) return Pong._generateRoundColor();
    return newColor;
  }
};

var Pong = Object.assign({}, Game);
Pong.initialize();*/


Pong = {

  Defaults: {
    width:        640,   // logical canvas width (browser will scale to physical canvas size - which is controlled by @media css queries)
    height:       480,   // logical canvas height (ditto)
    wallWidth:    12,
    paddleWidth:  12,
    paddleHeight: 60,
    paddleSpeed:  2,     // should be able to cross court vertically   in 2 seconds
    ballSpeed:    4,     // should be able to cross court horizontally in 4 seconds, at starting speed ...
    ballAccel:    8,     // ... but accelerate as time passes
    ballRadius:   5,
    sound:        true
  },

  Colors: {
    walls:           'white',
    ball:            'white',
    score:           'white',
    footprint:       '#333',
    predictionGuess: 'yellow',
    predictionExact: 'red'
  },

  Levels: [
    {aiReaction: 0.2, aiError:  40}, // 0:  ai is losing by 8
    {aiReaction: 0.3, aiError:  50}, // 1:  ai is losing by 7
    {aiReaction: 0.4, aiError:  60}, // 2:  ai is losing by 6
    {aiReaction: 0.5, aiError:  70}, // 3:  ai is losing by 5
    {aiReaction: 0.6, aiError:  80}, // 4:  ai is losing by 4
    {aiReaction: 0.7, aiError:  90}, // 5:  ai is losing by 3
    {aiReaction: 0.8, aiError: 100}, // 6:  ai is losing by 2
    {aiReaction: 0.9, aiError: 110}, // 7:  ai is losing by 1
    {aiReaction: 1.0, aiError: 120}, // 8:  tie
    {aiReaction: 1.1, aiError: 130}, // 9:  ai is winning by 1
    {aiReaction: 1.2, aiError: 140}, // 10: ai is winning by 2
    {aiReaction: 1.3, aiError: 150}, // 11: ai is winning by 3
    {aiReaction: 1.4, aiError: 160}, // 12: ai is winning by 4
    {aiReaction: 1.5, aiError: 170}, // 13: ai is winning by 5
    {aiReaction: 1.6, aiError: 180}, // 14: ai is winning by 6
    {aiReaction: 1.7, aiError: 190}, // 15: ai is winning by 7
    {aiReaction: 1.8, aiError: 200}  // 16: ai is winning by 8
  ],

  //-----------------------------------------------------------------------------

  initialize: function(runner, cfg) {
    Game.loadImages(Pong.Images, function(images) {
      this.cfg         = cfg;
      this.runner      = runner;
      this.width       = runner.width;
      this.height      = runner.height;
      this.images      = images;
      this.playing     = false;
      this.scores      = [0, 0];
      this.menu        = Object.construct(Pong.Menu,   this);
      this.court       = Object.construct(Pong.Court,  this);
      this.leftPaddle  = Object.construct(Pong.Paddle, this);
      this.rightPaddle = Object.construct(Pong.Paddle, this, true);
      this.ball        = Object.construct(Pong.Ball,   this);
      this.sounds      = Object.construct(Pong.Sounds, this);
      this.runner.start();
    }.bind(this));
  },

  startDemo:         function() { this.start(0); },
  startSinglePlayer: function() { this.start(1); },
  startDoublePlayer: function() { this.start(2); },

  start: function(numPlayers) {
    if (!this.playing) {
      this.scores = [0, 0];
      this.playing = true;
      this.leftPaddle.setAuto(numPlayers < 1, this.level(0));
      this.rightPaddle.setAuto(numPlayers < 2, this.level(1));
      this.ball.reset();
      this.runner.hideCursor();
    }
  },

  stop: function(ask) {
    if (this.playing) {
      if (!ask || this.runner.confirm('Abandon game in progress ?')) {
        this.playing = false;
        this.leftPaddle.setAuto(false);
        this.rightPaddle.setAuto(false);
        this.runner.showCursor();
      }
    }
  },

  level: function(playerNo) {
    return 8 + (this.scores[playerNo] - this.scores[playerNo ? 0 : 1]);
  },

  goal: function(playerNo) {
    this.sounds.goal();
    this.scores[playerNo] += 1;
    if (this.scores[playerNo] == 9) {
      this.menu.declareWinner(playerNo);
      this.stop();
    }
    else {
      this.ball.reset(playerNo);
      this.leftPaddle.setLevel(this.level(0));
      this.rightPaddle.setLevel(this.level(1));
    }
  },

  update: function(dt) {
    this.leftPaddle.update(dt, this.ball);
    this.rightPaddle.update(dt, this.ball);
    if (this.playing) {
      var dx = this.ball.dx;
      var dy = this.ball.dy;
      this.ball.update(dt, this.leftPaddle, this.rightPaddle);
      if (this.ball.dx < 0 && dx > 0)
        this.sounds.ping();
      else if (this.ball.dx > 0 && dx < 0)
        this.sounds.pong();
      else if (this.ball.dy * dy < 0)
        this.sounds.wall();

      if (this.ball.left > this.width)
        this.goal(0);
      else if (this.ball.right < 0)
        this.goal(1);
    }
  },

  draw: function(ctx) {
    this.court.draw(ctx, this.scores[0], this.scores[1]);
    this.leftPaddle.draw(ctx);
    this.rightPaddle.draw(ctx);
    if (this.playing)
      this.ball.draw(ctx);
    else
      this.menu.draw(ctx);
  },

  onkeydown: function(keyCode) {
    switch(keyCode) {
      case Game.KEY.ZERO: this.startDemo();            break;
      case Game.KEY.ONE:  this.startSinglePlayer();    break;
      case Game.KEY.TWO:  this.startDoublePlayer();    break;
      case Game.KEY.ESC:  this.stop(true);             break;
      case Game.KEY.Q:    if (!this.leftPaddle.auto)  this.leftPaddle.moveUp();    break;
      case Game.KEY.A:    if (!this.leftPaddle.auto)  this.leftPaddle.moveDown();  break;
      case Game.KEY.P:    if (!this.rightPaddle.auto) this.rightPaddle.moveUp();   break;
      case Game.KEY.L:    if (!this.rightPaddle.auto) this.rightPaddle.moveDown(); break;
    }
  },

  onkeyup: function(keyCode) {
    switch(keyCode) {
      case Game.KEY.Q: if (!this.leftPaddle.auto)  this.leftPaddle.stopMovingUp();    break;
      case Game.KEY.A: if (!this.leftPaddle.auto)  this.leftPaddle.stopMovingDown();  break;
      case Game.KEY.P: if (!this.rightPaddle.auto) this.rightPaddle.stopMovingUp();   break;
      case Game.KEY.L: if (!this.rightPaddle.auto) this.rightPaddle.stopMovingDown(); break;
    }
  },

  showStats:       function(on) { this.cfg.stats = on; },
  showFootprints:  function(on) { this.cfg.footprints = on; this.ball.footprints = []; },
  showPredictions: function(on) { this.cfg.predictions = on; },
  enableSound:     function(on) { this.cfg.sound = on; },

  //=============================================================================
  // MENU
  //=============================================================================

  Menu: {

    initialize: function(pong) {
      var press1 = pong.images["images/press1.png"];
      var press2 = pong.images["images/press2.png"];
      var winner = pong.images["images/winner.png"];
      this.press1  = { image: press1, x: 10,                                                 y: pong.cfg.wallWidth     };
      this.press2  = { image: press2, x: (pong.width - press2.width - 10),                   y: pong.cfg.wallWidth     };
      this.winner1 = { image: winner, x: (pong.width/2) - winner.width - pong.cfg.wallWidth, y: 6 * pong.cfg.wallWidth };
      this.winner2 = { image: winner, x: (pong.width/2)                + pong.cfg.wallWidth, y: 6 * pong.cfg.wallWidth };
    },

    declareWinner: function(playerNo) {
      this.winner = playerNo;
    },

    draw: function(ctx) {
      ctx.drawImage(this.press1.image, this.press1.x, this.press1.y);
      ctx.drawImage(this.press2.image, this.press2.x, this.press2.y);
      if (this.winner == 0)
        ctx.drawImage(this.winner1.image, this.winner1.x, this.winner1.y);
      else if (this.winner == 1)
        ctx.drawImage(this.winner2.image, this.winner2.x, this.winner2.y);
    }

  },

  //=============================================================================
  // SOUNDS
  //=============================================================================

  Sounds: {

    initialize: function(pong) {
      this.game      = pong;
      this.supported = Game.ua.hasAudio;
      if (this.supported) {
        this.files = {
          ping: Game.createAudio("sounds/ping.wav"),
          pong: Game.createAudio("sounds/pong.wav"),
          wall: Game.createAudio("sounds/wall.wav"),
          goal: Game.createAudio("sounds/goal.wav")
        };
      }
    },

    play: function(name) {
      if (this.supported && this.game.cfg.sound && this.files[name])
        this.files[name].play();
    },

    ping: function() { this.play('ping'); },
    pong: function() { this.play('pong'); },
    wall: function() { /*this.play('wall');*/ },
    goal: function() { /*this.play('goal');*/ }

  },

  //=============================================================================
  // COURT
  //=============================================================================

  Court: {

    initialize: function(pong) {
      var w  = pong.width;
      var h  = pong.height;
      var ww = pong.cfg.wallWidth;

      this.ww    = ww;
      this.walls = [];
      this.walls.push({x: 0, y: 0,      width: w, height: ww});
      this.walls.push({x: 0, y: h - ww, width: w, height: ww});
      var nMax = (h / (ww*2));
      for(var n = 0 ; n < nMax ; n++) { // draw dashed halfway line
        this.walls.push({x: (w / 2) - (ww / 2), 
                         y: (ww / 2) + (ww * 2 * n), 
                         width: ww, height: ww});
      }

      var sw = 3*ww;
      var sh = 4*ww;
      this.score1 = {x: 0.5 + (w/2) - 1.5*ww - sw, y: 2*ww, w: sw, h: sh};
      this.score2 = {x: 0.5 + (w/2) + 1.5*ww,      y: 2*ww, w: sw, h: sh};
    },

    draw: function(ctx, scorePlayer1, scorePlayer2) {
      ctx.fillStyle = Pong.Colors.walls;
      for(var n = 0 ; n < this.walls.length ; n++)
        ctx.fillRect(this.walls[n].x, this.walls[n].y, this.walls[n].width, this.walls[n].height);
      this.drawDigit(ctx, scorePlayer1, this.score1.x, this.score1.y, this.score1.w, this.score1.h);
      this.drawDigit(ctx, scorePlayer2, this.score2.x, this.score2.y, this.score2.w, this.score2.h);
    },

    drawDigit: function(ctx, n, x, y, w, h) {
      ctx.fillStyle = Pong.Colors.score;
      var dw = dh = this.ww*4/5;
      var blocks = Pong.Court.DIGITS[n];
      if (blocks[0])
        ctx.fillRect(x, y, w, dh);
      if (blocks[1])
        ctx.fillRect(x, y, dw, h/2);
      if (blocks[2])
        ctx.fillRect(x+w-dw, y, dw, h/2);
      if (blocks[3])
        ctx.fillRect(x, y + h/2 - dh/2, w, dh);
      if (blocks[4])
        ctx.fillRect(x, y + h/2, dw, h/2);
      if (blocks[5])
        ctx.fillRect(x+w-dw, y + h/2, dw, h/2);
      if (blocks[6])
        ctx.fillRect(x, y+h-dh, w, dh);
    },

    DIGITS: [
      [1, 1, 1, 0, 1, 1, 1], // 0
      [0, 0, 1, 0, 0, 1, 0], // 1
      [1, 0, 1, 1, 1, 0, 1], // 2
      [1, 0, 1, 1, 0, 1, 1], // 3
      [0, 1, 1, 1, 0, 1, 0], // 4
      [1, 1, 0, 1, 0, 1, 1], // 5
      [1, 1, 0, 1, 1, 1, 1], // 6
      [1, 0, 1, 0, 0, 1, 0], // 7
      [1, 1, 1, 1, 1, 1, 1], // 8
      [1, 1, 1, 1, 0, 1, 0]  // 9
    ]

  },

  //=============================================================================
  // PADDLE
  //=============================================================================

  Paddle: {

    initialize: function(pong, rhs) {
      this.pong   = pong;
      this.width  = pong.cfg.paddleWidth;
      this.height = pong.cfg.paddleHeight;
      this.minY   = pong.cfg.wallWidth;
      this.maxY   = pong.height - pong.cfg.wallWidth - this.height;
      this.speed  = (this.maxY - this.minY) / pong.cfg.paddleSpeed;
      this.setpos(rhs ? pong.width - this.width : 0, this.minY + (this.maxY - this.minY)/2);
      this.setdir(0);
    },

    setpos: function(x, y) {
      this.x      = x;
      this.y      = y;
      this.left   = this.x;
      this.right  = this.left + this.width;
      this.top    = this.y;
      this.bottom = this.y + this.height;
    },

    setdir: function(dy) {
      this.up   = (dy < 0 ? -dy : 0);
      this.down = (dy > 0 ?  dy : 0);
    },

    setAuto: function(on, level) {
      if (on && !this.auto) {
        this.auto = true;
        this.setLevel(level);
      }
      else if (!on && this.auto) {
        this.auto = false;
        this.setdir(0);
      }
    },

    setLevel: function(level) {
      if (this.auto)
        this.level = Pong.Levels[level];
    },

    update: function(dt, ball) {
      if (this.auto)
        this.ai(dt, ball);

      var amount = this.down - this.up;
      if (amount != 0) {
        var y = this.y + (amount * dt * this.speed);
        if (y < this.minY)
          y = this.minY;
        else if (y > this.maxY)
          y = this.maxY;
        this.setpos(this.x, y);
      }
    },

    ai: function(dt, ball) {
      if (((ball.x < this.left) && (ball.dx < 0)) ||
          ((ball.x > this.right) && (ball.dx > 0))) {
        this.stopMovingUp();
        this.stopMovingDown();
        return;
      }

      this.predict(ball, dt);

      if (this.prediction) {
        if (this.prediction.y < (this.top + this.height/2 - 5)) {
          this.stopMovingDown();
          this.moveUp();
        }
        else if (this.prediction.y > (this.bottom - this.height/2 + 5)) {
          this.stopMovingUp();
          this.moveDown();
        }
        else {
          this.stopMovingUp();
          this.stopMovingDown();
        }
      }
    },

    predict: function(ball, dt) {
      // only re-predict if the ball changed direction, or its been some amount of time since last prediction
      if (this.prediction &&
          ((this.prediction.dx * ball.dx) > 0) &&
          ((this.prediction.dy * ball.dy) > 0) &&
          (this.prediction.since < this.level.aiReaction)) {
        this.prediction.since += dt;
        return;
      }

      var pt  = Pong.Helper.ballIntercept(ball, {left: this.left, right: this.right, top: -10000, bottom: 10000}, ball.dx * 10, ball.dy * 10);
      if (pt) {
        var t = this.minY + ball.radius;
        var b = this.maxY + this.height - ball.radius;

        while ((pt.y < t) || (pt.y > b)) {
          if (pt.y < t) {
            pt.y = t + (t - pt.y);
          }
          else if (pt.y > b) {
            pt.y = t + (b - t) - (pt.y - b);
          }
        }
        this.prediction = pt;
      }
      else {
        this.prediction = null;
      }

      if (this.prediction) {
        this.prediction.since = 0;
        this.prediction.dx = ball.dx;
        this.prediction.dy = ball.dy;
        this.prediction.radius = ball.radius;
        this.prediction.exactX = this.prediction.x;
        this.prediction.exactY = this.prediction.y;
        var closeness = (ball.dx < 0 ? ball.x - this.right : this.left - ball.x) / this.pong.width;
        var error = this.level.aiError * closeness;
        this.prediction.y = this.prediction.y + Game.random(-error, error);
      }
    },

    draw: function(ctx) {
      ctx.fillStyle = Pong.Colors.walls;
      ctx.fillRect(this.x, this.y, this.width, this.height);
      if (this.prediction && this.pong.cfg.predictions) {
        ctx.strokeStyle = Pong.Colors.predictionExact;
        ctx.strokeRect(this.prediction.x - this.prediction.radius, this.prediction.exactY - this.prediction.radius, this.prediction.radius*2, this.prediction.radius*2);
        ctx.strokeStyle = Pong.Colors.predictionGuess;
        ctx.strokeRect(this.prediction.x - this.prediction.radius, this.prediction.y - this.prediction.radius, this.prediction.radius*2, this.prediction.radius*2);
      }
    },

    moveUp:         function() { this.up   = 1; },
    moveDown:       function() { this.down = 1; },
    stopMovingUp:   function() { this.up   = 0; },
    stopMovingDown: function() { this.down = 0; }

  },

  //=============================================================================
  // BALL
  //=============================================================================

  Ball: {

    initialize: function(pong) {
      this.pong    = pong;
      this.radius  = pong.cfg.ballRadius;
      this.minX    = this.radius;
      this.maxX    = pong.width - this.radius;
      this.minY    = pong.cfg.wallWidth + this.radius;
      this.maxY    = pong.height - pong.cfg.wallWidth - this.radius;
      this.speed   = (this.maxX - this.minX) / pong.cfg.ballSpeed;
      this.accel   = pong.cfg.ballAccel;
    },

    reset: function(playerNo) {
      this.footprints = [];
      this.setpos(playerNo == 1 ?   this.maxX : this.minX,  Game.random(this.minY, this.maxY));
      this.setdir(playerNo == 1 ? -this.speed : this.speed, this.speed);
    },

    setpos: function(x, y) {
      this.x      = x;
      this.y      = y;
      this.left   = this.x - this.radius;
      this.top    = this.y - this.radius;
      this.right  = this.x + this.radius;
      this.bottom = this.y + this.radius;
    },

    setdir: function(dx, dy) {
      this.dxChanged = ((this.dx < 0) != (dx < 0)); // did horizontal direction change
      this.dyChanged = ((this.dy < 0) != (dy < 0)); // did vertical direction change
      this.dx = dx;
      this.dy = dy;
    },

    footprint: function() {
      if (this.pong.cfg.footprints) {
        if (!this.footprintCount || this.dxChanged || this.dyChanged) {
          this.footprints.push({x: this.x, y: this.y});
          if (this.footprints.length > 50)
            this.footprints.shift();
          this.footprintCount = 5;
        }
        else {
          this.footprintCount--;
        }
      }
    },

    update: function(dt, leftPaddle, rightPaddle) {

      pos = Pong.Helper.accelerate(this.x, this.y, this.dx, this.dy, this.accel, dt);

      if ((pos.dy > 0) && (pos.y > this.maxY)) {
        pos.y = this.maxY;
        pos.dy = -pos.dy;
      }
      else if ((pos.dy < 0) && (pos.y < this.minY)) {
        pos.y = this.minY;
        pos.dy = -pos.dy;
      }

      var paddle = (pos.dx < 0) ? leftPaddle : rightPaddle;
      var pt     = Pong.Helper.ballIntercept(this, paddle, pos.nx, pos.ny);

      if (pt) {
        switch(pt.d) {
          case 'left':
          case 'right':
            pos.x = pt.x;
            pos.dx = -pos.dx;
            break;
          case 'top':
          case 'bottom':
            pos.y = pt.y;
            pos.dy = -pos.dy;
            break;
        }

        // add/remove spin based on paddle direction
        if (paddle.up)
          pos.dy = pos.dy * (pos.dy < 0 ? 0.5 : 1.5);
        else if (paddle.down)
          pos.dy = pos.dy * (pos.dy > 0 ? 0.5 : 1.5);
      }

      this.setpos(pos.x,  pos.y);
      this.setdir(pos.dx, pos.dy);
      this.footprint();
    },

    draw: function(ctx) {
      var w = h = this.radius * 2;
      ctx.fillStyle = Pong.Colors.ball;
      ctx.fillRect(this.x - this.radius, this.y - this.radius, w, h);
      if (this.pong.cfg.footprints) {
        var max = this.footprints.length;
        ctx.strokeStyle = Pong.Colors.footprint;
        for(var n = 0 ; n < max ; n++)
          ctx.strokeRect(this.footprints[n].x - this.radius, this.footprints[n].y - this.radius, w, h);
      }
    }

  },

  //=============================================================================
  // HELPER
  //=============================================================================

  Helper: {

    accelerate: function(x, y, dx, dy, accel, dt) {
      var x2  = x + (dt * dx) + (accel * dt * dt * 0.5);
      var y2  = y + (dt * dy) + (accel * dt * dt * 0.5);
      var dx2 = dx + (accel * dt) * (dx > 0 ? 1 : -1);
      var dy2 = dy + (accel * dt) * (dy > 0 ? 1 : -1);
      return { nx: (x2-x), ny: (y2-y), x: x2, y: y2, dx: dx2, dy: dy2 };
    },

    intercept: function(x1, y1, x2, y2, x3, y3, x4, y4, d) {
      var denom = ((y4-y3) * (x2-x1)) - ((x4-x3) * (y2-y1));
      if (denom != 0) {
        var ua = (((x4-x3) * (y1-y3)) - ((y4-y3) * (x1-x3))) / denom;
        if ((ua >= 0) && (ua <= 1)) {
          var ub = (((x2-x1) * (y1-y3)) - ((y2-y1) * (x1-x3))) / denom;
          if ((ub >= 0) && (ub <= 1)) {
            var x = x1 + (ua * (x2-x1));
            var y = y1 + (ua * (y2-y1));
            return { x: x, y: y, d: d};
          }
        }
      }
      return null;
    },

    ballIntercept: function(ball, rect, nx, ny) {
      var pt;
      if (nx < 0) {
        pt = Pong.Helper.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                                   rect.right  + ball.radius, 
                                   rect.top    - ball.radius, 
                                   rect.right  + ball.radius, 
                                   rect.bottom + ball.radius, 
                                   "right");
      }
      else if (nx > 0) {
        pt = Pong.Helper.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                                   rect.left   - ball.radius, 
                                   rect.top    - ball.radius, 
                                   rect.left   - ball.radius, 
                                   rect.bottom + ball.radius,
                                   "left");
      }
      if (!pt) {
        if (ny < 0) {
          pt = Pong.Helper.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                                     rect.left   - ball.radius, 
                                     rect.bottom + ball.radius, 
                                     rect.right  + ball.radius, 
                                     rect.bottom + ball.radius,
                                     "bottom");
        }
        else if (ny > 0) {
          pt = Pong.Helper.intercept(ball.x, ball.y, ball.x + nx, ball.y + ny, 
                                     rect.left   - ball.radius, 
                                     rect.top    - ball.radius, 
                                     rect.right  + ball.radius, 
                                     rect.top    - ball.radius,
                                     "top");
        }
      }
      return pt;
    }

  }

  //=============================================================================

}; // Pong