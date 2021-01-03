const BALLSPEED = 800;
const MIN_CHAR_VAL = "1".charCodeAt(0);
const MAX_CHAR_VAL = "9".charCodeAt(0);
const BLOCK_WIDTH = 30;
const BLOCK_HEIGHT = 30;
const BLOCK_COLUMNS = 11;
const BLOCK_ROWS = 15;
const TOTAL_WIDTH = BLOCK_WIDTH * BLOCK_COLUMNS;
const TOTAL_HEIGHT = BLOCK_HEIGHT * BLOCK_ROWS;
const blockColors = ["darkgreen", "green", "lightgreen", "goldenrod", "gold", "yellow",  "orange", "orangered", "FireBrick", "red", "red"];

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
    static game: GameLoop;
    public static main(): void {
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
        let context = canvas.getContext("2d") as CanvasRenderingContext2D;

        const levelGenerator = new LevelGenerator(levels);
        Main2.game = new GameLoop(levelGenerator, context);
    }
    public static canvasClicked(event: MouseEvent) {
        console.log("Hallo");
        const x = event.clientX;
        const y = event.clientY;
        console.log("Mouse position: " + x + ", " + y);
        Main2.game.clicked(x, y);
    }
}

function start() {
    Main2.main();
}
