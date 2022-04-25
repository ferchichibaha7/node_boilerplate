import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();
const db_name = process.env.DB_NAME;
const db_user = process.env.DB_USER;
const db_pass = process.env.DB_PASS;
const db_host = process.env.DB_HOST;
const db_port = parseInt(process.env.DB_PORT);  // sequelize port accept only number

const sequelize = new Sequelize(db_name, db_user, db_pass, {
  host: db_host,
  dialect: "postgres",
  logging:false
});

const connectAuthenticate = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log("DataBase Connected");
    })
    .catch((err) => {
      console.log("Error db");
    });
};

export { sequelize, connectAuthenticate };
