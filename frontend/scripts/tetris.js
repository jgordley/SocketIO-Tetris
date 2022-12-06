const mainGame = document.getElementById('mainGame');
const ctx = mainGame.getContext('2d');

const opponentGame = document.getElementById('opponentGame');
const octx = opponentGame.getContext('2d');

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 30;

const COLORS = ['#fc5c65', '#fd9644', '#fed330', '#26de81', '#2bcbba', '#45aaf2', '#a55eea', '#4b7bec'];

// Calculate size of canvas from constants.
ctx.canvas.width = COLS * BLOCK_SIZE;
ctx.canvas.height = ROWS * BLOCK_SIZE;

octx.canvas.width = COLS * BLOCK_SIZE;
octx.canvas.height = ROWS * BLOCK_SIZE;

// Scale blocks
ctx.scale(BLOCK_SIZE, BLOCK_SIZE);
octx.scale(BLOCK_SIZE, BLOCK_SIZE);