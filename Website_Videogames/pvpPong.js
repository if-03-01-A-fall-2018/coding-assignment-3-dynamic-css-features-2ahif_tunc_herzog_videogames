// Global Variables
var DIRECTION = {
	IDLE: 0,
	UP: 1,
	DOWN: 2,
	LEFT: 3,
	RIGHT: 4
};

var name;

var rounds = [5, 5, 3, 3, 2];
var colors = ['#1abc9c', '#2ecc71', '#3498db', '#e74c3c', '#9b59b6'];

var pvpScore = {
	countOne: 0,
	countTwo: 0,
	text: "SCORE: "
};

// The Ball object (The cube that bounces back and forth)
var pvpBall = {
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

// The Paddle object (The two lines that move up and down)
var pvpPaddle = {
	new: function (side) {
		return {
			width: 18,
			height: 85,
			x: side === 'left' ? 150 : this.canvas.width - 150,
			y: (this.canvas.height / 2) - 35,
			move: DIRECTION.IDLE,
			speed: 10
		};
	}
};

var Game = {
	initialize: function () {
		this.canvas = document.querySelector('#pvpcanvas');
		this.pvpContext = this.canvas.getContext('2d');

		this.canvas.width = 1300;
		this.canvas.height = 900;

		this.canvas.style.width = (this.canvas.width / 2) + 'px';
		this.canvas.style.height = (this.canvas.height / 2) + 'px';

		this.player1 = pvpPaddle.new.call(this, 'left');
		this.player2 = pvpPaddle.new.call(this, 'right');
		this.pvpBall = pvpBall.new.call(this);

		this.pvpRunning = this.over = false;
		this.turn = this.player2;
		this.timer = this.round = 0;
		this.color = '#222233';

		PvPPong.menu();
		PvPPong.listen();
	},

	endGameMenu: function (text) {
		// Change the canvas font size and color
		PvPPong.pvpContext.font = '50px Courier New';
		PvPPong.pvpContext.fillStyle = '#222233';

		// Draw the rectangle behind the 'Press any key to begin' text.
		PvPPong.pvpContext.fillRect(
			PvPPong.canvas.width / 2 - 350,
			PvPPong.canvas.height / 2 - 48,
			700,
			100
		);

		// Change the canvas color;
		PvPPong.pvpContext.fillStyle = '#ffffff';

		// Draw the end game menu text ('Game Over' and 'Winner')
		PvPPong.pvpContext.fillText(text,
			PvPPong.canvas.width / 2,
			PvPPong.canvas.height / 2 + 15
		);

		setTimeout(function () {
			PvPPong = Object.assign({}, Game);
			PvPPong.initialize();
		}, 3000);
	},

	menu: function () {
		// Draw all the PvPPong objects in their current state
		PvPPong.draw();

		// Change the canvas font size and color
		this.pvpContext.font = '50px Courier New';
		this.pvpContext.fillStyle = '#222233';

		// Draw the rectangle behind the 'Press any key to begin' text.
		this.pvpContext.fillRect(
			this.canvas.width / 2 - 350,
			this.canvas.height / 2 - 48,
			700,
			100
		);

		// Change the canvas color
		this.pvpContext.fillStyle = '#ffffff';

		// Draw the 'press any key to begin' text
		this.pvpContext.fillText('Press any key to begin',
			this.canvas.width / 2,
			this.canvas.height / 2 + 15
		);
	},

	// Update all objects (move the player1, player2, pvpBall, increment the score, etc.)
	update: function () {
		if (!this.over) {
			// If the pvpBall collides with the bound limits - correct the x and y coords.
			if (this.pvpBall.x <= 0) PvPPong._resetTurn.call(this, true);
			if (this.pvpBall.x >= this.canvas.width - this.pvpBall.width) PvPPong._resetTurn.call(this, false);
			if (this.pvpBall.y <= 0) this.pvpBall.moveY = DIRECTION.DOWN;
			if (this.pvpBall.y >= this.canvas.height - this.pvpBall.height) this.pvpBall.moveY = DIRECTION.UP;

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
			if (this.player2.y >= this.canvas.height - this.player2.height) this.player2.y = this.canvas.height - this.player2.height;
			else if (this.player2.y <= 0) this.player2.y = 0;

			// On new serve (start of each turn) move the pvpBall to the correct side
			// and randomize the direction to add some challenge.
			if (PvPPong._turnDelayIsOver.call(this) && this.turn) {
				this.pvpBall.moveX = this.turn === this.player1 ? DIRECTION.LEFT : DIRECTION.RIGHT;
				this.pvpBall.moveY = [DIRECTION.UP, DIRECTION.DOWN][Math.round(Math.random())];
				this.pvpBall.y = Math.floor(Math.random() * this.canvas.height - 200) + 200;
				this.turn = null;
			}

			// Move pvpBall in intended direction based on moveY and moveX values
			if (this.pvpBall.moveY === DIRECTION.UP) this.pvpBall.y -= (this.pvpBall.speed / 1.5);
			else if (this.pvpBall.moveY === DIRECTION.DOWN) this.pvpBall.y += (this.pvpBall.speed / 1.5);
			if (this.pvpBall.moveX === DIRECTION.LEFT) this.pvpBall.x -= this.pvpBall.speed;
			else if (this.pvpBall.moveX === DIRECTION.RIGHT) this.pvpBall.x += this.pvpBall.speed;

			// Handle player1-pvpBall collisions
			if (this.pvpBall.x - this.pvpBall.width <= this.player1.x && this.pvpBall.x >= this.player1.x - this.player1.width) {
				if (this.pvpBall.y <= this.player1.y + this.player1.height && this.pvpBall.y + this.pvpBall.height >= this.player1.y) {
					this.pvpBall.x = (this.player1.x + this.pvpBall.width);
					this.pvpBall.moveX = DIRECTION.RIGHT;
				}
			}

			// Handle player2-pvpBall collision
			if (this.pvpBall.x - this.pvpBall.width <= this.player2.x && this.pvpBall.x >= this.player2.x - this.player2.width) {
				if (this.pvpBall.y <= this.player2.y + this.player2.height && this.pvpBall.y + this.pvpBall.height >= this.player2.y) {
					this.pvpBall.x = (this.player2.x - this.pvpBall.width);
					this.pvpBall.moveX = DIRECTION.LEFT;
				}
			}
		}

		// Handle the end of round transition
		// Check to see if the player1 won the round.
		if (pvpScore.countOne === rounds[this.round]) {
			// Check to see if there are any more rounds/levels left and display the victory screen if
			// there are not.
			if (!rounds[this.round + 1]) {
				this.over = true;
				setTimeout(function () {
					PvPPong.endGameMenu('Player 1 wins!');
				}, 1000);
			} else {
				// If there is another round, reset all the values and increment the round number.
				this.color = "#222233";
				pvpScore.countOne = pvpScore.countTwo = 0;
				this.player1.speed += 0.5;
				this.player2.speed += 0.5;
				this.pvpBall.speed += 1;
				this.round += 1;
			}
		}
		// Check to see if the player2 has won the round.
		else if (pvpScore.countTwo === rounds[this.round]) {
			// Check to see if there are any more rounds/levels left and display the victory screen if
			// there are not.
			if (!rounds[this.round + 1]) {
				this.over = true;
				setTimeout(function () {
					PvPPong.endGameMenu('Player 2 wins!');
				}, 1000);
			} else {
				// If there is another round, reset all the values and increment the round number.
				this.color = "#222233";
				pvpScore.countOne = pvpScore.countTwo = 0;
				this.player1.speed += 0.5;
				this.player2.speed += 0.5;
				this.pvpBall.speed += 1;
				this.round += 1;
			}
		}

		PvPPong.updateScorePvP(1);
		PvPPong.updateScorePvP(2);
	},

	updateScorePvP: function (player) {
		if (player == 1) {
			document.getElementById('pvpPongScore1').innerText = pvpScore.text + pvpScore.countOne;
		}
		else {
			document.getElementById('pvpPongScore2').innerText = pvpScore.text + pvpScore.countTwo;
		}
	},

	// Draw the objects to the canvas element
	draw: function () {
		// Clear the Canvas
		this.pvpContext.clearRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		// Set the fill style
		this.pvpContext.fillStyle = this.color;

		// Draw the background
		this.pvpContext.fillRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		);

		// Set the fill style to white (For the pvpPaddles and the pvpBall)
		this.pvpContext.fillStyle = '#ffffff';

		// Draw the player1
		this.pvpContext.fillRect(
			this.player1.x,
			this.player1.y,
			this.player1.width,
			this.player1.height
		);

		// Draw the player2
		this.pvpContext.fillRect(
			this.player2.x,
			this.player2.y,
			this.player2.width,
			this.player2.height
		);

		// Draw the pvpBall
		if (PvPPong._turnDelayIsOver.call(this)) {
			this.pvpContext.fillRect(
				this.pvpBall.x,
				this.pvpBall.y,
				this.pvpBall.width,
				this.pvpBall.height
			);
		}

		// Draw the net (Line in the middle)
		this.pvpContext.beginPath();
		this.pvpContext.setLineDash([7, 15]);
		this.pvpContext.moveTo((this.canvas.width / 2), 140);
		this.pvpContext.lineTo((this.canvas.width / 2), this.canvas.height);
		this.pvpContext.lineWidth = 10;
		this.pvpContext.strokeStyle = '#ffffff';
		this.pvpContext.stroke();

		// Set the default canvas font and align it to the center
		this.pvpContext.font = '100px Courier New';
		this.pvpContext.textAlign = 'center';

		// Change the font size for the center score text
		this.pvpContext.font = '30px Courier New';

		// Draw the winning score (center)
		this.pvpContext.fillText(
			'Round ' + (Pong.round + 1),
			(this.canvas.width / 2),
			35
		);

		// Change the font size for the center score value
		this.pvpContext.font = '40px Courier';

		// Draw the current round number
		this.pvpContext.fillText(
			rounds[PvPPong.round] ? rounds[PvPPong.round] : rounds[PvPPong.round - 1],
			(this.canvas.width / 2),
			100
		);
	},

	loop: function () {
		PvPPong.update();
		PvPPong.draw();

		// If the game is not over, draw the next frame.
		if (!PvPPong.over) requestAnimationFrame(PvPPong.loop);
	},

	listen: function () {
		document.addEventListener('keydown', function (key) {
			// Handle the 'Press any key to begin' function and start the game.
			if (PvPPong.pvpRunning === false) {
				PvPPong.pvpRunning = true;
				window.requestAnimationFrame(PvPPong.loop);
			}

			// Handle w key events for player1
			if (key.keyCode === 87) {
				key.preventDefault();
				PvPPong.player1.move = DIRECTION.UP;
			}

			// Handle s key events for player1
			if (key.keyCode === 83) {
				key.preventDefault();
				PvPPong.player1.move = DIRECTION.DOWN;
			}

			// Handle up arrow key events for player2
			if (key.keyCode === 38) {
				key.preventDefault();
				PvPPong.player2.move = DIRECTION.UP;
			}

			// Handle down arrow key events for player2
			if (key.keyCode === 40) {
				key.preventDefault();
				PvPPong.player2.move = DIRECTION.DOWN;
			}
		});

		// Stop the player1 and player2 from moving when there are no keys being pressed.
		document.addEventListener('keyup', function (key) {
			PvPPong.player1.move = DIRECTION.IDLE;
			PvPPong.player2.move = DIRECTION.IDLE;
		});
	},

	// Reset the pvpBall location, the turns and set a delay before the next round begins.
	_resetTurn: function (playerTwoPoint) {
		min = 0;
		max = 1;

		min = Math.ceil(min);
		max = Math.floor(max);
		nextTurn = Math.floor(Math.random() * (max - min + 1)) + min;

		this.pvpBall = pvpBall.new.call(this, this.pvpBall.speed);
		this.timer = (new Date()).getTime();

		if (nextTurn == 1) {
			this.turn = this.player1;
		}
		else if (nextTurn === 0) {
			this.turn = this.player2;
		}

		if (playerTwoPoint) {
			pvpScore.countTwo++;
		}
		else {
			pvpScore.countOne++;
		}

		PvPPong.updateScorePvP(1);
		PvPPong.updateScorePvP(2);
	},

	// Wait for a delay to have passed after each turn.
	_turnDelayIsOver: function () {
		return ((new Date()).getTime() - this.timer >= 1000);
	},

	pvpRestart: function () {
		window.alert("PVP pong restarted!");
	}
};

