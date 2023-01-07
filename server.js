const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {});
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
const peerServer = ExpressPeerServer(server, {
  debug: true,
});

app.set("view engine", "ejs"); // to use ejs
app.use(express.static("public")); // to use scripts
app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  res.render("homepage", { uuid: uuidv4() });
  // res.redirect(`/${uuidv4()}`);
});
app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);

    socket.broadcast.to(roomId).emit("user-connected", userId);
    socket.on("message", (message) => {
      socket.broadcast.to(roomId).emit("createMessage", message);
      // io.to(roomId).emit("createMessage", message);
    });
  });
});
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3030}`);
});
