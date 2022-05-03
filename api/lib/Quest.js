const { v4: uuid } = require('uuid')
const DB = require('./DB')

module.exports = class Quest {
  static loadComputed(panel) {
    return DB.getComputed(panel)
  }

  static updatePosition(panel, questId, data) {
    const { x, y } = data
    const struct = DB.getStruct(panel)
    const target = struct[questId]
    target.x = x
    target.y = y
    DB.saveStruct(panel, struct)
  }

  static add(panel, obj) {
    const struct = DB.getStruct(panel)
    const id = uuid().slice(0, 8)
    const item = {
      title: obj.title || '新しいタイトル',
      x: obj.x || 0,
      y: obj.y || 0,
      sockets: [],
    }
    struct[id] = item
    DB.saveStruct(panel, struct)
    return item
  }

  static addSocket(panel, { questId, socketId: rawSocketId, type }) {
    const struct = DB.getStruct(panel)
    const target = struct[questId]
    const socketId = rawSocketId || uuid().slice(0, 8)
    Quest.checkAddSocket(struct, questId, socketId, type)
    const title = '新しいアイテム'
    target.sockets.push({ id: socketId, type, title })
    DB.saveStruct(panel, struct)
  }

  static checkAddSocket(def, questId, socketId, type) {
    const target = def[questId]
    // 自分自身を接続対象に指定はNG
    if (questId === socketId) {
      throw new Error(`Socket ID: [${socketId}] itself.`)
    }

    // 既に接続済みのものはNG
    const exists = target.sockets.some((x) => x.id === socketId)
    if (exists) {
      throw new Error(`Socket ID: [${socketId}] Already exists.`)
    }

    // 循環参照はNG
    if (type === 'alias') {
      const originId = questId
      Quest.checkCircular(def, socketId, originId)
    }
  }

  static addFact(panel, questId, { done }) {
    let facts = DB.getFact(panel)
    if (done) {
      if (facts.includes(questId)) return
      facts.push(questId)
    } else {
      facts = facts.filter((id) => id !== questId)
    }
    DB.saveFact(panel, facts)
  }

  static checkCircular(def, targetId, originId) {
    console.log('★CHECK:', targetId)
    if (!def[targetId]) return
    const subSockets = def[targetId].sockets
    const subAliases = subSockets.filter((x) => x.type === 'alias')
    const isLoop = subAliases.some((x) => x.id === originId)
    if (isLoop) {
      throw new Error(`Socket ID: [${originId}] in a circular reference.`)
    }
    for (const a of subAliases) {
      Quest.checkCircular(def, a.id, originId)
    }
  }
}
