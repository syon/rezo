const db = require('../../models/index.js')
const { Chest } = db

module.exports = {
  create(req) {
    return Chest.create({
      id: req.body.id,
      title: req.body.title,
      x: req.body.x,
      y: req.body.y,
    })
  },
  findAll(req, res, next) {
    return Chest.findAll()
  },
  findOne(req) {
    return Chest.findOne({
      where: {
        id: req.params.id,
      },
    })
  },
  update(req) {
    return Chest.update(
      {
        title: req.body.title,
        x: req.body.x,
        y: req.body.y,
      },
      {
        where: { id: req.params.id },
      }
    ).then(() => {
      return 'Successfully updated a Chest ID: ' + req.params.id
    })
  },
  delete(req) {
    return Chest.destroy({
      where: { id: req.params.id },
    }).then(() => {
      return 'Successfully deleted a Chest ID: ' + req.params.id
    })
  },
}
