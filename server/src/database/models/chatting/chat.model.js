import { DataTypes } from "sequelize";
import { sequelize } from "../../connection.js";
import { User } from "../user.model.js";

export const Chat=sequelize.define('chats',{
    // userOne:{
    //     type:DataTypes.INTEGER,
    //     allowNull:false
    // },
    // userTwo:{
    //     type:DataTypes.INTEGER,
    //     allowNull:false
    // },
    /** 
   messageObj  {
     sender,
     reciever,
     message,
     status -> ['pending','seen']
     }
    */
    messages:{
        type:DataTypes.ARRAY(DataTypes.JSONB),
        defaultValue:[]
    }
},{
    timestamps:true
})

Chat.belongsTo(User, { as: 'userOne', foreignKey: 'userOneId' });

// Associate Chat with User for userTwo
Chat.belongsTo(User, { as: 'userTwo', foreignKey: 'userTwoId' });
