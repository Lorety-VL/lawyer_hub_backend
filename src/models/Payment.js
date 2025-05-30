export default (sequelize, DataTypes) => sequelize.define('Payment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  kassaId: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.ENUM('pending', 'succeeded', 'canceled'),
    defaultValue: 'pending'
  },
  description: {
    type: DataTypes.STRING(120),
  },
  paymentUrl: {
    type: DataTypes.TEXT,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
  lawyerId: {
    type: DataTypes.BIGINT,
    allowNull: false
  },
});