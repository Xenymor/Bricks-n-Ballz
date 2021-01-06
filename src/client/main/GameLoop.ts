enum GamePhase {
    SHOOT,
    FLY,
    GAME_OVER,
    WON,
}

class GameLoop {
    private level: Level;
    private gamePhase: GamePhase = GamePhase.SHOOT;
    private intervallHandle: number = -1;
    private mousePos: Vector2 = new Vector2(0, 0);
    private nextBallLaunch: number = 0;

    constructor(private levelGenerator: LevelGenerator, private context: CanvasRenderingContext2D) {
        this.level = levelGenerator.getNextLevel();
        this.initIntervall();
    }

    private initIntervall(): void {
        this.intervallHandle = setInterval(() => {
            this.mainLoop();
        }, 20);
    }

    public mouseMoved(x: number, y: number): void {
        this.mousePos = new Vector2(x, y);
    }

    private mainLoop() {

        if (this.gamePhase == GamePhase.SHOOT) {
            // Switch Level
            if (!this.level.hasBlocksLeft()) {
                if (this.levelGenerator.hasNext()) {
                    this.level = this.levelGenerator.getNextLevel();
                    this.gamePhase = GamePhase.SHOOT;
                } else {
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

        // Move
        this.level.move(0.02);
        
        // Draw
        this.context.clearRect(0, 0, TOTAL_WIDTH, TOTAL_HEIGHT);
        this.level.draw(this.context);

        if (this.gamePhase == GamePhase.GAME_OVER) {
            this.context.fillStyle = "white";
            this.context.font = (60).toFixed(99) + "px Arial";
            this.context.strokeStyle = 'red';
            this.context.lineWidth = 10;
            this.context.strokeText("GAME OVER", TOTAL_WIDTH/20, TOTAL_HEIGHT/2, TOTAL_WIDTH*0.9);
            this.context.fillText("GAME OVER", TOTAL_WIDTH/20, TOTAL_HEIGHT/2, TOTAL_WIDTH*0.9);
        }

        if (this.gamePhase == GamePhase.SHOOT) {
            const shootTarget = new Vector2(this.mousePos.getX(), this.limit(this.mousePos.getY(), 0, TOTAL_HEIGHT - BLOCK_HEIGHT));
            this.level.drawLineFromStartPositionTo(shootTarget, this.context);
        }
    }

    private limit(n: number, min: number, max: number): number {
        return (n < min) ? (min): ((n > max) ? max : n);
    }

    public clicked(x: number, y: number): void {
        if (this.gamePhase == GamePhase.SHOOT) {
            const startPosition = this.level.getStartPosition();
            const posX = startPosition.getX();
            const posY = startPosition.getY();
            this.launchBall(posX, posY, x, this.limit(y, 0, TOTAL_HEIGHT - BLOCK_HEIGHT), MAX_BALLS);
            this.gamePhase = GamePhase.FLY;
            this.level.prepareNextShot();
        }
    }

    private launchBall(posX: number, posY: number, x: number, y: number, count: number): void {
        if (count > 0) {
            let vel: Vector2 = new Vector2(x - posX, y - posY);
            vel.clamp(BALLSPEED);
            this.level.addBall(new Ball(vel, posX, posY, 5, "gold"));
            this.nextBallLaunch = setTimeout(() => {
                this.launchBall(posX, posY, x, y, count - 1);
            }, 30);
        } else {
            this.nextBallLaunch = 0;
        }
    }

    public abortBalls() {
        if (this.gamePhase == GamePhase.FLY) {
            this.level.removeAllBalls();
            if (this.nextBallLaunch != 0) {
                clearTimeout(this.nextBallLaunch);
                this.nextBallLaunch = 0;
            }
        }
    }


}