import { Sequelize } from'sequelize';
export const sequelize = new Sequelize("arab-made", "postgres", "arabmade", {
    host: 'localhost',
    dialect: 'postgresql',
    operatorsAliases:true
  });
  export const connectDB=async()=>{
     await sequelize.sync({alter:true}).then(result=>{
        console.log("DB Connected");
     }).catch((error)=>{
        console.log("error",error);
     });
  };




