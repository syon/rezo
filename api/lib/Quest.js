const fs = require('fs')
const { v4: uuid } = require('uuid')

module.exports = class Quest {
  static loadComputed() {
    const rawQuestSet = fs.readFileSync('./db/ComputedResult.json', 'utf-8')
    return JSON.parse(rawQuestSet)
  }

  static add(obj) {
    const defJson = fs.readFileSync('./db/QuestDef.json', 'utf-8')
    const def = JSON.parse(defJson)
    const id = uuid().slice(0, 8)
    const item = {
      title: obj.title || '新しいタイトル',
      x: obj.x || 0,
      y: obj.y || 0,
      sockets: [],
    }
    def[id] = item
    const outJson = JSON.stringify(def, null, 2)
    fs.writeFileSync('./db/QuestDef.json', outJson)
    return item
  }

  static addSocket({ questId, socketId, type }) {
    const defJson = fs.readFileSync('./db/QuestDef.json', 'utf-8')
    const def = JSON.parse(defJson)
    const target = def[questId]
    if (questId === socketId) {
      throw new Error(`Socket ID: [${socketId}] itself.`)
    }
    const exists = target.sockets.some((x) => x.id === socketId)
    if (exists) {
      throw new Error(`Socket ID: [${socketId}] Already exists.`)
    }
    target.sockets.push({ id: socketId, type })
    const outJson = JSON.stringify(def, null, 2)
    fs.writeFileSync('./db/QuestDef.json', outJson)
  }
}
