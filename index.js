import { Server } from "socket.io";
console.log("server started")

const io = new Server({cors:"http://localhost:3000"});

let onlineUsers = []

io.on("connection", (socket) => {


  socket.on("addNewUser",(userId) => {
    !onlineUsers.some(user=>user.userId === userId) &&
    onlineUsers.push({
      userId:userId,
      socketId:socket.id
    })
    io.emit("getOnlineUsers",onlineUsers)
  })

  socket.on("sendMessage",(message)=>{
    const user = onlineUsers.find(user => user.userId === message.receiver)
    const sender = onlineUsers.find(user => user.userId === message.senderId)
    if(user){
      io.to(user.socketId).emit("getMessage",message)
    }
    if(user){
      io.to(user.socketId).emit("getMessagePre",message)
    }
    if(sender){
      io.to(sender.socketId).emit("getMessagePre",message)
    }
    
  })

  socket.on("disconnect",()=>{
    onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
    io.emit("getOnlineUsers",onlineUsers)
  })
  
});



io.listen(5173);