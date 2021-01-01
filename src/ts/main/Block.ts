class Block {
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private color: string;

    constructor(x: number, y: number, width: number, height: number, color:string) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
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

    public draw(context:CanvasRenderingContext2D): void {
        context.fillStyle = this.color;
        context.fillRect(this.x, this.y, this.width, this.height);
    }
}