export default (sequelize, DataTypes) => sequelize.define('User', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  lastName: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  patronymic: {
    type: DataTypes.STRING(50),
    allowNull: false,
  },
  gender: {
    type: DataTypes.ENUM('male', 'female'),
    allowNull: false,
  },
  birthDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isBefore: new Date().toISOString(),
    }
  },
  userStatus: {
    type: DataTypes.TEXT,
  },
  email: {
    type: DataTypes.STRING(320),
    unique: true,
    allowNull: false,
  },
  password: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  activationLink: {
    type: DataTypes.TEXT,
    unique: true,
  },
  isActivated: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  isBlocked: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  phoneNumber: {
    type: DataTypes.TEXT,
  },
  avatar_url: {
    type: DataTypes.TEXT,
  },
  role: {
    type: DataTypes.ENUM('client', 'lawyer', 'admin', 'moderator'),
    allowNull: false,
  },
});
