const fs = require('fs')
const pathLib = require('path')
const Compute = require('./Compute')

function readJson(path) {
  try {
    const jsonStr = fs.readFileSync(path, 'utf-8')
    return jsonStr ? JSON.parse(jsonStr) : null
  } catch (e) {
    if (e.code === 'ENOENT') {
      const dir = pathLib.dirname(path)
      fs.mkdirSync(dir, { recursive: true })
      fs.writeFileSync(path, '')
      return null
    } else {
      throw e
    }
  }
}

module.exports = class DB {
  static getStruct(panel) {
    const panelPath = `./db/panel/${panel}`
    return readJson(`${panelPath}/struct.json`) || {}
  }

  static getFact(panel) {
    const panelPath = `./db/panel/${panel}`
    return readJson(`${panelPath}/fact.json`) || []
  }

  static getComputed(panel) {
    const panelPath = `./db/panel/${panel}`
    return readJson(`${panelPath}/ComputedResult.json`) || {}
  }

  static saveStruct(panel, struct) {
    const panelPath = `./db/panel/${panel}`
    const jsonStr = JSON.stringify(struct, null, 2)
    fs.writeFileSync(`${panelPath}/struct.json`, jsonStr)
    DB.doCompute(panel)
  }

  static saveFact(panel, fact) {
    const panelPath = `./db/panel/${panel}`
    const jsonStr = JSON.stringify(fact, null, 2)
    fs.writeFileSync(`${panelPath}/fact.json`, jsonStr)
    DB.doCompute(panel)
  }

  static saveComputed(panel, computed) {
    const panelPath = `./db/panel/${panel}`
    const jsonStr = JSON.stringify(computed, null, 2)
    fs.writeFileSync(`${panelPath}/ComputedResult.json`, jsonStr)
  }

  static doCompute(panel) {
    const struct = DB.getStruct(panel)
    const fact = DB.getFact(panel)
    const computed = Compute(struct, fact)
    DB.saveComputed(panel, computed)
  }
}
