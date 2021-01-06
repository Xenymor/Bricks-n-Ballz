class Ball {
    private velocity: Vector2;
    private pos: Vector2;
    private lastPos: Vector2;
    private radius: number;
    private color: string;

    constructor(velocity: Vector2, x: number, y: number, radius: number, color: string) {
        this.velocity = velocity;
        this.pos = new Vector2(x, y);
        this.lastPos = new Vector2(x, y);
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
        this.lastPos.copyFrom(this.pos);
        this.pos.add(this.velocity.getX() * ratio, this.velocity.getY() * ratio);
    }

    public moveBack(): void {
        this.pos.copyFrom(this.lastPos);
    }

    /**
     *  returns true if this needs to be removed, because it left the box at the bottom.
     */
    public collideBox(minX: number, minY: number, maxX: number, maxY: number): boolean {
        const x = this.pos.getX();
        const y = this.pos.getY();
        const velX = this.velocity.getX();
        const velY = this.velocity.getY();
        if ((x < minX && velX < 0) || (x > maxX && velX > 0)) {
            this.negateXVel();
        }
        if (y < minY && velY < 0) {
            this.negateYVel();
        }
        if (y > maxY && velY > 0) {
            return true;
        }
        return false;
    }
}