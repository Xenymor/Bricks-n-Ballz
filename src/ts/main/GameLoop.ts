class GameLoop {

    constructor(private level: Level, private context: CanvasRenderingContext2D) {
        this.initIntervall();
    }

    private initIntervall(): void {
        setInterval(() => {
            this.context.clearRect(0, 0, 600, 600);
            this.level.draw(this.context);
            this.level.move(0.02);
            console.log("Hi");
        }, 20);
    }


}