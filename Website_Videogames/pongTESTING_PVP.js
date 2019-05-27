// Global Variables
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
	new: function(incrementedSpeed) {
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

// The PvPPaddle object (The two lines that move up and down)
var PvPPaddle = {
	new: function(side) {
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
	initialize: function() {
		this.canvas = document.querySelector('#pvpcanvas');
		this.context = this.canvas.getContext('2d');

		this.canvas.width = 1300;
		this.canvas.height = 900;

		this.canvas.style.width = (this.canvas.width / 2) + 'px';
		this.canvas.style.height = (this.canvas.height / 2) + 'px';

		this.player1 = PvPPaddle.new.call(this, 'left');
		this.player2 = PvPPaddle.new.call(this, 'right');
		this.ball = Ball.new.call(this);

		this.running = this.over = false;
		//this.turn = this.player2;
		this.timer = this.round = 0;
		this.color = '#222233';

		PvPPong.menu();
		PvPPong.listen();
	},

	endGameMenu: function(text) {
		// Change the canvas font size and color
		PvPPong.context.font = '50px Courier New';
		PvPPong.context.fillStyle = '#222233';

		// Draw the rectangle behind the 'Press any key to begin' text.
		PvPPong.context.fillRect(
			PvPPong.canvas.width / 2 - 350,
			PvPPong.canvas.height / 2 - 48,
			700,
			100
		);

		// Change the canvas color;
		PvPPong.context.fillStyle = '#ffffff';

		// Draw the end game menu text ('Game Over' and 'Winner')
		PvPPong.context.fillText(text,
			PvPPong.canvas.width / 2,
			PvPPong.canvas.height / 2 + 15
		);

		setTimeout(function() {
			PvPPong = Object.assign({}, Game);
			PvPPong.initialize();
		}, 3000);
	},

	menu: function() {
		// Draw all the PvPPong objects in their current state
		PvPPong.draw();

		// Change the canvas font size and color
		this.context.font = '50px Courier New';
		this.context.fillStyle = '#222233';

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

	// Update all objects (move the player1, player2, ball, increment the score, etc.)
	update: function() {
		if (!this.over) {
			// If the ball collides with the bound limits - correct the x and y coords.
			if (this.ball.x <= 0) PvPPong._resetTurn.call(this, this.player2, this.player1);
			if (this.ball.x >= this.canvas.width - this.ball.width) PvPPong._resetTurn.call(this, this.player1, this.player2);
			if (this.ball.y <= 0) this.ball.moveY = DIRECTION.DOWN;
			if (this.ball.y >= this.canvas.height - this.ball.height) this.ball.moveY = DIRECTION.UP;

			// Move player1 if the player1.move value was updated by a keyboard event
			if (this.player1.move === DIRECTION.UP) this.player1.y -= this.player1.speed;
			else if (this.player1.move === DIRECTION.DOWN) this.player1.y += this.player1.speed;

			// If the player1 collides with the bound limits, update the x and y coords.
			if (this.player1.y <= 0) this.player1.y = 0;
			else if (this.player1.y >= (this.canvas.height - this.player1.height)) this.player1.y = (this.canvas.height - this.player1.height);

			// Move player2 if the player2.move value was updated by a keyboard event
			if (this.player2.move === DIRECTION.UP) this.player2.y -= this.player2.speed;
			else if (this.player2.move === DIRECTION.DOWN) this.player2.y += this.player2.speed;

			// If the player2 collides with the bound limits, update the x and y coords.
			if (this.player2.y <= 0) this.player2.y = 0;
			else if (this.player2.y >= (this.player2.height - this.player2.height)) this.player2.y = (this.canvas.height - this.player2.height);
			
			// On new serve (start of each turn) move the ball to the correct side
			// and randomize the direction to add some challenge.
			if (PvPPong._turnDelayIsOver.call(this) && this.turn) {
				this.ball.moveX = this.turn === this.player1 ? DIRECTION.LEFT : DIRECTION.RIGHT;
				this.ball.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
				this.ball.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
				this.turn = null;
			}

			// Move ball in intended direction based on moveY and moveX values
			if (this.ball.moveY === DIRECTION.UP) this.ball.y -= (this.ball.speed / 1.5);
			else if (this.ball.moveY === DIRECTION.DOWN) this.ball.y += (this.ball.speed / 1.5);
			if (this.ball.moveX === DIRECTION.LEFT) this.ball.x -= this.ball.speed;
			else if (this.ball.moveX === DIRECTION.RIGHT) this.ball.x += this.ball.speed;
		
			// Handle player1-Ball collisions
			if (this.ball.x - this.ball.width <= this.player1.x && this.ball.x >= this.player1.x - this.player1.width) {
				if (this.ball.y <= this.player1.y + this.player1.height && this.ball.y + this.ball.height >= this.player1.y) {
					this.ball.x = (this.player1.x + this.ball.width);
					this.ball.moveX = DIRECTION.RIGHT;
				}
			}

			// Handle player2-ball collision
			if (this.ball.x - this.ball.width <= this.player2.x && this.ball.x >= this.player2.x - this.player2.width) {
				if (this.ball.y <= this.player2.y + this.player2.height && this.ball.y + this.ball.height >= this.player2.y) {
					this.ball.x = (this.player2.x - this.ball.width);
					this.ball.moveX = DIRECTION.LEFT;
				}
			}
		}

		// Handle the end of round transition
		// Check to see if the player1 won the round.
		if (this.player1.score === rounds[this.round]) {
			// Check to see if there are any more rounds/levels left and display the victory screen if
			// there are not.
			if (!rounds[this.round + 1]) {
				this.over = true;
				setTimeout(function() {
					PvPPong.endGameMenu('player1 1 wins!');
				}, 1000);
			} else {
				// If there is another round, reset all the values and increment the round number.
				this.color = "#222233";
				this.player1.score = this.player2.score = 0;
				this.player1.speed += 0.5;
				this.player2.speed += 0.5;
				this.ball.speed += 1;
				this.round += 1;
			}
		}
		// Check to see if the player2 has won the round.
		else if (this.player2.score === rounds[this.round]) {
			this.over = true;
			setTimeout(function() {
				PvPPong.endGameMenu('player1 2 wins!');
			}, 1000);
		}
	},

	// Draw the objects to the canvas element
	draw: function() {
		// Clear the Canvas
		this.context.clearRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		// Set the fill style
		this.context.fillStyle = this.color;

		// Draw the background
		this.context.fillRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		// Set the fill style to white (For the PvPPaddles and the ball)
		this.context.fillStyle = '#ffffff';

		// Draw the player1
		this.context.fillRect(
			this.player1.x,
			this.player1.y,
			this.player1.width,
			this.player1.height
		);

		// Draw the player2
		this.context.fillRect(
			this.player2.x,
			this.player2.y,
			this.player2.width,
			this.player2.height
		);

		// Draw the Ball
		if (PvPPong._turnDelayIsOver.call(this)) {
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

		// Draw the player1's score (left)
		this.context.fillText(
			this.player1.score.toString(),
			(this.canvas.width / 2) - 300,
			200
		);

		// Draw the player2's score (right)
		this.context.fillText(
			this.player2.score.toString(),
			(this.canvas.width / 2) + 300,
			200
		);

		// Change the font size for the center score text
		this.context.font = '30px Courier New';

		// Draw the winning score (center)
		this.context.fillText(
			'Round ' + (PvPPong.round + 1),
			(this.canvas.width / 2),
			35
		);

		// Change the font size for the center score value
		this.context.font = '40px Courier';

		// Draw the current round number
		this.context.fillText(
			rounds[PvPPong.round] ? rounds[PvPPong.round] : rounds[PvPPong.round - 1],
			(this.canvas.width / 2),
			100
		);
	},

	loop: function() {
		PvPPong.update();
		PvPPong.draw();

		// If the game is not over, draw the next frame.
		if (!PvPPong.over) requestAnimationFrame(PvPPong.loop);
	},

	listen: function() {
		document.addEventListener('keydown', function(key) {
			// Handle the 'Press any key to begin' function and start the game.
			if (PvPPong.running === false) {
				PvPPong.running = true;
				window.requestAnimationFrame(PvPPong.loop);
			}

			// Handle w key events for player1
			if (key.keyCode === 87)
			{
				key.preventDefault();
				PvPPong.player1.move = DIRECTION.UP;
			}

			// Handle s key events for player1
			if (key.keyCode === 83)
			{
				key.preventDefault();
				PvPPong.player1.move = DIRECTION.DOWN;
			} 

			// Handle up arrow key events for player2
			if (key.keyCode === 38)
			{
				key.preventDefault();
				PvPPong.player2.move = DIRECTION.UP;
			}

			// Handle down arrow key events for player2
			if (key.keyCode === 40)
			{
				key.preventDefault();
				PvPPong.player2.move = DIRECTION.DOWN;
			} 
		});

		// Stop the player1 and player2 from moving when there are no keys being pressed.
		document.addEventListener('keyup', function(key) {
			PvPPong.player1.move = DIRECTION.IDLE;
			PvPPong.player2.move = DIRECTION.IDLE;
		});
	},

	// Reset the ball location, the turns and set a delay before the next round begins.
	_resetTurn: function(victor, loser) {
		this.ball = Ball.new.call(this, this.ball.speed);
		this.turn = loser;
		this.timer = (new Date()).getTime();

		victor.score++;
	},

	// Wait for a delay to have passed after each turn.
	_turnDelayIsOver: function() {
		return ((new Date()).getTime() - this.timer >= 1000);
	}
};

var PvPPong = Object.assign({}, Game);
PvPPong.initialize();