'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('loans', { 
      id: { 
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      loan_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      return_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },
      returned_at: {
        type: Sequelize.STRING,
        allowNull: false
      },
      comments: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      book_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'books', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
      }, 
      student_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: { model: 'students', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
      }, 
      user_id: {
          type: Sequelize.UUID,
          allowNull: false,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
      }, 
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: Sequelize.DATE
      }  
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('loans');
  }
};