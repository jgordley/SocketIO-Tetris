const { Server } = require('socket.io');

const port = 3000;

let roomCodeMap = {};

const io = new Server({
    cors: {
        origin: '*',
    }
});

// Create new 4 digit code
function GenerateNewRoomId() {
    const letters = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    let new_room_id = "";
    let randint = 0;

    for(let i=0; i<4; i++) {
        randint = Math.floor(Math.random() * 25);
        new_room_id = new_room_id + letters[randint];
    }

    return new_room_id;
}

io.on('connection', (socket) => {
    console.log(socket.id);

    // Create room event
    socket.on('createRoom', () => {
        console.log(socket.id, 'is requesting to create a room');

        // Generate new room id until we get unique one
        let newCode = GenerateNewRoomId();
        while(io.sockets.adapter.rooms.get(newCode)) {
            newCode = GenerateNewRoomId();
        }
        console.log('Creating new room with code', newCode);

        socket.join(newCode);
        roomCodeMap[socket.id] = newCode;

        io.to(newCode).emit('roomCreated', newCode);
    });

    // Join room event
    socket.on('joinRoom', (code) => {
        console.log(socket.id, 'is requesting to join room', code);

        // Join room if code exists, otherwise alert that there was an invalid code
        if(io.sockets.adapter.rooms.get(code)) {
            console.log(socket.id, 'joined room', code, ' and the game will begin');
            socket.join(code);
            roomCodeMap[socket.id] = code;
            io.to(code).emit('startGame');
        } else {
            console.log(socket.id, 'was alerted that room', code, 'does not exist');
            io.to(socket.id).emit('invalidCode');
        }
    });

    // Update and send board to other player
    socket.on('gameUpdate', (grid, piece, score, lines, speed) => {
        console.log('Received board from', socket.id, 'and sending to room', roomCodeMap[socket.id]);

        // Send board to room (with other player in it)
        socket.to(roomCodeMap[socket.id]).emit('gameUpdate', grid, piece, score, lines, speed);
    })
});

io.listen(process.env.PORT || port);