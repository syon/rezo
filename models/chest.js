const { v4: uuidv4 } = require('uuid')
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Chest extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }

  Chest.init(
    {
      title: DataTypes.STRING,
      x: DataTypes.INTEGER,
      y: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Chest',
    }
  )

  Chest.beforeCreate((x, _) => {
    return (x.id = uuidv4().slice(0, 8))
  })
  return Chest
}
