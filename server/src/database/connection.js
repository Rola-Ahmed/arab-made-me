<<<<<<< Updated upstream
import { Sequelize } from 'sequelize';
import pg from 'pg';
import dotenv from "dotenv"
dotenv.config()
export const sequelize = new Sequelize(
  process.env.POSTGRES_DATABASE || "arab-made",
  process.env.POSTGRES_USER || "arab-made",
   process.env.POSTGRES_PASSWORD || "arabmade",
   {
      host: process.env.POSTGRES_HOST || 'localhost',
      dialect: 'postgres',
      operatorsAliases: true,
      dialectOptions: process.env.MODE=="PROD" ? {
         ssl: {
            require: false,
            rejectUnauthorized: true, // You might want to set this to `true` in production
         },
      }:{},
   });
export const connectDB = async () => {
   await sequelize.sync({ alter: true }).then(result => {
   }).catch((error) => {
   });
};
=======
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
>>>>>>> Stashed changes




