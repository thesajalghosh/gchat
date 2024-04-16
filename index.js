const express = require("express");
const cors = require("cors");
const http = require("http");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));

app.get("/api/user", (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: "Successfully getting the api",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Successfully getting the error",
    });
  }
});

const server = http.createServer(app);
let users = [];
// const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log(`user just connected ${socket.id}`);

  socket.on("message", (data) => {
    io.emit("messageResponse", data);
  });
  socket.on("newUser", (data) => {
    console.log("this", data);
    users.push(data);

    io.emit("newUserResponse", users);
    console.log(users);
  });

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    users = users.filter((user) => user.socketID !== socket.id);

    io.emit("newUserResponse", users);
    socket.disconnect();
  });
});

server.listen(5000, () => {
  console.log("server is running on 5000");
});
