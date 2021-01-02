class GameLoop {

    constructor(private level: Level, private context: CanvasRenderingContext2D) {
        this.initIntervall();
    }

    private initIntervall(): void {
        setInterval(() => {
            this.level.move(1/100);
        }, 10);
    }


}