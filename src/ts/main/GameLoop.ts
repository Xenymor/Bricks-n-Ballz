class GameLoop {

    constructor(private level: Level, private context: CanvasRenderingContext2D) {
        this.initIntervall();
    }

    private initIntervall(): void {
        setInterval(() => {
            this.level.draw(this.context);
            this.level.move(0.1);
            console.log("Hi");
        }, 10);
    }


}