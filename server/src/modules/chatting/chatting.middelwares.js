import { Op } from "sequelize"
import { Chat } from "../../database/models/chatting/chat.model.js"
import { asyncHandler } from "../../utils/error_handling.js"

export const checkMessageInChatForUser=asyncHandler(
    async(req,res,nxt)=>{
        const{id}=req.params
        const{messageIndex}=req.body
        const {reciever}=req.body.messageObj
        const chat = await Chat.findOne({
            where: {
                id,
                [Op.or]: [
                    {
                        [Op.and]: [
                            {userOneId:reciever},
                            {userTwoId:req.user.id}
                        ],
                    },
                    {
                        [Op.and]: [
                            {userOneId:req.user.id},
                            {userTwoId:reciever}
                        ]
                    }
                ]
            }
        })
        if(!chat) return res.json({message:"chat not found or it's not assiocated with those users"})
console.log(chat.messages[messageIndex]);
        if(!chat.messages[messageIndex] || chat.messages[messageIndex].sender!=req.user.id  ) return res.json({message:"this user is not sender or index overflow"})
        req.chat=chat
        nxt()
    }
)

export const checkUserIsPaticipentInChat=asyncHandler(
    async(req,res,nxt)=>{
        const { id } = req.params
        const chat= await Chat.findOne({
            where:{
                id,
                [Op.or]:[
                    {
                        userOneId:req.user.id
                    },
                    {
                        userTwoId:req.user.id
                    }
                ]
            }
        })
        if(!chat) return nxt(new Error("Chat not found or User is not participent in this chat"))
        nxt()
    }
)