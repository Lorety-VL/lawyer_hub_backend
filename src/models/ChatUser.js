export default (sequelize, DataTypes) => {
  return sequelize.define('ChatUser', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    chatId: {
      type: DataTypes.UUID,
      allowNull: false
    },
  });
};