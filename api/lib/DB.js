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

function writeJson(path, data) {
  const jsonStr = JSON.stringify(data, null, 2)
  fs.writeFileSync(path, jsonStr)
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
    return readJson(`${panelPath}/computed.json`) || {}
  }

  static saveStruct(panel, struct) {
    const panelPath = `./db/panel/${panel}`
    writeJson(`${panelPath}/struct.json`, struct)
    DB.doCompute(panel)
  }

  static saveFact(panel, fact) {
    const panelPath = `./db/panel/${panel}`
    writeJson(`${panelPath}/fact.json`, fact)
    DB.doCompute(panel)
  }

  static saveComputed(panel, computed) {
    const panelPath = `./db/panel/${panel}`
    writeJson(`${panelPath}/computed.json`, computed)
  }

  static doCompute(panel) {
    const struct = DB.getStruct(panel)
    const fact = DB.getFact(panel)
    const computed = Compute(struct, fact)
    DB.saveComputed(panel, computed)
  }
}
