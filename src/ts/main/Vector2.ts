class Vector2 {
    private x: number;
    private y: number;

    public copyFrom(other: Vector2): void {
        this.x = other.x;
        this.y = other.y;
    }

    public getX(): number {
        return this.x;
    }

    public setX(x: number): void {
        this.x = x;
    }

    public getY(): number {
        return this.y;
    }

    public setY(y: number): void {
        this.y = y;
    }

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    public add(x: number, y: number) {
        this.x += x;
        this.y += y;
    }
    public sub(x: number, y: number) {
        this.x -= x;
        this.y -= y;
    }
    public mult(multWith: number) {
        this.x *= multWith;
        this.y *= multWith;
    }
    public clamp(clamp: number): void {
        this.x = this.x * clamp / this.length();
        this.y = this.y * clamp / this.length();
    }
    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    public multVector(multwith: Vector2): number {
        return this.x * multwith.getX() + this.y * multwith.getY();
    }
}