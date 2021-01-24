"use strict";
var Ball = /** @class */ (function () {
    function Ball(velocity, x, y, radius, color) {
        this.velocity = velocity;
        this.pos = new Vector2(x, y);
        this.lastPos = new Vector2(x, y);
        this.radius = radius;
        this.color = color;
    }
    Ball.prototype.getVelocity = function () {
        return this.velocity;
    };
    Ball.prototype.setVelocity = function (x, y) {
        this.velocity = new Vector2(x, y);
    };
    Ball.prototype.getPos = function () {
        return this.pos;
    };
    Ball.prototype.setPos = function (x, y) {
        this.pos = new Vector2(x, y);
    };
    Ball.prototype.getRadius = function () {
        return this.radius;
    };
    Ball.prototype.setRadius = function (radius) {
        this.radius = radius;
    };
    Ball.prototype.draw = function (context) {
        context.fillStyle = this.color;
        context.beginPath();
        context.ellipse(this.pos.getX(), this.pos.getY(), this.radius, this.radius, 0, 0, 2 * Math.PI);
        context.fill();
    };
    Ball.prototype.negateXVel = function () {
        this.velocity.setX(-this.velocity.getX());
    };
    Ball.prototype.negateYVel = function () {
        this.velocity.setY(-this.velocity.getY());
    };
    Ball.prototype.move = function (ratio) {
        this.lastPos.copyFrom(this.pos);
        this.pos.add(this.velocity.getX() * ratio, this.velocity.getY() * ratio);
    };
    Ball.prototype.moveBack = function () {
        this.pos.copyFrom(this.lastPos);
    };
    /**
     *  returns true if this needs to be removed, because it left the box at the bottom.
     */
    Ball.prototype.collideBox = function (minX, minY, maxX, maxY) {
        var x = this.pos.getX();
        var y = this.pos.getY();
        var velX = this.velocity.getX();
        var velY = this.velocity.getY();
        if ((x < minX && velX < 0) || (x > maxX && velX > 0)) {
            this.negateXVel();
        }
        if (y < minY && velY < 0) {
            this.negateYVel();
        }
        if (y > maxY && velY > 0) {
            return true;
        }
        return false;
    };
    return Ball;
}());
var Block = /** @class */ (function () {
    function Block(x, y, width, height, color, lives) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.lives = lives;
    }
    Block.prototype.collideBall = function (ball) {
        var x = ball.getPos().getX();
        var y = ball.getPos().getY();
        var radius = ball.getRadius();
        var deltaX = x - Math.max(this.x, Math.min(x, this.x + this.width));
        var deltaY = y - Math.max(this.y, Math.min(y, this.y + this.height));
        var collides = (deltaX * deltaX + deltaY * deltaY) < (radius * radius);
        if (collides) {
            if (x <= this.x + this.width && x >= this.x) {
                ball.negateYVel();
            }
            else if (y <= this.y + this.height && y >= this.y) {
                ball.negateXVel();
            }
            else {
                this.collideCorner(ball, deltaX, deltaY);
                // ball.negateXVel();
                // ball.negateYVel();
            }
            ball.moveBack();
            this.subLives(1);
        }
    };
    Block.prototype.collideCorner = function (ball, deltaX, deltaY) {
        var mirrorAxe = new Vector2(deltaX, deltaY);
        mirrorAxe.clamp(1);
        var vel = ball.getVelocity();
        vel.mult(-1);
        var projectedLen = mirrorAxe.multVector(vel);
        mirrorAxe.mult(projectedLen);
        mirrorAxe.subVector(vel);
        vel.addVector(mirrorAxe);
        vel.clamp(BALLSPEED);
    };
    Block.prototype.isTouchingBall = function (ball) {
        return this.isTouching(ball.getPos().getX(), ball.getPos().getY(), ball.getRadius());
    };
    Block.prototype.isTouching = function (x, y, radius) {
        var deltaX = x - Math.max(this.x, Math.min(x, this.x + this.width));
        var deltaY = y - Math.max(this.y, Math.min(y, this.y + this.height));
        return (deltaX * deltaX + deltaY * deltaY) < (radius * radius);
    };
    Block.prototype.getX = function () {
        return this.x;
    };
    Block.prototype.getY = function () {
        return this.y;
    };
    Block.prototype.getWidth = function () {
        return this.width;
    };
    Block.prototype.getHeight = function () {
        return this.height;
    };
    Block.prototype.setY = function (newY) {
        this.y = newY;
    };
    Block.prototype.draw = function (context) {
        context.fillStyle = blockColors[Math.floor(this.lives / 10)];
        context.fillRect(this.x, this.y, this.width, this.height);
        context.fillStyle = "white";
        context.font = (this.height - this.height / 8 * 3).toFixed(99) + "px Arial";
        context.strokeStyle = 'black';
        context.lineWidth = 2;
        context.strokeText(this.lives.toString(), this.x + this.width / 8, this.y + this.height / 8 * 6);
        context.fillText(this.lives.toString(), this.x + this.width / 8, this.y + this.height / 8 * 6, this.width / 2 + this.width / 4);
        context.strokeStyle = "white";
        context.lineWidth = 1;
        context.strokeRect(this.x, this.y, this.width, this.height);
    };
    Block.prototype.subLives = function (toSub) {
        var livesBefore = this.lives;
        this.lives -= toSub;
        if (this.lives <= 0 && livesBefore > 0) {
            this.playExplosionSound();
        }
    };
    Block.prototype.playExplosionSound = function () {
        BLOCK_SOUND[blockSoundIndex].play();
        if (BLOCK_SOUND.length - 1 > blockSoundIndex) {
            blockSoundIndex++;
        }
        else {
            blockSoundIndex = 0;
        }
    };
    Block.prototype.setLives = function (lives) {
        this.lives = lives;
    };
    Block.prototype.getLives = function () {
        return this.lives;
    };
    return Block;
}());
var GamePhase;
(function (GamePhase) {
    GamePhase[GamePhase["SHOOT"] = 0] = "SHOOT";
    GamePhase[GamePhase["FLY"] = 1] = "FLY";
    GamePhase[GamePhase["GAME_OVER"] = 2] = "GAME_OVER";
    GamePhase[GamePhase["WON"] = 3] = "WON";
})(GamePhase || (GamePhase = {}));
var GameLoop = /** @class */ (function () {
    function GameLoop(levelGenerator, context) {
        this.levelGenerator = levelGenerator;
        this.context = context;
        this.gamePhase = GamePhase.SHOOT;
        this.intervallHandle = -1;
        this.mousePos = new Vector2(0, 0);
        this.nextBallLaunch = 0;
        this.moveFactor = 1;
        this.level = levelGenerator.getNextLevel();
        this.initIntervall();
        this.flyBeginTime = 0;
    }
    GameLoop.prototype.initIntervall = function () {
        var _this = this;
        this.intervallHandle = setInterval(function () {
            _this.mainLoop();
        }, 20);
    };
    GameLoop.prototype.mouseMoved = function (x, y) {
        this.mousePos = new Vector2(x, y);
    };
    GameLoop.prototype.mainLoop = function () {
        if (this.gamePhase == GamePhase.SHOOT) {
            // Switch Level
            if (!this.level.hasBlocksLeft()) {
                if (this.levelGenerator.hasNext()) {
                    this.level = this.levelGenerator.getNextLevel();
                    this.gamePhase = GamePhase.SHOOT;
                }
                else {
                    clearInterval(this.intervallHandle);
                    this.gamePhase = GamePhase.WON;
                }
            }
        }
        if (this.gamePhase == GamePhase.FLY) {
            // Move down when balls are gone
            if (!this.level.hasBallsFlying()) {
                this.gamePhase = GamePhase.SHOOT;
                this.level.moveBlocksDown();
                // Game over if blocks are too low
                if (this.level.hasBlocksBelow(TOTAL_HEIGHT - BLOCK_HEIGHT + 1)) {
                    this.gamePhase = GamePhase.GAME_OVER;
                }
            }
        }
        if (this.gamePhase == GamePhase.FLY) {
            this.moveFactor = (window.performance.now() - this.flyBeginTime) / 5000;
        }
        else {
            this.moveFactor = 1;
        }
        // Move
        for (var i = 0; i < this.moveFactor; i++) {
            this.level.move(0.02);
        }
        // Draw
        this.context.clearRect(0, 0, TOTAL_WIDTH, TOTAL_HEIGHT);
        this.level.draw(this.context);
        if (this.gamePhase == GamePhase.GAME_OVER) {
            this.context.fillStyle = "white";
            this.context.font = (60).toFixed(99) + "px Arial";
            this.context.strokeStyle = 'red';
            this.context.lineWidth = 10;
            this.context.strokeText("GAME OVER", TOTAL_WIDTH / 20, TOTAL_HEIGHT / 2, TOTAL_WIDTH * 0.9);
            this.context.fillText("GAME OVER", TOTAL_WIDTH / 20, TOTAL_HEIGHT / 2, TOTAL_WIDTH * 0.9);
        }
        if (this.gamePhase == GamePhase.SHOOT) {
            var shootTarget = new Vector2(this.mousePos.getX(), this.limit(this.mousePos.getY(), 0, TOTAL_HEIGHT - BLOCK_HEIGHT));
            this.level.drawLineFromStartPositionTo(shootTarget, this.context);
        }
    };
    GameLoop.prototype.limit = function (n, min, max) {
        return (n < min) ? (min) : ((n > max) ? max : n);
    };
    GameLoop.prototype.clicked = function (x, y) {
        if (this.gamePhase == GamePhase.SHOOT) {
            var startPosition = this.level.getStartPosition();
            var posX = startPosition.getX();
            var posY = startPosition.getY();
            this.launchBall(posX, posY, x, this.limit(y, 0, TOTAL_HEIGHT - BLOCK_HEIGHT), MAX_BALLS);
            this.gamePhase = GamePhase.FLY;
            this.level.prepareNextShot();
            this.flyBeginTime = window.performance.now();
        }
    };
    GameLoop.prototype.launchBall = function (posX, posY, x, y, count) {
        var _this = this;
        if (count > 0) {
            var vel = new Vector2(x - posX, y - posY);
            vel.clamp(BALLSPEED);
            this.level.addBall(new Ball(vel, posX, posY, 5, "gold"));
            this.nextBallLaunch = setTimeout(function () {
                _this.launchBall(posX, posY, x, y, count - 1);
            }, 30);
        }
        else {
            this.nextBallLaunch = 0;
        }
    };
    GameLoop.prototype.abortBalls = function () {
        if (this.gamePhase == GamePhase.FLY) {
            this.level.removeAllBalls();
            if (this.nextBallLaunch != 0) {
                clearTimeout(this.nextBallLaunch);
                this.nextBallLaunch = 0;
            }
        }
    };
    return GameLoop;
}());
var FINE_GRAIN = 10;
var LINE_WIDTH = 2;
var Level = /** @class */ (function () {
    function Level() {
        this.blocks = [];
        this.balls = [];
        this.isFirstBall = false;
        this.startPosition = new Vector2(TOTAL_WIDTH / 2, TOTAL_HEIGHT);
    }
    Level.prototype.getIsFirstBall = function () {
        return this.isFirstBall;
    };
    Level.prototype.getStartPosition = function () {
        return this.startPosition;
    };
    Level.prototype.prepareNextShot = function () {
        this.isFirstBall = true;
    };
    Level.prototype.setIsFirstBall = function (isFirstBall) {
        this.isFirstBall = isFirstBall;
    };
    Level.prototype.drawLineFromStartPositionTo = function (pos, context) {
        context.beginPath();
        context.strokeStyle = "gold";
        context.setLineDash([5, 8]);
        context.lineWidth = LINE_WIDTH;
        context.moveTo(this.startPosition.getX(), this.startPosition.getY());
        context.lineTo(pos.getX(), pos.getY());
        context.stroke();
        context.setLineDash([]);
    };
    Level.prototype.addBlock = function (block) {
        this.blocks.push(block);
        this.blocks.sort(function (a, b) { return a.getX() - b.getX(); });
    };
    Level.prototype.removeBall = function (ball) {
        var index = this.balls.indexOf(ball);
        this.balls.splice(index, 1);
    };
    Level.prototype.hasBlocksLeft = function () {
        var count = 0;
        this.blocks.forEach(function (b) { count++; });
        return count > 0;
    };
    Level.prototype.addBall = function (ball) {
        this.balls.push(ball);
        this.balls.sort(function (a, b) { return a.getPos().getX() - b.getPos().getX(); });
    };
    Level.prototype.draw = function (context) {
        this.blocks.forEach(function (block) { return block.draw(context); });
        this.balls.forEach(function (ball) { return ball.draw(context); });
    };
    Level.prototype.move = function (ratio) {
        for (var i = 0; i < FINE_GRAIN; i++) {
            this.balls.forEach(function (ball) {
                ball.move(ratio / FINE_GRAIN);
            });
            this.checkCollision();
        }
    };
    Level.prototype.checkCollision = function () {
        var _this = this;
        var indexes = new List();
        this.balls.forEach(function (ball) {
            _this.collideWithBlocks(ball, indexes);
            _this.collideWithWalls(ball);
        });
        for (var i = indexes.size() - 1; i >= 0; i--) {
            delete this.blocks[indexes.get(i)];
        }
    };
    Level.prototype.collideWithWalls = function (ball) {
        var mustBeRemoved = ball.collideBox(0, 0, TOTAL_WIDTH, TOTAL_HEIGHT);
        if (mustBeRemoved) {
            if (this.isFirstBall) {
                this.startPosition.copyFrom(ball.getPos());
                this.isFirstBall = false;
            }
            this.removeBall(ball);
        }
    };
    Level.prototype.collideWithBlocks = function (ball, indexes) {
        var nearesDistance = Number.MAX_VALUE;
        var nearestIndex = -1;
        this.blocks.forEach(function (block, index) {
            if (block.isTouchingBall(ball)) {
                if (new Vector2(block.getX(), block.getY()).distance(ball.getPos()) < nearesDistance) {
                    nearestIndex = index;
                }
            }
        });
        if (nearestIndex >= 0) {
            var blockHit = this.blocks[nearestIndex];
            blockHit.collideBall(ball);
            if (blockHit.getLives() <= 0) {
                indexes.add(nearestIndex);
            }
        }
    };
    Level.prototype.moveBlocksDown = function () {
        this.blocks.forEach(function (block) {
            block.setY(block.getY() + BLOCK_HEIGHT);
        });
    };
    Level.prototype.hasBallsFlying = function () {
        return this.balls.length > 0;
    };
    Level.prototype.hasBlocksBelow = function (yPos) {
        for (var i = 0; i < this.blocks.length; i++) {
            var block = this.blocks[i];
            if (block && block.getY() + BLOCK_HEIGHT > yPos) {
                return true;
            }
        }
        return false;
    };
    Level.prototype.removeAllBalls = function () {
        this.balls.splice(0, this.balls.length);
    };
    return Level;
}());
var LevelGenerator = /** @class */ (function () {
    function LevelGenerator(levelData) {
        this.levelData = levelData;
        this.levelCount = 0;
    }
    LevelGenerator.prototype.reset = function () {
        this.levelCount = 0;
    };
    LevelGenerator.prototype.hasNext = function () {
        return this.levelCount < this.levelData.length;
    };
    LevelGenerator.prototype.getNextLevel = function () {
        var lines = this.levelData[this.levelCount++];
        var level = new Level();
        var totalLines = lines.length;
        lines.forEach(function (line, j) {
            for (var i = 0; i < line.length; i++) {
                var value = line.charCodeAt(i);
                if (value < MIN_CHAR_VAL || value > MAX_CHAR_VAL) {
                    value = 0;
                }
                else {
                    value -= MIN_CHAR_VAL - 1;
                }
                if (value > 0) {
                    var x = i * BLOCK_WIDTH;
                    var y = (BLOCK_ROWS - (totalLines - j)) * BLOCK_HEIGHT;
                    var block = new Block(x, y, BLOCK_WIDTH, BLOCK_HEIGHT, blockColors[value], value * 10);
                    level.addBlock(block);
                }
            }
        });
        return level;
    };
    return LevelGenerator;
}());
var levels = [
    [
        "           ",
        "    1 1    ",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
    ],
    [
        "           ",
        "12345678901",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
    ],
    [
        "99999999999",
        "9         9",
        "9 9999999 9",
        "9 9     9 9",
        "9 9 999 9 9",
        "9 9   9 9 9",
        "9 9   9 9 9",
        "9 99999 9 9",
        "9       9 9",
        "999999999 9",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
    ],
    [
        "   9   9   ",
        "9    9    9",
        "  9 9      ",
        "99999999999",
        "77777777777",
        "55555555555",
        "33333333333",
        "11111111111",
        "           ",
        "  999999999",
        "8  88888888",
        "77  7777777",
        "666  666666",
        "5555  55555",
        "44444  4444",
        "333333  333",
        "2222222  22",
        "11111111  1",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
    ],
    [
        "9999999999 ",
        "9999999999 ",
        "9999999999 ",
        "     9     ",
        "    888    ",
        "   7 7 7   ",
        "  6 6 6 6  ",
        " 5 5 5 5 5 ",
        "4 4 4 4 4 4",
        "33333333333",
        "11111111111",
        " 7 7 7 7 7 ",
        "6 6 6 6 6 6",
        " 4 3 2 3 4 ",
        "5 5 5 5 5 5",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
        "           ",
    ],
    [
        "   66666   ",
        "  6555556  ",
        " 655555556 ",
        " 655252556 ",
        " 655555556 ",
        " 656555656 ",
        " 655666556 ",
        "  6555556  ",
        "   66666   ",
        "           ",
        "11111111111",
        "1         1",
        "1 111 111 1",
        "1 151 151 1",
        "2 2225222 2",
        "           ",
        "           ",
    ],
    [
        "99999999999",
        "99999999999",
        "666       6",
        "    66666 6",
        " 6666   666",
        " 6    6  6 ",
        " 666666 66 ",
        "      6    ",
        "6 6666666  ",
        "  6     6  ",
        "666       6",
        "    66666 6",
        " 6666   666",
        " 6    6  6 ",
        " 666666 66 ",
        "      6    ",
        "6 6666666  ",
        "  6     6  ",
        " 66 666 6  ",
        "    6   6  ",
        "61666166616",
        "           ",
        "           ",
        "           ",
    ],
    [
        "99999999999",
        "99999999999",
        "          9",
        " 9   999  9",
        " 9  9   9 9",
        "  99    9 9",
        "          9",
        " 9    999 9",
        "  9  9    9",
        "    9     9",
        " 99999999 9",
        "          9",
        " 7      7 9",
        " 7      7 9",
        "  777777  9",
        "          9",
        " 55555555 9",
        "          9",
        "  44 4444 9",
        " 4  4     9",
        " 44444444 9",
        "          9",
        "  22 222  9",
        " 2  2   2 9",
        " 22222222 9",
        "           ",
        "           ",
        "           ",
    ],
];
var List = /** @class */ (function () {
    function List() {
        this.items = [];
    }
    List.prototype.size = function () {
        return this.items.length;
    };
    List.prototype.add = function (value) {
        this.items.push(value);
    };
    List.prototype.get = function (index) {
        return this.items[index];
    };
    List.prototype.sort = function () {
        this.items.sort();
    };
    return List;
}());
var BALLSPEED = 800;
var MAX_BALLS = 75;
var MIN_CHAR_VAL = "1".charCodeAt(0);
var MAX_CHAR_VAL = "9".charCodeAt(0);
var BLOCK_WIDTH = 30;
var BLOCK_HEIGHT = 30;
var BLOCK_COLUMNS = 11;
var BLOCK_ROWS = 19;
var TOTAL_WIDTH = BLOCK_WIDTH * BLOCK_COLUMNS;
var TOTAL_HEIGHT = BLOCK_HEIGHT * BLOCK_ROWS;
var blockColors = ["darkgreen", "green", "lightgreen", "goldenrod", "gold", "yellow", "orange", "orangered", "FireBrick", "red", "red"];
var BLOCK_SOUND = [new Audio("sfx/collision.wav"), new Audio("sfx/collision.wav"), new Audio("sfx/collision.wav"), new Audio("sfx/collision.wav"), new Audio("sfx/collision.wav"), new Audio("sfx/collision.wav")];
var blockSoundIndex = 0;
/*
    ///**
class Main {
    // Example for the use of Block
class Main {
    public static main(): void {
        const block = new Block(300, 300, 20, 20, "red", 100);
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
        if (canvas != null) {
            const context = canvas.getContext("2d");
            if (context != null) {
                block.draw(context);
            } else {
                console.error("context == null");
            }
        }
        console.log(block.isTouching(310, 309, 1));
        block.subLives(10);
        console.log(block);
    }
     
}
Main.main();
*/
/*
    Example for Ball
class Main {
    public static main(): void {
        const block = new Block(280, 280, 40, 40, "red", 100);
        const ball = new Ball(new Vector2(0, -1), 300, 590, 10, "yellow");
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
        if (canvas != null) {
            const context = canvas.getContext("2d");
            if (context != null) {
                setInterval(() => {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    block.draw(context);
                    ball.draw(context);
                    console.log(block.isTouching(ball.getPos().getX(), ball.getPos().getY(), ball.getRadius()));
                    ball.move();
                }, 20);
            } else {
                console.error("context == null");
            }
        }
    }
}
*/
// */
var Main2 = /** @class */ (function () {
    function Main2() {
    }
    Main2.main = function () {
        BLOCK_SOUND.forEach(function (sound) {
            sound.volume = 1;
        });
        var canvas = document.getElementById("canvas");
        var context = canvas.getContext("2d");
        var levelGenerator = new LevelGenerator(levels);
        Main2.game = new GameLoop(levelGenerator, context);
    };
    Main2.canvasClicked = function (event) {
        if (!Main2.isMusicPlaying) {
            var music = new Audio("sfx/Calming - AShamaluevMusic.mp3");
            music.volume = 0.5;
            music.play();
            Main2.isMusicPlaying = true;
        }
        var x = event.clientX;
        var y = event.clientY;
        Main2.game.clicked(x, y);
    };
    Main2.mouseMoved = function (event) {
        this.game.mouseMoved(event.clientX, event.clientY);
    };
    Main2.abortBalls = function () {
        console.log("Test");
        this.game.abortBalls();
    };
    Main2.isMusicPlaying = false;
    return Main2;
}());
function start() {
    Main2.main();
}
var Vector2 = /** @class */ (function () {
    function Vector2(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector2.prototype.copyFrom = function (other) {
        this.x = other.x;
        this.y = other.y;
    };
    Vector2.prototype.getX = function () {
        return this.x;
    };
    Vector2.prototype.setX = function (x) {
        this.x = x;
    };
    Vector2.prototype.getY = function () {
        return this.y;
    };
    Vector2.prototype.setY = function (y) {
        this.y = y;
    };
    Vector2.prototype.add = function (x, y) {
        this.x += x;
        this.y += y;
    };
    Vector2.prototype.sub = function (x, y) {
        this.x -= x;
        this.y -= y;
    };
    Vector2.prototype.subVector = function (v) {
        this.x -= v.x;
        this.y -= v.y;
    };
    Vector2.prototype.addVector = function (v) {
        this.x += v.x;
        this.y += v.y;
    };
    Vector2.prototype.mult = function (multWith) {
        this.x *= multWith;
        this.y *= multWith;
    };
    Vector2.prototype.clamp = function (clamp) {
        var length = this.length();
        var x = (this.x / length) * clamp;
        var y = (this.y / length) * clamp;
        this.x = x;
        this.y = y;
    };
    Vector2.prototype.length = function () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    };
    Vector2.prototype.multVector = function (multwith) {
        return this.x * multwith.getX() + this.y * multwith.getY();
    };
    Vector2.prototype.distance = function (other) {
        return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y));
    };
    return Vector2;
}());
