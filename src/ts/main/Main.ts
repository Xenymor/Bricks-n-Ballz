class Main {
    public static main(): void {
        const block = new Block(300, 300, 10, 10, "red");
        const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById("canvas");
        if (canvas != null) {
            const context = canvas.getContext("2d");
            if (context != null) {
                block.draw(context);
            } else {
                console.error("context == null");
            }
        }
    }
}
Main.main();