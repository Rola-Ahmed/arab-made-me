import { Op } from "sequelize";
import { Chat } from "../../database/models/chatting/chat.model.js";
import { asyncHandler } from "../../utils/error_handling.js";
import { User } from "../../database/models/user.model.js";
import { crudOps } from "../../utils/crud_ops.js";
import { getIo } from "../../utils/socket_server.js";
import { Importer } from "../../database/models/importer.model.js";
import { Factory } from "../../database/models/factory.model.js";
// import { io } from "../../../index.js";

export const addChatOrMessage = asyncHandler(async (req, res, nxt) => {
  const { messageObj } = req.body;
  messageObj.sender = req.user.id;
  const reciever = messageObj.reciever;
  const recieverUser = await User.findByPk(reciever);
  if (!recieverUser) return res.json({ message: "reciever not found" });
  const chat = await Chat.findOne({
    where: {
      [Op.or]: [
        {
          [Op.and]: [{ userOneId: reciever }, { userTwoId: req.user.id }],
        },
        {
          [Op.and]: [{ userOneId: req.user.id }, { userTwoId: reciever }],
        },
      ],
    },
    include: [
      { model: User, as: "userOne" },
      { model: User, as: "userTwo" },
    ],
  });
  console.log(messageObj);
  if (chat) {
    chat.messages.push(messageObj);
    await chat.save();
    await Chat.update({ messages: chat.messages }, { where: { id: chat.id } });
    const nChat = await Chat.findByPk(chat.id, {
      include: [
        { model: User, as: "userOne" },
        { model: User, as: "userTwo" },
      ],
    });
    getIo().to(recieverUser.socketId).emit("newMessage", messageObj);
    return res.json({ message: "done", chat: nChat });
  }

  let newChat = await Chat.create({
    messages: [messageObj],
    userOneId: req.user.id,
    userTwoId: reciever,
  });
  newChat = await Chat.findByPk(newChat.id, {
    include: [
      { model: User, as: "userOne" },
      { model: User, as: "userTwo" },
    ],
  });
  getIo().to(recieverUser.socketId).emit("newMessage", messageObj);
  return res.json({ message: "done", chat: newChat, messageObj });
});

export const updateMessage = asyncHandler(async (req, res, nxt) => {
  const chat = req.chat;
  let messageObj = req.body.messageObj;
  messageObj.sender = req.user.id;
  chat.messages[req.body.messageIndex] = messageObj;
  await chat.save();
  await Chat.update({ messages: chat.messages }, { where: { id: chat.id } });
  const newChat = await Chat.findByPk(chat.id);
  getIo().to(recieverUser.socketId).emit("newMessage", messageObj);
  return res.json({ message: "done", chat: newChat });
});

export const deleteMessage = asyncHandler(async (req, res, nxt) => {
  const { id } = req.params;
  const chat = await Chat.findByPk(id);
  if (!chat) return res.json({ message: "chat not found" });
  if (
    !chat.messages[req.body.messageIndex] ||
    chat.messages[req.body.messageIndex].sender != req.user.id
  )
    return res.json({ message: "this user is not sender or index overflow" });
  chat.messages.splice(req.body.messageIndex, 1);
  await chat.save();
  await Chat.update({ messages: chat.messages }, { where: { id: chat.id } });
  const newChat = await Chat.findByPk(chat.id);
  // io.to(`chat:${chat.id}`).emit('messages',{chat:newChat})
  return res.json({ message: "done", chat: newChat });
});

export const getAllChats = crudOps.getAll(Chat);

export const getOneChat = crudOps.getOne(Chat);

export const getAllChatsForUser = asyncHandler(async (req, res, nxt) => {
  console.log("hereeee---->>>");
  console.log(req.user.id);
  //   const {id}=req.params
  //   console.log(id==req.user.id);
  const id = req.user.id;
  const chats = await Chat.findAll({
    where: {
      [Op.or]: [{ userOneId: id }, { userTwoId: id }],
    },
    include: [
      {
        model: User,
        as: "userOne", // Ensure this alias matches the association in your models
        attributes: ["factoryId", "importerId", "id", "email"],
        include: [
          {
            model: Factory, // This is the related model based on User.hasMany(Factory)
            attributes: ["id", "name", "repName"], // Add the Factory attributes you want to include
          },
          {
            model: Importer, // This is the related model based on User.hasMany(Factory)
            attributes: ["id", "name", "repName"], // Add the Factory attributes you want to include
          },
        ],
      },
      {
        model: User,
        as: "userTwo", // Ensure this alias matches the association in your models
        attributes: ["factoryId", "importerId", "id", "email"],
        include: [
            {
              model: Factory, // This is the related model based on User.hasMany(Factory)
              attributes: ["id", "name", "repName"], // Add the Factory attributes you want to include
            },
            {
              model: Importer, // This is the related model based on User.hasMany(Factory)
              attributes: ["id", "name", "repName"], // Add the Factory attributes you want to include
            },
          ],
      },
    ],
  });
  return res.json({ message: "done", chats, currentUserId: req.user.id });
});

export const getChatsForTwoUsers = asyncHandler(async (req, res, nxt) => {
  const { userOneId, userTwoId } = req.body;
  const chats = await Chat.findAll({
    where: {
      [Op.or]: [
        {
          [Op.and]: [userOneId, userTwoId],
        },
        {
          [Op.and]: [{ userOneId: userTwoId }, { userTwoId: userOneId }],
        },
      ],
    },
  });

  return res.json({ message: "done", chats });
});
