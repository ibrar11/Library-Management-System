'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, DataTypes) {
    await queryInterface.createTable('students', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      uuid:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4
      },
      studentName:{
        type: DataTypes.STRING,
        allowNull:false
      },
      email:{
        type: DataTypes.STRING,
        allowNull:false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull:false
      },
      rollNumber:{
        type: DataTypes.STRING,
        unique: true
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      refreshToken: {
        type: DataTypes.STRING,
        defaultValue: ''
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
    await queryInterface.dropTable('students');
  }
};