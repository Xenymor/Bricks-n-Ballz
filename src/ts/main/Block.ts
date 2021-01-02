class Block {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private color: string;
    private lives: number;

    constructor(x: number, y: number, width: number, height: number, color: string, lives: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.lives = lives;
    }

    public collideBall(ball: Ball): void {
        const x = ball.getPos().getX();
        const y = ball.getPos().getY();
        const radius = ball.getRadius();

        const deltaX: number = x - Math.max(this.x, Math.min(x, this.x + this.width));
        const deltaY: number = y - Math.max(this.y, Math.min(y, this.y + this.height));

        const collides = (deltaX * deltaX + deltaY * deltaY) < (radius * radius);
        if (collides) {
            if (x <= this.x + this.width && x >= this.x) {
                ball.negateYVel();
            } else if (y <= this.y + this.height && y >= this.y) {
                ball.negateXVel();
            } else {
                ball.negateXVel();
                ball.negateYVel();
            }
            this.subLives(1);
        }
    }


    public isTouchingBall(ball: Ball): boolean {
        return this.isTouching(ball.getPos().getX(), ball.getPos().getY(), ball.getRadius());
    }

    public isTouching(x: number, y: number, radius: number): boolean {
        const deltaX: number = x - Math.max(this.x, Math.min(x, this.x + this.width));
        const deltaY: number = y - Math.max(this.y, Math.min(y, this.y + this.height));
        return (deltaX * deltaX + deltaY * deltaY) < (radius * radius);
    }

    public getX(): number {
        return this.x;
    }

    public getY(): number {
        return this.y;
    }

    public getWidth(): number {
        return this.width;
    }

    public getHeight(): number {
        return this.height;
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.color;
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
    }

    public subLives(toSub: number): void {
        this.lives -= toSub;
    }

    public setLives(lives: number) {
        this.lives = lives;
    }

    public getLives(): number {
        return this.lives;
    }
}