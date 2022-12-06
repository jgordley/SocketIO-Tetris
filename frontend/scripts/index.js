// Client code for M&P Tetris Frontend
// Jack Gordley
// Initialize socket.io app
const socket = io('https://whispering-cliffs-66614.herokuapp.com/');

// Getting webpage elements
const homeScreen = document.getElementById('homeScreen');
const waitingScreen = document.getElementById('waitingScreen');
const gameScreen = document.getElementById('gameScreen');
const createRoomButton = document.getElementById('createRoomButton');
const joinRoomButton = document.getElementById('joinRoomButton');
const roomText = document.getElementById('roomText');
const roomCodeText = document.getElementById('roomCodeText');

// Score displays
const oScore = document.getElementById('oScore');
const oLines = document.getElementById('oLines');
const oSpeed = document.getElementById('oSpeed');
const dScore = document.getElementById('dScore');
const dLines = document.getElementById('dLines');
const dSpeed = document.getElementById('dSpeed');

const speeds = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1];

// Registering listeners for button events
createRoomButton.addEventListener('click', handleCreateRoom);
joinRoomButton.addEventListener('click', handleJoinRoom);

// Registering listeners for socket events
socket.on('startGame', handleStartGame);
socket.on('roomCreated', handleRoomCreated);
socket.on('invalidCode', handleInvalidCode);
socket.on('gameUpdate', updateOpponentBoard);

// Getting game components
const mainGame = document.getElementById('mainGame');
const ctx = mainGame.getContext('2d');

const opponentGame = document.getElementById('opponentGame');
const octx = opponentGame.getContext('2d');

const nextPieceDisplay = document.getElementById('next');
const nctx = nextPieceDisplay.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

// Calculate size of canvas from constants.
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

octx.canvas.width = COLS * BLOCK_SIZE;
octx.canvas.height = ROWS * BLOCK_SIZE;

nctx.canvas.width = 4 * BLOCK_SIZE;
nctx.canvas.height = 4 * BLOCK_SIZE;

// Scale blocks
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
octx.scale(BLOCK_SIZE, BLOCK_SIZE);
nctx.scale(BLOCK_SIZE, BLOCK_SIZE);

// For keeping track of game logic
let intervalId;
let speed = 1;
let score = 0;
let gameOver = false;
let lines = 0;
let distanceFallen = 0;
let lineCounter = 0;
let nextPiece;
let board = new Board();
let opponentBoard = new Board();

// Create a new room
function handleCreateRoom() {
    console.log('Requesting to create a room');
    socket.emit('createRoom');
}

// Joining a room from the front page
function handleJoinRoom() {
    let code = roomText.value;
    console.log('Attempting to join room with code:', code);
    socket.emit('joinRoom', code);
}

// Handling invalid room code
function handleInvalidCode() {
    alert('Invalid room code!');
}

// Once a rooom is created this displays the code
function handleRoomCreated(roomCode) {
    console.log('Room was created with code:', roomCode);

    roomCodeText.innerHTML = 'Room code: ' + roomCode;
    waitingScreen.style.display = 'block';
    homeScreen.style.display = 'none';
    homeScreen.style.visibility = 'hidden';
    waitingScreen.style.visibility = 'visible';
}

// Starting game once two players have joined a room
function handleStartGame() {
    homeScreen.style.visibility = 'hidden';
    homeScreen.style.display = 'none';
    waitingScreen.style.visibility = 'hidden';
    waitingScreen.style.display = 'none';
    gameScreen.style.visibility = 'visible';

    speed = 1;
    play();

    console.log('Starting game!');
}

function play() {
    board.reset(ctx);
    opponentBoard.reset(octx);
    let piece = new Piece(ctx);
    nextPiece = new Piece(ctx);
    piece.draw();

    intervalId = setInterval(fall, 1000 * speeds[speed - 1]);

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

function updateOpponentBoard(grid, piece, oscore, olines, ospeed) {
    opponentBoard.grid = grid;
    opponentBoard.piece = new Piece(octx);
    opponentBoard.piece.x = piece.x;
    opponentBoard.piece.y = piece.y;
    opponentBoard.piece.colorId = piece.colorId;
    opponentBoard.piece.shape = piece.shape;
    opponentBoard.piece.ctx = octx;
    octx.clearRect(0, 0, octx.canvas.width, ctx.canvas.height);
    opponentBoard.piece.draw();
    opponentBoard.drawBoard();

    // Set inner html of score and lines and speed to the values
    oScore.textContent = oscore;
    oLines.textContent = olines;
    oSpeed.textContent = ospeed;
}

function fall() {
    if (!gameOver) {
        socket.emit('gameUpdate', board.grid, board.piece, score, lines, speed);

        let checkMove = board.validMove(board.piece.x, board.piece.y + 1);
        if (checkMove) {

            board.piece.y = board.piece.y + 1;
            distanceFallen += 1;

        } else {
            if (distanceFallen < 1) {
                clearInterval(intervalId);
                gameOver = true;
                alert('Game Over!');
                return;
            }
            board.freeze();
            let fullRows = board.checkRows();
            if (fullRows) {
                console.log(score, lines, speed);
                score += fullRows.length * speed;
                lines += fullRows.length;
                lineCounter += fullRows.length;
                if (lineCounter >= 1) {
                    lineCounter = 0;
                    speed += 1;
                    clearInterval(intervalId);
                    intervalId = setInterval(fall, 1000 * speeds[speed - 1]);
                }
                board.clearRows(fullRows);
            }

            board.piece = nextPiece;
            nextPiece = new Piece(ctx);
            distanceFallen = 0;
            dScore.textContent = score;
            dLines.textContent = lines;
            dSpeed.textContent = speed;
            updateNextPiece();
        }

        updateBoard();
    }
}

function updateNextPiece() {
    nctx.fillStyle = COLORS[nextPiece.colorId];
    nctx.clearRect(0, 0, nctx.canvas.width, nctx.canvas.height);
    console.log('Updating next piece');
    console.log(COLORS[nextPiece.colorId]);
    console.log(nextPiece.shape);
    nextPiece.shape.forEach((row, y) => {
        row.forEach((value, x) => {
            if (value > 0) {
                nctx.fillRect(x, y, 1, 1);
            }
        });
    });
}

function keydown(e) {
    e.preventDefault();

    board.movePiece(e.keyCode);
    updateBoard();
}