import { Sequelize } from "sequelize";
export const sequelize = new Sequelize(
  'arab-made',           // Database name
  'postgres',           // Database username
  "om-arab-made-2024",       // Database password
  {
    host: 'localhost',   // Database host
    dialect: "postgres",         // Specify the dialect (no "ql" in 'postgres')
    operatorsAliases: false,     // Set this to false, as it's deprecated
  }
);
export const connectDB = async () => {
  await sequelize
    .sync({ alter: true })
    .then((result) => {
      console.log("DB Connected");
    })
    .catch((error) => {
      console.log("error", error);
    });
};

// orthomedics123456
