const { Server } = require("socket.io");

const io = new Server({ /* options */ });
var users = [];

io.on("connection", (socket) => {
    users.push({        
        id: socket.id,
        socket: socket,
        userName: "unknow"     
    })
    
    notifyAll(socket)
    disconect(socket)
    getUsers(socket)    
    sendToUser(socket)
    socket.on("getUsers", msg => {
        socket.emit("getUsers", users.map(a => {
            return {id: a.id, userName: a.userName}
         })) 
    })
    socket.on("setUser", name => {
        let index = users.map(u => u.id).indexOf(socket.id)
        users[index].userName = name;
        showTable()
        getUsers(socket) 
    })
});

function showTable() {
    console.table(users.map(a => {
        return {id: a.id, userName: a.userName}
     }))
}

function notifyAll(socket) {
    socket.on("notify", msg => {
        socket.broadcast.emit("notify", msg)
    })
}

function getUsers(socket) {  
    socket.broadcast.emit("getUsers", users.map(a => {
        return {id: a.id, userName: a.userName}
     })) 
}

function disconect(socket) {
    socket.on("disconnect", () => {        
        let index = users.map(u => u.id).indexOf(socket.id)
        users.splice(index, 1)
        showTable()    
        getUsers(socket)    
    });
}
function sendToUser(socket) {
    socket.on("sendToUser", data => {
        console.log("sendToUser")
        let index = users.map(u => u.id).indexOf(data.id)
        users[index].socket.emit("notifyFromUser", 
            {
                msg:data.msg,
                from: socket.id
            })
    })
}

io.listen(3000);