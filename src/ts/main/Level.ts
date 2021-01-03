const FINE_GRAIN = 10;

class Level {
    private blocks: Block[] = [];
    private balls: Ball[] = [];

    constructor() {
    }

    public addBlock(block: Block): void {
        this.blocks.push(block);
        this.blocks.sort((a, b) => a.getX() - b.getX());
    }

    public removeBall(ball: Ball) {
        const len = this.balls.length;
        const index = this.balls.indexOf(ball);
        this.balls.splice(index, 1);
        const lenDiff = len - this.balls.length;
        if (lenDiff > 1) {
            console.log("!!!!!!!!!! Index = " + index + " / " + len + " / " + lenDiff + " / " + this.balls);
        }
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
            let nearestCollidingBlock:Block = new Block(Number.MAX_VALUE, Number.MAX_VALUE, 0, 0, "", 0);
            let nearesDistance:number = Number.MAX_VALUE;
            let nearestIndex = 0;
            this.blocks.forEach((block, index) => {
                if(block.isTouchingBall(ball)) {
                    if (new Vector2(block.getX(), block.getY()).distance(ball.getPos()) < nearesDistance) {
                        nearestCollidingBlock = block;
                        nearestIndex = index;
                    }
                }
            });
            nearestCollidingBlock.collideBall(ball);
            if (nearestCollidingBlock.getLives() <= 0) {
                indexes.add(nearestIndex);
            }
            this.blocks.forEach((block, index) => {
                if (block.getLives() <= 0) {
                    indexes.add(index);
                }
            });
            let mustBeRemoved = ball.collideBox(0, 0, 600, 600);
            if (mustBeRemoved) {
                this.removeBall(ball);
            }
        });
        for (let i: number = indexes.size() - 1; i >= 0; i--) {
            delete this.blocks[indexes.get(i)];
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