class Board {

    piece;
    grid;
    ctx;

    // Reset the board when we start a new game.
    reset(ctx) {
        this.ctx = ctx;
        this.grid = this.getEmptyBoard();
    }

    drawBoard() {
        // Loop through each grid element and draw in the proper color
        this.grid.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.ctx.fillStyle = COLORS[value];
                    this.ctx.fillRect(x, y, 1, 1);
                }
            });
        });
    }

    checkRows() {
        let fullRows = [];
        let isFull = true;
        this.grid.forEach((row, y) => {
            isFull= true;
            row.forEach((value, x) => {
                if (value <= 0) {
                    isFull = false;
                }
            });
            if(isFull) {
                fullRows.push(y);
            }
        });

        return fullRows;
    }

    clearRows(fullRows) {
        fullRows.forEach( (row) => {
            let counter = row;
            while(counter > 0) {
                for(let i = 0; i < this.grid[counter].length; i++) {
                    // i is x 
                    // counter is row number
                    this.grid[counter][i] = this.grid[counter - 1][i];
                }
                counter--;
            }
        })
    }

    validMove(newX, newY) {
        let valid = true;
        this.piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {

                // Check for a value in the shape
                if (!value) {
                    return;
                }

                // Check if we have gone out of bounds in X
                if (newX + x < 0 || newX + x >= COLS) {
                    valid = false;
                    return;
                }

                // Check if we have gone out of bounds in Y
                if (newY + y >= ROWS) {
                    valid = false;
                    console.log('out of bounds Y')
                    return;
                }

                // Check if there is something at new location
                if (value > 0 && this.grid[newY + y][newX + x] > 0) {
                    valid = false;
                    return;
                }
            });
        })

        return valid;
    }

    freeze() {
        this.piece.shape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value > 0) {
                    this.grid[this.piece.y + y][this.piece.x + x] = value;
                }
            });
        })
    }

    movePiece(direction) {

        let newX = this.piece.x;
        let newY = this.piece.y;

        // Left key
        if (direction == 37) {
            newX = newX - 1;
        }

        // Up
        else if (direction == 38) {
            this.piece.shape = this.rotate(this.piece);
        }

        // Right
        else if (direction == 39) {
            newX = newX + 1;
        }

        // Down
        else if (direction == 40) {
            newY = newY + 1;
        }

        if (this.validMove(newX, newY)) {
            this.piece.x = newX;
            this.piece.y = newY;
        }
    }

    rotate(piece) {
        // Clone with JSON for immutability.
        let p = JSON.parse(JSON.stringify(piece));

        // Transpose matrix
        for (let y = 0; y < p.shape.length; ++y) {
            for (let x = 0; x < y; ++x) {
                [p.shape[x][y], p.shape[y][x]] = [p.shape[y][x], p.shape[x][y]];
            }
        }

        // Reverse the order of the columns.
        p.shape.forEach(row => row.reverse());
        return p.shape;
    }

    // Get matrix filled with zeros.
    getEmptyBoard() {
        return Array.from(
            { length: ROWS }, () => Array(COLS).fill(0)
        );
    }
}