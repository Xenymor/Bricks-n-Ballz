enum GamePhase {
    SHOOT,
    FLY,
}

class GameLoop {

    private maxBalls = 50;
    private level: Level;
    private gamePhase: GamePhase = GamePhase.SHOOT;
    private intervallHandle: number = -1;

    constructor(private levelGenerator: LevelGenerator, private context: CanvasRenderingContext2D) {
        this.level = levelGenerator.getNextLevel();
        this.initIntervall();
    }

    private initIntervall(): void {
        this.intervallHandle = setInterval(() => {
            if (!this.level.hasBlocksLeft()) {
                if (this.levelGenerator.hasNext()) {
                    this.level = this.levelGenerator.getNextLevel();
                } else {
                    clearInterval(this.intervallHandle);
                }
            }

            this.context.clearRect(0, 0, 600, 600);
            this.level.draw(this.context);
            this.level.move(0.02);
/*            if (!this.level.hasBlocksLeft()) {
                this.level = new LevelGenerator();
            }*/
        }, 20);
    }

    public clicked(x:number, y:number): void {
        if (this.gamePhase == GamePhase.SHOOT) {
            const posX = 300;
            const posY = 599;
            this.launchBall(posX, posY, x, y, this.maxBalls);
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