import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
dotenv.config();
const port =
  process.env.MODE === "PROD"
    ? process.env.PORT
    : parseInt(process.env.PORT) + 1000 || 5555;
import express from "express";
import { bootstrap } from "./src/index.router.js";
// import { Server } from "socket.io"
import { initIo, socketAuth } from "./src/utils/socket_server.js";
// import { Server } from "socket.io";
const app = express();
var whitelist = ["arab-made.com"];

app.use("/uploads", express.static("uploads"));
app.use(express.json());



app.use(cors());

app.use((req, res, nxt) => {
  if (process.env.MODE == "DEV") nxt();
  else if (whitelist.includes(req.hostname)) nxt();
  // else if (req.headers["api-key"] == process.env.PASSWORD_API) nxt();
  else return res.status(403).json({ message: "error" });
});

bootstrap(app);

const server = app.listen(port, () => {
  console.log("Server is ON ", port);
});

const io = initIo(server);

io.on("connection", (socket) => {
  socket.on("socketAuth", async (authorization) => {
    const auth = await socketAuth(authorization, socket.id);
    if (auth == true) {
      socket.emit("socketAuth", "done");
    }
  });
});
// test
//test 2