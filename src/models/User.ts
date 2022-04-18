import { sequelize } from "../../config/database";
import { DataTypes } from "sequelize";

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  isActive:boolean;
}

const User = sequelize.define("user", {
  id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
  },
  firstname: { type: DataTypes.STRING, allowNull: false},
  lastname: { type: DataTypes.STRING, allowNull: false},
  email: { type: DataTypes.STRING, allowNull: false},
  password: { type: DataTypes.STRING, allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, allowNull: false },
});




export default User;