import Sequelize, { DataTypes } from 'sequelize';
import process from 'process';
import config from '../config/config.js';
import TokenModel from './Token.js';
import UserModel from './User.js';
import LawyerModel from './LawyerProfile.js';


const env = process.env.NODE_ENV || 'development';

const db = new Sequelize(
  config[env].database,
  config[env].username,
  config[env].password,
  { ...config[env] }
);

const User = UserModel(db, DataTypes);
const LawyerProfile = LawyerModel(db, DataTypes);
const Token = TokenModel(db, DataTypes);

Token.belongsTo(User, {
  foreignKey: 'userId'
});
User.hasOne(Token, {
  foreignKey: 'userId',
});

LawyerProfile.belongsTo(User, {
  foreignKey: 'userId',
});
User.hasOne(LawyerProfile, {
  foreignKey: 'userId',
});

export {User, Token, LawyerProfile};

export default db;