/*
    // Example for the use of Block
class Main {
    public static main(): void {
        const block = new Block(300, 300, 40, 40, "red", 100);
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
function start() {
    Main.main();
}
*/