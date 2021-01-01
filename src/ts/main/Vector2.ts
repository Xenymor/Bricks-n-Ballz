class Vector2 {
    private x: number;
    private y: number;

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
    public mult(multWith:number) {
        this.x *= multWith;
        this.y *= multWith;
    }
}