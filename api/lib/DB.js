const fs = require('fs')

function readJson(path) {
  const jsonStr = fs.readFileSync(path, 'utf-8')
  return JSON.parse(jsonStr)
}

module.exports = class DB {
  static getStruct(panel) {
    const panelPath = `./db/panel/${panel}`
    return readJson(`${panelPath}/struct.json`)
  }

  static getFact(panel) {
    const panelPath = `./db/panel/${panel}`
    return readJson(`${panelPath}/fact.json`)
  }

  static getComputed(panel) {
    const panelPath = `./db/panel/${panel}`
    return readJson(`${panelPath}/ComputedResult.json`)
  }

  static saveStruct(panel, struct) {
    const panelPath = `./db/panel/${panel}`
    const jsonStr = JSON.stringify(struct, null, 2)
    fs.writeFileSync(`${panelPath}/struct.json`, jsonStr)
  }

  static saveFact(panel, fact) {
    const panelPath = `./db/panel/${panel}`
    const jsonStr = JSON.stringify(fact, null, 2)
    fs.writeFileSync(`${panelPath}/fact.json`, jsonStr)
  }
}
