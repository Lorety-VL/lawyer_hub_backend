'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LawyerSpecializations', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      lawyerProfileId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'LawyerProfiles',
          key: 'id',
          onDelete: 'CASCADE'
        }
      },
      specializationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Specializations',
          key: 'id',
          onDelete: 'CASCADE'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('LawyerSpecializations');
  }
};