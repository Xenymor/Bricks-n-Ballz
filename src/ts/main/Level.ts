const FINE_GRAIN = 10;
const LINE_WIDTH = 5;

class Level {
    private blocks: Block[] = [];
    private balls: Ball[] = [];
    private isFirstBall:boolean = false;
    private startPosition:Vector2 = new Vector2(TOTAL_WIDTH/2, TOTAL_HEIGHT);

    public getIsFirstBall():Boolean {
        return this.isFirstBall;
    }

    public getStartPosition() :Vector2 {
        return this.startPosition;
    }

    public prepareNextShot() {
        this.isFirstBall = true;
    }

    public setIsFirstBall(isFirstBall:boolean): void {
        this.isFirstBall = isFirstBall;
    }


    constructor() {
    }

    public drawLineFromStartPositionTo(pos:Vector2, context:CanvasRenderingContext2D) :void {
        context.beginPath();
        context.strokeStyle = "gold";
        context.lineWidth = LINE_WIDTH;
        context.moveTo(this.startPosition.getX(), this.startPosition.getY());
        context.lineTo(pos.getX(), pos.getY());
        context.stroke();
    }

    public addBlock(block: Block): void {
        this.blocks.push(block);
        this.blocks.sort((a, b) => a.getX() - b.getX());
    }

    public removeBall(ball: Ball) {
        const index = this.balls.indexOf(ball);
        this.balls.splice(index, 1);
    }

    public hasBlocksLeft(): boolean {
        let count = 0;
        this.blocks.forEach((b) => {count++});
        return count > 0;
    }

    public addBall(ball: Ball): void {
        this.balls.push(ball);
        this.balls.sort((a, b) => a.getPos().getX() - b.getPos().getX());
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.blocks.forEach((block) => block.draw(context));
        this.balls.forEach((ball) => ball.draw(context));
    }

    public move(ratio: number): void {
        for (let i = 0; i < FINE_GRAIN; i++) {
            this.balls.forEach((ball) => {
                ball.move(ratio / FINE_GRAIN);
            });
            this.checkCollision();
        }
    }

    private checkCollision() {
        let indexes: List<number> = new List();
        this.balls.forEach((ball) => {
            this.collideWithBlocks(ball, indexes);
            this.collideWithWalls(ball);
        });

        for (let i: number = indexes.size() - 1; i >= 0; i--) {
            delete this.blocks[indexes.get(i)];
        }
    }

    private collideWithWalls(ball: Ball) {
        let mustBeRemoved = ball.collideBox(0, 0, TOTAL_WIDTH, TOTAL_HEIGHT);
        if (mustBeRemoved) {
            if (this.isFirstBall) {
                this.startPosition.copyFrom(ball.getPos());
                this.isFirstBall = false;
            }
            this.removeBall(ball);
        }
    }

    private collideWithBlocks(ball: Ball, indexes: List<number>) {
        let nearesDistance: number = Number.MAX_VALUE;
        let nearestIndex = -1;
        this.blocks.forEach((block, index) => {
            if (block.isTouchingBall(ball)) {
                if (new Vector2(block.getX(), block.getY()).distance(ball.getPos()) < nearesDistance) {
                    nearestIndex = index;
                }
            }
        });
        if (nearestIndex >= 0) {
            BALL_SOUND[ballSoundIndex].play();
            if (BALL_SOUND.length-1 > ballSoundIndex) {
                ballSoundIndex++;
            } else {
                ballSoundIndex = 0;
            }
            const blockHit = this.blocks[nearestIndex];
            blockHit.collideBall(ball);
            if (blockHit.getLives() <= 0) {
                indexes.add(nearestIndex);
            }
        }
    }

    public moveBlocksDown() {
        this.blocks.forEach((block) => {
            block.setY(block.getY() + BLOCK_HEIGHT);
        })
    }

    public hasBallsFlying(): boolean {
        return this.balls.length > 0;
    }

    public hasBlocksBelow(yPos: number) {
        for (let i=0; i<this.blocks.length; i++) {
            let block = this.blocks[i];
            if (block && block.getY() + BLOCK_HEIGHT > yPos) {
                return true;
            }
        }
        return false;
    }

}