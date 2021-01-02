class Level {

    private blocks: Block[] = [];
    private balls: Ball[] = [];

    constructor() {
    }

    public addBlock(block: Block): void {
        this.blocks.push(block);
        this.blocks.sort((a,b) => a.getX() - b.getX());
    }

    public addBall(ball: Ball): void {
        this.balls.push(ball);
        this.balls.sort((a,b) => a.getPos().getX() - b.getPos().getX());
    }

    public draw(context: CanvasRenderingContext2D): void {
        this.blocks.forEach((block) => block.draw(context));
    }

}