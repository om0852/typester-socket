const io = require("socket.io")(3002, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})
let StartMatchUser = [];
const NonReadyUser = [];
const PlayingUser = [];
const OnlineUser = [];
const connectedClients = {}; // Store connected clients

obj = {}
io.on("connection", (socket) => {

    socket.on("userid", (id) => {
        console.log(socket.id)
        connectedClients[id] = socket.id;
        if (!OnlineUser.includes(id)) {
            OnlineUser.push(id);
            console.log(connectedClients)
            console.log("online match", OnlineUser)
        }
    })
    socket.on("startMatch", (id) => {
        if (OnlineUser.includes(id)) {
            if (!StartMatchUser.includes(id)) {
                StartMatchUser.push(id);
                console.log("start match", StartMatchUser)
                setTimeout(() => {
                    console.log("run")
                    // socket.emit("sucessfully", "om");
                    checker(id);
                    console.log(PlayingUser, StartMatchUser)
                }, 1000)
            }
        }
    })

    socket.on("PlayingUser", (id) => {
        if (StartMatchUser.includes(id)) {
            if (!PlayingUser.includes(id)) {
                PlayingUser.push(id);
                console.log("start match", PlayingUser)

            }
        }
    })

    socket.on("callResult", (data) => {
        ResultCalculator(data)
    })
})




function checker(id) {
    for (let i = 0; i < StartMatchUser.length; i++) {
        if (StartMatchUser[i] !== id) {
            const player1 = id;
            const player2 = StartMatchUser[i];
            PlayingUser.push({ player1, player2 });
            console.log(connectedClients[StartMatchUser[i]]);

            io.to(connectedClients[player1]).emit('matchfound', { player1, player2 });
            io.to(connectedClients[player2]).emit('matchfound', { player1, player2 });

            // Remove players from StartMatchUser array
            StartMatchUser = StartMatchUser.filter(userId => userId !== player1 && userId !== player2);
        }
    }
}
function ResultCalculator(data) {
    let playerPoint1 = 0;
    let playerPoint2 = 0;
    const player1 = data.player1;
    const player2 = data.player2;
    if (player1.char > player2.char) {
        playerPoint1++;
    }
    else if (player2.char > player1.char) {
        playerPoint2++;

    }
    else {

    }
    if (player1.word > player2.word) {
        playerPoint1++;
    }
    else if (player2.word > player1.word) {
        playerPoint2++;

    }
    else {

    }
    if (player1.acc > player2.acc) {
        playerPoint1++;
    }
    else if (player2.acc > player1.acc) {
        playerPoint2++;

    }
    else {

    }
    if (playerPoint1 > playerPoint2) {
        io.to(connectedClients[player1.id]).emit('result', "player1 win");
        io.to(connectedClients[player2.id]).emit('result', "player1 win");

    }
    else if (playerPoint2 > playerPoint1) {
        io.to(connectedClients[player1.id]).emit('result', "player2 win");
        io.to(connectedClients[player2.id]).emit('result', "player2 win");

    }
    else {
        io.to(connectedClients[player1.id]).emit('result', "draw");
        io.to(connectedClients[player2.id]).emit('result', "draw");

    }
}