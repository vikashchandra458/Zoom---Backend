const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {});
const { v4: uuidv4 } = require("uuid");
const { ExpressPeerServer } = require("peer");
var bodyParser = require("body-parser");
var cors = require("cors");
app.use(cors());
const peerServer = ExpressPeerServer(server, {
  debug: true,
});
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());
app.set("view engine", "ejs"); // to use ejs
app.use(express.static("public")); // to use scripts
app.use("/peerjs", peerServer);

app.get("/", (req, res) => {
  res.render("homepage", { uuid: uuidv4() });
});
app.post("/:room", (req, res) => {
  if (req.body.fragment) {
    res.render("room", {
      roomId: req.params.room,
      userName: req.body.fragment,
    });
  } else {
    res.redirect("/");
  }
});
app.get('*', function(req, res) {
  res.redirect('/');
});

io.on("connection", (socket) => {
  socket.on("join-room", (roomId, userId, userName) => {
    socket.join(roomId);

    socket.broadcast.to(roomId).emit("user-connected", userId);
    socket.on("message", (message, name) => {
      socket.broadcast.to(roomId).emit("createMessage", message, name);
    });

    socket.on("disconnect", function () {
      io.to(roomId).emit("disconnectUser", userName);
    });
  });
});
server.listen(process.env.PORT || 3000, () => {
  console.log(`Server listening on port ${process.env.PORT || 3030}`);
});
