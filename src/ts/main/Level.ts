class Level {

    private blocks: Block[] = [];
    private balls: Ball[] = [];

    constructor() {
    }

    public addBlock(block: Block): void {
        this.blocks.push(block);
        this.blocks.sort((a, b) => a.getX() - b.getX());
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
        this.balls.forEach((ball) => {
            ball.move(ratio);
        });
        this.checkCollision();
    }

    private checkCollision() {
        let indexes: List<number> = new List();
        this.balls.forEach((ball) => {
            this.blocks.forEach((block) => {
                block.collideBall(ball);
                if (block.getLives() <= 0) {
                    indexes.add(this.blocks.indexOf(block));
                }
            });
        });
        for (let i:number = indexes.size(); i > 0; i--) {
            this.blocks.slice(indexes.get(i)+1)
        }
    }

}