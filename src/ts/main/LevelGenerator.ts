const MIN_CHAR_VAL = "1".charCodeAt(0);
const MAX_CHAR_VAL = "9".charCodeAt(0);
const BLOCK_WIDTH = 16;
const BLOCK_HEIGHT = 16;

class LevelGenerator {

        constructor() {
    }

    public parse(lines: string[]): Level {
        const level = new Level();

        lines.forEach((line, j) => {
            for (let i=0; i<line.length; i++) {
                let value = line.charCodeAt(i);
                if (value < MIN_CHAR_VAL || value > MAX_CHAR_VAL) {
                    value = 0;
                } else {
                    value -= MIN_CHAR_VAL;
                }
                let x = i * BLOCK_WIDTH;
                let y = j * BLOCK_HEIGHT;
                let block = new Block(x, y, BLOCK_WIDTH, BLOCK_HEIGHT, "#E99", value * 10);
                level.addBlock(block);
            }
        });

        return level;
    }
}