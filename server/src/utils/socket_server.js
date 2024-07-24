import { Server } from "socket.io";
import { User } from "../database/models/user.model.js";
import jwt from "jsonwebtoken";
let io;

export const initIo = (httpServer) => {
  io = new Server(httpServer, { cors: "*" });

  io.on("connection", (socket) => {
    socket.on("newMessage", (data) => {
      io.emit("newMessage", data);
    });

    socket.on("socketAuth", (data) => {
      io.emit("socketAuth", data);
    });
  });

  return io;
};
export const getIo = () => {
  if (!io) throw new Error("invalid socket setup");

  return io;
};

export const socketAuth = async (authorization, socketId) => {
  try {
    const decoded = jwt.verify(authorization, process.env.SECRET_KEY);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      getIo().to(socketId).emit("socketAuth", "socket auth failed");
      return false;
    }

    if (user.logout == true || user.emailActivated == false) {
      //user.updatedAt.getTime() /1000 > decoded.iat ||
      // console.log(user.updatedAt.getTime()/1000 > decoded.iat);
      getIo().to(socketId).emit("socketAuth", "socket auth failed");
      return false;
    }
    await user.update({ socketId });
    console.log(user.socketId);
    return true;
  } catch (error) {
    getIo().to(socketId).emit("socketAuth", "socket auth failed");
    return false;
  }
};