function invalidName(name) {
	if (name == null) {
		return;
	}

	do {
		if (name == " " || !name) {
			name = prompt("Hmm.. that doesn't really look like a name. Try again!");
		}
	} while (name == " " || !name)
}

document.querySelector("#stopPVPPong").addEventListener("click", function () {
	if (pvpScore.countTwo > pvpScore.countOne) {
		name = prompt("Player2 Won! Your score will now be listed in the Scoreboard. Winner, please enter your name!");
		invalidName(name);
		savePlayer(name, pvpScore.countTwo, "pong");
	}
	else if (pvpScore.countOne > pvpScore.countTwo) {
		name = prompt("Player1 Won! Your score will now be listed in the Scoreboard. Winner, please enter your name!");
		invalidName(name);
		savePlayer(name, pvpScore.countOne, "pong");
	}
	else {
		alert("It's a draw! To keep everything fair and from overflowing, none of you will be added to the Scoreboard.");
	}

	pvpPongRestart();
});

function pvpPongRestart() {
	this.color = "#222233";
	pvpScore.countOne = 0;
	pvpScore.countTwo = 0;
	this.pvpPaddle.speed = 10;
	this.pvpBall.speed = 9;
}

var PvPPong = Object.assign({}, Game);
PvPPong.updateScorePvP(1);
PvPPong.updateScorePvP(2);
PvPPong.initialize();