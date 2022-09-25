const { io } = require("socket.io-client");
const myArgs = process.argv.slice(2);
const socket = io('http://localhost:3000');
socket.on("connect", () => {
    socket.emit("notify", myArgs[0].toString())    
    socket.close()
  });

