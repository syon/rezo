const { v4: uuidv4 } = require('uuid')
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Socket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Socket.belongsTo(models.Chest, {
        foreignKey: 'chestId',
        onDelete: 'CASCADE',
      })
    }
  }

  Socket.init(
    {
      chestId: DataTypes.STRING,
      title: DataTypes.STRING,
      type: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Socket',
    }
  )

  Socket.beforeCreate((x, _) => {
    return (x.id = uuidv4().slice(0, 8))
  })
  return Socket
}
