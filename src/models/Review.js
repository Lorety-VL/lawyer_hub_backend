export default (sequelize, DataTypes) => sequelize.define('Review', {
  id: {
    type: DataTypes.BIGINT,
    autoIncrement: true,
    primaryKey: true,
  },
  lawyerId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  clientId: {
    type: DataTypes.BIGINT,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  text: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
});