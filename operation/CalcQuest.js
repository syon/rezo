const fs = require('fs')
const questSet = require('../db/questdata.json')

function run() {
  console.log('[#run]')
  for (const [rootId, quest] of Object.entries(questSet)) {
    const drawSockets = []
    for (const [socketId, info] of Object.entries(quest.sockets)) {
      let socketObj = info
      if (info.type === 'alias') {
        socketObj = questSet[socketId]
        if (!socketObj) {
          console.warn('Missing socket ref, ID', socketId)
          continue
        }
      }
      const { title, type } = socketObj
      const done = true
      drawSockets.push({ id: socketId, type, title, done })
    }
    questSet[rootId].drawSockets = drawSockets
  }

  const jsonStr = JSON.stringify(questSet, null, 2)
  fs.writeFileSync('./db/ComputedQuestSet.json', jsonStr)
}

run()
