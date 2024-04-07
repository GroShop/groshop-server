import { Server } from "socket.io";
const { instrument } = require("@socket.io/admin-ui");
// @ts-ignore
import { sendPushNotification } from "./helpers/push.helper";
const socket = server => {
  const io = new Server(server, {
    cors: {
      origin: "*",
      // credentials: true
    },
  });
  instrument(io, {
    auth: false,
    mode: "development",
  });

  io.on("connection", socket => {
    socket.on("setup", userData => {
      console.log("connected", userData);
      socket.join(userData);
      socket.emit("connected");
    });
    // socket.on("join-room", (chatID: any) => {
    //   socket.join(chatID);
    //   console.log("joined", chatID);
    // });
    socket.on("senderMessage", newMessageRecieved => {
      var chat = newMessageRecieved.chat;
      if (!chat.users) return console.log("chat.users not defined");
      chat.users.forEach(user => {
        // console.log('user',user);
        if (user._id === newMessageRecieved.sender) return;
        let notificationData = {
          token: user.notification_token,
          title: "Farmer Shop",
          body: newMessageRecieved.content,
          image: "",
        };
        sendPushNotification(notificationData);
        socket.to(user._id).emit("receiveMessage", newMessageRecieved);
      });
    });
    socket.off("setup", () => {
      console.log("USER DISCONNECTED");
      // socket.leave(userData);
    });
  });
};

export default socket;
