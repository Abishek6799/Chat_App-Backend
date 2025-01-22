import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import connectDB from "./Database/dbconfig.js";
import router from "./Router/authRouter.js";
import msgRouter from "./Router/messageRouter.js";

dotenv.config();

const app = express();
const server = http.createServer(app); 
const io = new Server(server, {
  cors: {
      origin: "https://rainbow-chimera-925dab.netlify.app", // No trailing slash
      methods: ["GET", "POST"],
      credentials: true,
  },
});

app.use(cors());
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
    res.send("Welcome to the server");
});
app.use("/api/auth", router);
app.use("/api/message", msgRouter);


let userSockets = {};

io.on('connection', (socket) => {
  socket.on('register', (userId) => {
    if (userId) {
      userSockets[userId] = socket.id;
    }
  });

  socket.on('chat message', (message) => {
    const { receiverId } = message;
    const receiverSocket = userSockets[receiverId]; 
    if (receiverSocket) {
      io.to(receiverSocket).emit('chat message', message);
    }
  });

  socket.on('disconnect', () => {
    for (let userId in userSockets) {
      if (userSockets[userId] === socket.id) {
        delete userSockets[userId];
        break;
      }
    }
  });
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
    console.log(`Server is running`);
});
