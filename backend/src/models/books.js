'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class books extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate({students}) {
      // define association here
      this.belongsTo(students, {foreignKey: 'studentId'});
    }

    toJSON() {
      return {...this.get(), studentId: undefined}
    }
  }
  books.init({
    bookName:{
      type: DataTypes.STRING,
      allowNull:false
    },
    edition:{
      type: DataTypes.STRING,
      allowNull:false
    },
    authorName:{
      type: DataTypes.STRING,
      allowNull:false
    },
    publishDate:{
      type: DataTypes.DATEONLY,
      allowNull:false
    },
    rollNumber:{
      type: DataTypes.STRING,
    },
    isBorrowed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
    returnDate:{
      type: DataTypes.DATEONLY,
    },
  }, {
    sequelize,
    modelName: 'books',
  });
  return books;
};