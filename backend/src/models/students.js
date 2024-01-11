'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class students extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({books}) {
      // define association here
      this.hasMany(books,{foreignKey: 'studentId'});
    }
    toJSON() {
      return {
        ...this.get(),
        id: undefined,
        password: undefined,
        refreshToken: undefined,
        email: undefined
      }
    }
  }
  students.init({
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
    }
  }, {
    sequelize,
    modelName: 'students',
  });
  return students;
};