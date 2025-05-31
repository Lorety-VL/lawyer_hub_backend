'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ResetTokens', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      userId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      used: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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

    const indexExists = await queryInterface.showIndex('ResetTokens', {
      name: 'reset_tokens_token'
    });

    if (!indexExists.length) {
      await queryInterface.addIndex('ResetTokens', ['token'], {
        name: 'reset_tokens_token',
        unique: true
      });
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ResetTokens');
  }
};