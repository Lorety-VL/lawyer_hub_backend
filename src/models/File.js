export default (sequelize, DataTypes) => sequelize.define('File', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  lawyerProfileId: {
    type: DataTypes.BIGINT,
    allowNull: true,
  },
  fileName: {
    type: DataTypes.STRING(50),
    allowNull: true,
  },
  path: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  }
});
