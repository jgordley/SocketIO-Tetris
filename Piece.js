class Piece {
    constructor(ctx) {
        this.ctx = ctx;
        this.colorId = Math.floor(Math.random() * COLORS.length);
        this.shape = this.randomShape(this.colorId);

        // Starting position.
        this.x = 3;
        this.y = 0;
    }

    randomShape(colorId) {
        let shapes = [
            [[0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]],

            [[0, 0, 0, 0],
            [1, 1, 1, 1],
            [0, 0, 0, 0],
            [0, 0, 0, 0]],

            [[0, 0, 0],
            [1, 1, 0],
            [1, 1, 0]],

            [[1, 0, 0],
            [1, 1, 0],
            [0, 1, 0]],

            [[0, 0, 1],
            [0, 1, 1],
            [0, 1, 0]],

            [[1, 0, 0],
            [1, 0, 0],
            [1, 1, 0]],

            [[1, 1, 0],
            [1, 0, 0],
            [1, 0, 0]],
        ];

        let randomShapeId = Math.floor(Math.random() * shapes.length);

        console.log(shapes[randomShapeId]);

        let randomShape = JSON.parse(JSON.stringify(shapes[randomShapeId]));
        console.log(randomShape);
        for (let i = 0; i < randomShape.length; i = i + 1) {
            for (let j = 0; j < randomShape[i].length; j = j + 1) {
                if (randomShape[i][j] > 0) {
                    randomShape[i][j] = randomShape[i][j] * colorId;
                }
            }
        }

        return randomShape;
    }

    draw() {
        this.ctx.fillStyle = COLORS[this.colorId];
        this.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                // this.x, this.y gives the left upper position of the shape
                // x, y gives the position of the block in the shape
                // this.x + x is then the position of the block on the board
                if (value > 0) {
                    this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
                }
            });
        });
    }
}