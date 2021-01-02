const MIN_CHAR_VAL = "1".charCodeAt(0);
const MAX_CHAR_VAL = "9".charCodeAt(0);
const BLOCK_WIDTH = 30;
const BLOCK_HEIGHT = 30;
const blockColors = ["darkgreen", "green", "lightgreen", "goldenrod", "gold", "yellow",  "orange", "orangered", "FireBrick", "red", "red"];

class LevelGenerator {

    private levelCount = 0;

    constructor(private levelData: string[][]) {
    }

    public reset(): void {
        this.levelCount = 0;
    }
    public hasNext(): boolean {
        return this.levelCount < this.levelData.length;
    }

    public getNextLevel(): Level {
        let lines = this.levelData[this.levelCount++];
        const level = new Level();

        lines.forEach((line, j) => {
            for (let i=0; i<line.length; i++) {
                let value = line.charCodeAt(i);
                if (value < MIN_CHAR_VAL || value > MAX_CHAR_VAL) {
                    value = 0;
                } else {
                    value -= MIN_CHAR_VAL - 1;
                }
                if (value > 0) {
                    let x = i * BLOCK_WIDTH;
                    let y = j * BLOCK_HEIGHT;
                    let block = new Block(x, y, BLOCK_WIDTH, BLOCK_HEIGHT, blockColors[value], value * 10);
                    level.addBlock(block);
                }
            }
        });

        return level;
    }
}