const fs = require('fs')
const { v4: uuid } = require('uuid')

module.exports = class Quest {
  static loadComputed() {
    const rawQuestSet = fs.readFileSync('./db/ComputedResult.json', 'utf-8')
    return JSON.parse(rawQuestSet)
  }

  static updatePosition(questId, data) {
    const { x, y } = data
    const defJson = fs.readFileSync('./db/QuestDef.json', 'utf-8')
    const def = JSON.parse(defJson)
    const target = def[questId]
    target.x = x
    target.y = y
    const outJson = JSON.stringify(def, null, 2)
    fs.writeFileSync('./db/QuestDef.json', outJson)
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

  static addSocket({ questId, socketId: rawSocketId, type }) {
    const defJson = fs.readFileSync('./db/QuestDef.json', 'utf-8')
    const def = JSON.parse(defJson)
    const target = def[questId]
    const socketId = rawSocketId || uuid().slice(0, 8)
    Quest.checkAddSocket(def, questId, socketId, type)
    const title = '新しいアイテム'
    target.sockets.push({ id: socketId, type, title })
    const outJson = JSON.stringify(def, null, 2)
    fs.writeFileSync('./db/QuestDef.json', outJson)
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

  static addFact(questId, { done }) {
    const factsJson = fs.readFileSync('./db/QuestFacts.json', 'utf-8')
    let facts = JSON.parse(factsJson)
    if (done) {
      if (facts.includes(questId)) return
      facts.push(questId)
    } else {
      facts = facts.filter((id) => id !== questId)
    }
    const outJson = JSON.stringify(facts, null, 2)
    fs.writeFileSync('./db/QuestFacts.json', outJson)
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
