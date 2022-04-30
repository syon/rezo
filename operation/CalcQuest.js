const fs = require('fs')
const questSet = require('../db/questdata.json')

const computedResult = { questSet: null, bonds: [] }

function refreshQuest() {
  for (const [rootId, quest] of Object.entries(questSet)) {
    const drawSockets = []
    for (const soc of quest.sockets) {
      if (soc.type === 'alias') {
        const obj = questSet[soc.id]
        if (!obj) {
          console.warn('Missing socket ref, ID', soc.id)
          continue
        }
        const done = true
        drawSockets.push({ ...obj, type: soc.type, done })
      } else {
        const { id, type, title } = soc
        const done = true
        drawSockets.push({ id, type, title, done })
      }
    }
    questSet[rootId].drawSockets = drawSockets
  }

  computedResult.questSet = questSet
}

function refreshBonds() {
  const bonds = []
  for (const [rootId, quest] of Object.entries(questSet)) {
    quest.sockets.forEach((soc, idx) => {
      if (soc.type === 'alias') {
        bonds.push({ src: soc.id, dst: rootId, dstidx: idx })
      }
    })
  }

  computedResult.bonds = bonds
}

function writeJson() {
  const jsonStr = JSON.stringify(computedResult, null, 2)
  fs.writeFileSync('./db/ComputedResult.json', jsonStr)
}

function run() {
  refreshQuest()
  refreshBonds()
  writeJson()
}

run()
