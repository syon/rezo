const DB = require('./DB')

let questSet = {}
let questFacts = []

const computedResult = { questSet: null, bonds: [] }

function readDataFiles(panel) {
  questSet = DB.getStruct(panel)
  questFacts = DB.getFact(panel)
}

function writeJson(panel) {
  DB.saveComputed(panel, computedResult)
}

function refreshQuest() {
  // 第一層：ファクト観察ソケットの進捗確認
  for (const quest of Object.values(questSet)) {
    for (const soc of quest.sockets) {
      if (soc.type === 'fact') {
        soc.done = questFacts.includes(soc.id)
        soc.resolved = true
      }
    }
  }

  // 第二層：ルートクエストの進捗確認
  let aliasInfo = {}
  for (const quest of Object.values(questSet)) {
    const sockets = quest.sockets
    const ready = sockets.every((soc) => soc.type === 'fact')
    if (ready) {
      // すべてがソケットの場合は進捗率が計算可能なため実行
      quest.rate = sockets.filter((x) => x.done).length / sockets.length
      quest.rateResolved = true
    } else {
      // エイリアスを含む場合はエイリアスIDをプール
      const aliasList = sockets.filter((soc) => soc.type === 'alias')
      const aliasIdSet = Object.fromEntries(
        aliasList.map((a) => [a.id, { resolved: false }])
      )
      aliasInfo = { ...aliasInfo, ...aliasIdSet }
    }
  }

  let isRemainAlias = true
  while (isRemainAlias) {
    // 貯め込んだすべてのエイリアスを対象に巡回
    for (const [aliasId, aRef] of Object.entries(aliasInfo)) {
      console.log('<WHILE>', aliasId)
      const obj = questSet[aliasId]
      // 進捗率計算済みの場合はその状況を反映
      if (obj.rateResolved) {
        aRef.done = obj.rate === 1
        aRef.resolved = true
      }
    }

    // 状況がわかったエイリアスを使って再度エイリアスソケットの進捗確認
    for (const quest of Object.values(questSet)) {
      if (quest.rateResolved) {
        continue
      }
      const sockets = quest.sockets
      const aliasList = sockets.filter((soc) => soc.type === 'alias')
      for (const a of aliasList) {
        const info = aliasInfo[a.id]
        if (info.resolved) {
          a.done = info.done
          a.resolved = true
        }
      }
      const ready = sockets.every((x) => x.resolved)
      if (ready) {
        const rate = sockets.filter((x) => x.done).length / sockets.length
        quest.rate = Math.round(rate * 100) / 100
        quest.rateResolved = true
      }
    }

    isRemainAlias = Object.entries(aliasInfo).some(([k, v]) => !v.resolved)
  }

  // Make drawSockets
  for (const [rootId, quest] of Object.entries(questSet)) {
    const drawSockets = []
    for (const soc of quest.sockets) {
      if (soc.type === 'alias') {
        const obj = questSet[soc.id]
        if (!obj) {
          console.warn('Missing socket ref, ID', soc.id)
          continue
        }
        const { id, type, done } = soc
        const { title } = obj
        drawSockets.push({ id, title, done, type })
      } else {
        const { id, type, title, done } = soc
        drawSockets.push({ id, type, title, done })
      }
    }

    // Calc progress rate
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

function refreshFacts() {
  let facts = []
  for (const [parentId, quest] of Object.entries(computedResult.questSet)) {
    const list = quest.sockets
      .filter((x) => x.type === 'fact')
      .map((x) => ({ parentId, ...x }))
    facts = facts.concat(list)
  }

  computedResult.facts = facts
}

function run(panel) {
  console.log('CalcQuest start')
  readDataFiles(panel)
  refreshQuest()
  refreshBonds()
  refreshFacts()
  writeJson(panel)
  console.log('CalcQuest end')
}

module.exports = run
