const fs = require('fs')
const path = require('path')
const Sequelize = require('sequelize')
const basename = path.basename(__filename)
const modelsDir = path.resolve(process.cwd(), 'models')
const configData = require(path.resolve(modelsDir, '../config/config.js'))
const nodeEnv = process.env.NODE_ENV || 'development'
const config = configData[nodeEnv]
const sequelize = new Sequelize(config)

console.log('========================================')
console.log('Config Mode:', nodeEnv)
console.log(config)
console.log('========================================')

const db = {}
fs.readdirSync(modelsDir)
  .filter((file) => {
    return (
      // Not a hidden file & not this file & '.js' file.
      file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js'
    )
  })
  .forEach((file) => {
    const model = require(path.join(modelsDir, file))(sequelize, Sequelize)
    db[model.name] = model
  })

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
