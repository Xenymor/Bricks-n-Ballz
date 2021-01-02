class Ball {
    private velocity: Vector2;
    private pos: Vector2;
    private radius: number;
    private color: string;

    constructor(velocity: Vector2, x: number, y: number, radius: number, color: string) {
        this.velocity = velocity;
        this.pos = new Vector2(x, y);
        this.radius = radius;
        this.color = color;
    }

    public getVelocity(): Vector2 {
        return this.velocity;
    }

    public setVelocity(x: number, y: number): void {
        this.velocity = new Vector2(x, y);
    }

    public getPos(): Vector2 {
        return this.pos;
    }

    public setPos(x: number, y: number): void {
        this.pos = new Vector2(x, y);
    }

    public getRadius(): number {
        return this.radius;
    }

    public setRadius(radius: number): void {
        this.radius = radius;
    }

    public draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.color;
        context.beginPath();
        context.ellipse(this.pos.getX(), this.pos.getY(), this.radius, this.radius, 0, 0, 2 * Math.PI);
        context.fill();
    }

    negateXVel(): void {
        this.velocity.setX(-this.velocity.getX());
    }

    negateYVel(): void {
        this.velocity.setY(-this.velocity.getY());
    }

    public move(ratio: number): void {
        this.pos.add(this.velocity.getX() * ratio, this.velocity.getY() * ratio);
        console.log(this.pos.getX());
    }
}