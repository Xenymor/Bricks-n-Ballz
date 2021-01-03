enum GamePhase {
    SHOOT,
    FLY,
    GAME_OVER,
    WON,
}

class GameLoop {

    private maxBalls = 50;
    private level: Level;
    private gamePhase: GamePhase = GamePhase.SHOOT;
    private intervallHandle: number = -1;
    private startPos:Vector2 = new Vector2(600/2, 599);

    constructor(private levelGenerator: LevelGenerator, private context: CanvasRenderingContext2D) {
        this.level = levelGenerator.getNextLevel();
        this.initIntervall();
    }

    private initIntervall(): void {
        this.intervallHandle = setInterval(() => {
            this.mainLoop();
        }, 20);
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
                if (this.level.hasBlocksBelow(600 - BLOCK_HEIGHT + 1)) {
                    this.gamePhase = GamePhase.GAME_OVER;
                }
            }
        }

        // Draw
        this.context.clearRect(0, 0, 600, 600);
        this.level.draw(this.context);
        this.level.move(0.02);
    }

    public clicked(x:number, y:number): void {
        console.log("GamePhase: " + this.gamePhase);
        if (this.gamePhase == GamePhase.SHOOT) {
            const startPosition = this.level.getStartPosition();
            const posX = startPosition.getX();
            const posY = startPosition.getY();
            this.launchBall(posX, posY, x, y, this.maxBalls);
            this.gamePhase = GamePhase.FLY;
            this.level.prepareNextShot();
        }
    }

    private launchBall(posX: number, posY: number, x: number, y: number, count: number): void {
        if (count > 0) {
            let vel: Vector2 = new Vector2(x - posX, y - posY);
            vel.clamp(BALLSPEED);
            this.level.addBall(new Ball(vel, posX, posY, 5, "gold"));
            setTimeout(() => {
                this.launchBall(posX, posY, x, y, count - 1);
            }, 30);
        }
    }
}