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
    public subVector(v: Vector2) {
        this.x -= v.x;
        this.y -= v.y;
    }
    public addVector(v: Vector2) {
        this.x += v.x;
        this.y += v.y;
    }
    public mult(multWith: number) {
        this.x *= multWith;
        this.y *= multWith;
    }
    public clamp(clamp: number): void {
        const length:number = this.length();
        const x = (this.x / length) * clamp;
        const y = (this.y / length) * clamp;
        this.x = x;
        this.y = y;
    }
    public length(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    public multVector(multwith: Vector2): number {
        return this.x * multwith.getX() + this.y * multwith.getY();
    }
    public distance(other: Vector2): number {
        return Math.sqrt((this.x - other.x) * (this.x - other.x) + (this.y - other.y) * (this.y - other.y));
    }
}