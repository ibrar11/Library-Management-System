'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('books', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      bookName:{
        type: DataTypes.STRING,
        allowNull:false
      },
      edition: {
          type: DataTypes.INTEGER,
          allowNull:false
        },
      authorName:{
        type: DataTypes.STRING,
        allowNull:false
      },
      isBorrowed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull:false
      },
      publishDate:{
        type: DataTypes.DATEONLY,
        allowNull:false
      },
      isRequested: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull:false
      },
      assigningDate:{
        type: DataTypes.DATEONLY,
      },
      returnDate: {
          type: DataTypes.DATEONLY,

      },
      studentId:{
        type: DataTypes.INTEGER,
        references: {
          model: "students",
          key: "id"
        }
      },
      rollNumber:{
        type: DataTypes.STRING,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  async down(queryInterface, DataTypes) {
    await queryInterface.dropTable('books');
  }
};