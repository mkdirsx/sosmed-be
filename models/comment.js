'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      comment.belongsTo(models.user, {
        foreignKey: 'userId'
      });
      comment.belongsTo(models.post, {
        foreignKey: 'postId'
      });
    }
  }
  comment.init({
    userId: DataTypes.INTEGER,
    postId: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'comment',
  });
  return comment;
};