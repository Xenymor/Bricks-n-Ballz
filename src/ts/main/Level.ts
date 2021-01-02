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
        delete this.balls[this.balls.indexOf(ball)];
    }

    public hasBlocksLeft(): boolean {
        return this.blocks.length > 0;
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
            this.blocks.forEach((block, index) => {
                block.collideBall(ball);
                if (block.getLives() <= 0) {
                    indexes.add(index);
                }
            });
            ball.collideBox(0, 0, 600, 600);
        });
        for (let i: number = indexes.size() - 1; i >= 0; i--) {
            delete this.blocks[indexes.get(i)];
        }
    }

}