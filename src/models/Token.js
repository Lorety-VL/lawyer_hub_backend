export default (sequelize, DataTypes) => sequelize.define('Token', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  refreshToken: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: true,
  }
});
