const fs = require('fs')

module.exports = class Quest {
  static loadComputed() {
    const rawQuestSet = fs.readFileSync('./db/ComputedResult.json', 'utf-8')
    return JSON.parse(rawQuestSet)
  }
}
