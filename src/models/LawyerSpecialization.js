export default (sequelize, DataTypes) => {
  return sequelize.define('LawyerSpecialization', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    lawyerProfileId: {
      type: DataTypes.BIGINT,
      allowNull: false
    },
    specializationId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  });
};