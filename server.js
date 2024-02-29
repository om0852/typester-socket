const io = require("socket.io")(3001, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
})
io.on("connection", (socket) => {
    console.log("user is connected")
    socket.on("userid", (id) => {
        console.log(message);
    })
})
console.log("hello om")
