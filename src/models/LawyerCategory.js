export default (sequelize, DataTypes) => {
  return sequelize.define('LawyerCategory', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    lawyerProfileId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};