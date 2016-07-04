/** @constant {number} VERTICAL */
var VERTICAL = 83;
/** @constant {number} HORIZONTAL */
var HORIZONTAL = 101;
/** @constant {number} PLAYER_START_X */
var PLAYER_START_X = 202;
/** @constant {number} PLAYER_START_Y */
var PLAYER_START_Y = 380;
/** @global {number} speedModifier */
var speedModifier = 100;

/**
 * Class representing an enemy.
 * @constructor
 * @param {number} x - the enemy's x position on the canvas.
 * @param {number} y - The enemy's y position on the canvas.
 * @param {number} row - The enemy's row on the canvas.
 * @property {number} start_x - Starting location of this enemy.
 * @property {number} speed - Speed of the enemy.
 * @property {string} sprite - Location of image file to render for enemy.
 */
var Enemy = function(x, y, row) {
    this.x = x;
    this.y = y;
    this.row = row;
    this.start_x = x;
    this.speed = (Math.random() * speedModifier) + speedModifier;
    this.sprite = 'images/enemy-bug.png';
};

/**
 * @function Enemy.prototype.update
 * Function that updates the enemy's position.  The enemy's position will
 * reset once it reaches the edge of the canvas.  The enemy's speed is then
 * randomly generated.
 * @param {number} dt - A time delta between ticks.
 */
Enemy.prototype.update = function(dt) {
    if (this.x < ctx.canvas.width) {
        this.x += (dt * this.speed);
    } else {
        this.x = this.start_x;
        this.speed = (Math.random() * speedModifier) + speedModifier;
    }
};

/**
 * @function Enemy.prototype.render
 * Draw the enemy on the screen, required method for game
 */
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

/**
 * Class representing a player.
 * @constructor
 * @property {number} x - the player's x position on the canvas.
 * @property {number} y - The player's y position on the canvas.
 * @property {number} row - The player's row on the canvas.
 * @property {number} score - The current score for the player.
 * @property {string} sprite - Location of image file to render for player.
 */
var Player = function() {
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
    this.row = 1;
    this.score = 0;
    this.sprite = 'images/char-boy.png';
};

/**
 * @function Player.prototype.update
 * Function that checks for collisions between players and enemies.
 */
Player.prototype.update = function() {
    for (var i = 0; i < allEnemies.length; i++) {
        if (this.row === allEnemies[i].row) {
            if (Math.abs(this.x - allEnemies[i].x) <= 50) {
                this.reset();
                this.score = 0;
                speedModifier = 100;
            }
        }
    }
};

/**
 * @function Enemy.prototype.render
 * Draw the player on the screen, required method for game.  Also renders
 * the scoreboard.
 */
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    ctx.font = "25pt Roboto";
    ctx.fillStyle = "black";
    ctx.fillText("Score: " + this.score, 25, 25);
};

/**
 * @function Enemy.prototype.handleInput
 * Controls the movement of the player based on the key that is pressed.
 * @param {string} key - A string representing which arrow key was pressed.
 */
Player.prototype.handleInput = function(key) {
    switch (key) {
        case 'left':
            if (this.x >= HORIZONTAL) {
                this.x -= HORIZONTAL;
            }
            break;

        case 'up':
            if (this.row === 5) {
                this.reset();
                this.score += 1;
                speedModifier += 25;
                ctx.fillText("Score: " + this.score, 25, 25);
            } else {
                this.y -= VERTICAL;
                this.row += 1;
            }
            break;

        case 'right':
            if (this.x + HORIZONTAL < ctx.canvas.width) {
                this.x += HORIZONTAL;
            }
            break;

        case 'down':
            if (this.y < PLAYER_START_Y) {
                this.y += VERTICAL;
                this.row -= 1;
            }
            break;

        default:
            console.error("Invalid input detected!");
    }
};

/**
 * @function Enemy.prototype.reset
 * Function that moves the player back to the original starting block and helps
 * to update the scoreboard to display the correct score.
 */
Player.prototype.reset = function() {
    this.x = PLAYER_START_X;
    this.y = PLAYER_START_Y;
    this.row = 1;
    ctx.clearRect(0, 0, 300, 65);
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [new Enemy(-200, 50, 5),
    new Enemy(-200, 133, 4),
    new Enemy(-200, 216, 3)
];
var player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});