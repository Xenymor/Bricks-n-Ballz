class Ball {
    private velocity: Vector2;
    private pos: Vector2;
    private radius: number;

    public getVelocity(): Vector2 {
        return this.velocity;
    }

    public setVelocity(x: number, y: number): void {
        this.velocity = new Vector2(x, y);
    }

    public getPos(): Vector2 {
        return this.pos;
    }

    public setPos(x:number, y:number): void {
        this.pos = new Vector2(x, y);
    }

    public getRadius(): number {
        return this.radius;
    }

    public setRadius(radius: number): void {
        this.radius = radius;
    }

    constructor(velocity: Vector2, x: number, y: number, radius: number) {
        this.velocity = velocity;
        this.pos = new Vector2(x, y);
        this.radius = radius;
    }
}