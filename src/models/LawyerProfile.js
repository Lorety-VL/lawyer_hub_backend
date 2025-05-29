export default (sequelize, DataTypes) => sequelize.define('LawyerProfile', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  aboutMe: {
    type: DataTypes.TEXT,
  },
  education: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  region: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
  },
  rating: {
    type: DataTypes.FLOAT,
  },
  licenseNumber: {
    type: DataTypes.TEXT,
    unique: true,
    allowNull: false,
  },
  experienceStartDate: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: true,
      isBefore: new Date().toISOString(),
    },
  },
  isConfirmed: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});
