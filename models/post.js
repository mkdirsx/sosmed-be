'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      post.belongsTo(models.user, {
        foreignKey: 'userId'
      })
    }
  }
  post.init({
    image: DataTypes.STRING,
    caption: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'post',
  });
  return post;
};