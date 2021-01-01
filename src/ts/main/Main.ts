/**
class Main {
    Example for the use of Block
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
    }
    
}
Main.main();
*/