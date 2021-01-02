const BALLSPEED = 400;
let magazinesize = 50;
/*
    ///**
class Main {
    // Example for the use of Block
class Main {
    public static main(): void {
        const block = new Block(300, 300, 20, 20, "red", 100);
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
        if (canvas != null) {
            const context = canvas.getContext("2d");
            if (context != null) {
                block.draw(context);
            } else {
                console.error("context == null");
            }
        }
        console.log(block.isTouching(310, 309, 1));
        block.subLives(10);
        console.log(block);
    }
     
}
Main.main();
*/
/*
    Example for Ball
class Main {
    public static main(): void {
        const block = new Block(280, 280, 40, 40, "red", 100);
        const ball = new Ball(new Vector2(0, -1), 300, 590, 10, "yellow");
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
        if (canvas != null) {
            const context = canvas.getContext("2d");
            if (context != null) {
                setInterval(() => {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                    block.draw(context);
                    ball.draw(context);
                    console.log(block.isTouching(ball.getPos().getX(), ball.getPos().getY(), ball.getRadius()));
                    ball.move();
                }, 20);
            } else {
                console.error("context == null");
            }
        }
    }
}
*/
// */

class Main2 {
    private static level:Level;
    public static main(): void {
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
        let context = canvas.getContext("2d") as CanvasRenderingContext2D;

        const levelGenerator = new LevelGenerator();
        this.level = levelGenerator.parse(levels[0]);
//        this.level.addBall(new Ball(new Vector2(-100, -100), 440, 600, 5, "gold"));
        this.level.draw(context);
        const game = new GameLoop(this.level, context);
    }
    public static canvasClicked(event: any) {
        console.log("Hallo");
        const x = event.clientX;
        const y = event.clientY;
        const posX = 300;
        const posY = 599;
        this.launchBall(posX, posY, x, y, magazinesize);
    }
    
    private static launchBall(posX: number, posY: number, x: number, y: number, count: number): void {
        let vel:Vector2 = new Vector2(x-posX, y-posY);
        vel.clamp(BALLSPEED);
        Main2.level.addBall(new Ball(vel, posX, posY, 5, "gold"));
        if (count > 0) {
            setTimeout(() => {
                this.launchBall(posX, posY, x, y, count-1);
            }, 100);
        }
    }
}

function start() {
    Main2.main();
}
