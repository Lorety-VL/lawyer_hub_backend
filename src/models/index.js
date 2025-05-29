import Sequelize, { DataTypes } from 'sequelize';
import process from 'process';
import config from '../config/config.js';
import TokenModel from './Token.js';
import UserModel from './User.js';
import LawyerModel from './LawyerProfile.js';
import SpecializationModel from './Specialization.js';
import LawyerSpecializationModel from './LawyerSpecialization.js';
import FileModel from './File.js';


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
const Specialization = SpecializationModel(db, DataTypes);
const LawyerSpecialization = LawyerSpecializationModel(db, DataTypes);
const File = FileModel(db, DataTypes);

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

LawyerProfile.belongsToMany(Specialization, {
  through: LawyerSpecialization,
  foreignKey: 'lawyerProfileId',
});

Specialization.belongsToMany(LawyerProfile, {
  through: LawyerSpecialization,
  foreignKey: 'specializationId'
});

LawyerProfile.hasMany(File, { foreignKey: 'LawyerProfileId' });
File.belongsTo(LawyerProfile, { foreignKey: 'LawyerProfileId' });

export { User, Token, LawyerProfile, Specialization, File };

export default db;