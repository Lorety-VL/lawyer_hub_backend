import Sequelize, { DataTypes } from 'sequelize';
import process from 'process';
import config from '../config/config.js';
import TokenModel from './Token.js';
import UserModel from './User.js';
import LawyerModel from './LawyerProfile.js';
import SpecializationModel from './Specialization.js';
import LawyerSpecializationModel from './LawyerSpecialization.js';
import ChatModel from './Chat.js';
import MessageModel from './Message.js';
import ChatUserModel from './ChatUser.js';
import ReviewModel from './Review.js';
import PaymentModel from './Payment.js';
import ResetTokenModel from './ResetToken.js';


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
const Chat = ChatModel(db, DataTypes);
const Message = MessageModel(db, DataTypes);
const ChatUser = ChatUserModel(db, DataTypes);
const Review = ReviewModel(db, DataTypes);
const Payment = PaymentModel(db, DataTypes);
const ResetToken = ResetTokenModel(db, DataTypes);

Token.belongsTo(User, {
  foreignKey: 'userId'
});
User.hasOne(Token, {
  foreignKey: 'userId',
});

LawyerProfile.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
});
User.hasOne(LawyerProfile, {
  foreignKey: 'userId',
});

LawyerProfile.belongsToMany(Specialization, {
  through: LawyerSpecialization,
  foreignKey: 'lawyerProfileId',
  onDelete: 'CASCADE'
});

Specialization.belongsToMany(LawyerProfile, {
  through: LawyerSpecialization,
  foreignKey: 'specializationId'
});

Chat.hasMany(Message, { foreignKey: 'chatId' });
Message.belongsTo(Chat, { foreignKey: 'chatId' });

Message.belongsTo(User, { foreignKey: 'senderId' });
User.hasMany(Message, { foreignKey: 'senderId' });

User.belongsToMany(Chat, {
  through: ChatUser,
  foreignKey: 'userId',
  otherKey: 'chatId'
});

Chat.belongsToMany(User, {
  through: ChatUser,
  foreignKey: 'chatId',
  otherKey: 'userId'
});

Message.belongsTo(User, {
  foreignKey: 'senderId',
  as: 'sender'
});

Payment.belongsTo(User, { foreignKey: 'userId' });
Payment.belongsTo(User, { foreignKey: 'lawyerId' });

Review.belongsTo(User, {
  foreignKey: 'lawyerId',
  as: 'lawyer'
});

Review.belongsTo(User, {
  foreignKey: 'clientId',
  as: 'client'
});

LawyerProfile.hasMany(Review, {
  foreignKey: 'lawyerId',
  as: 'reviews'
});

User.hasMany(Review, {
  foreignKey: 'clientId',
  as: 'authoredReviews'
});

ResetToken.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(ResetToken, { foreignKey: 'userId' });

export {
  User,
  Token,
  LawyerProfile,
  Specialization,
  Chat,
  Message,
  ChatUser,
  Review,
  Payment,
  ResetToken
};

export default db;