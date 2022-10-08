const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');

// Calculate size of canvas from constants.
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

// Scale blocks
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);

let board = new Board();
let intervalId;

function play() {
    board.reset(ctx);
    let piece = new Piece(ctx);
    piece.draw();

    intervalId = setInterval(fall, 1000);

    document.addEventListener('keydown', keydown);
    board.piece = piece;
}

function updateBoard() {

    // Clear the board
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // Draw the new piece position
    board.piece.draw();

    // Draw the rest of the board
    board.drawBoard();
}

function fall() {

    console.log('falling');
        
    if(board.validMove(board.piece.x, board.piece.y + 1)) {

        board.piece.y = board.piece.y + 1;

    } else {
        board.freeze();
        let fullRows = board.checkRows();
        board.clearRows(fullRows);
        board.piece = new Piece(ctx);
    }

    updateBoard();
}

function keydown(e) {
    e.preventDefault();

    board.movePiece(e.keyCode);
    updateBoard();
}