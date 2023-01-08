import Debug from 'debug'
import _ from 'lodash'
import dynamic from 'next/dynamic'
import dayjs from 'dayjs'
import BlankRootData from './BlankRootData.json'
import TutorialData from './TutorialData.json'

const Node = dynamic(() => import('../components/Node'), {
  ssr: false,
})
const Wire = dynamic(() => import('../components/Wire'), {
  ssr: false,
})

const dg = Debug('@:lib:Rezo')

export default class Rezo {
  static getAutoSavedata() {
    return JSON.parse(window.localStorage.savedata)
  }

  static setAutoSavedata(root) {
    const savedata = Rezo.makeSaveData(root)
    window.localStorage.savedata = savedata
  }

  static loadSavedataByMemoryId(memId) {
    window.localStorage.savedata = window.localStorage[memId]
  }

  static loadRoot() {
    let root = null
    try {
      root = Rezo.getAutoSavedata()
    } catch (e) {
      root = TutorialData
    }
    return root
  }

  static loadBlankRootData() {
    return BlankRootData
  }

  static prepare({ def, facts }) {
    // dg('[#prepare]')
    const { boxes, binds } = Rezo.computeDraw(def, facts)
    return { def, facts, boxes, binds }
  }

  static judgeCompleted(def, facts, nodeKey) {
    const nodePieces = def.structure[nodeKey]?.pieces
    const nodeTitle = def.master[nodeKey]?.title
    if (_.isEmpty(nodePieces)) {
      return facts.includes(nodeTitle)
    }
    const completedList = Object.entries(nodePieces).map(([pk, pv]) => {
      const pTitle = def.master[pk]?.title
      const hasPieces = !_.isEmpty(def.structure[pk]?.pieces)
      if (hasPieces) {
        return Rezo.judgeCompleted(def, facts, pk)
      }
      return facts.includes(pTitle)
    })
    const isCompleted = completedList.every(Boolean)
    if (isCompleted) {
      facts = _.uniq([...facts, nodeTitle])
    }
    return isCompleted
  }

  static computeDraw(rawDef, rawFacts) {
    if (!rawDef?.structure) return TutorialData
    const def = _.cloneDeep(rawDef)
    const facts = _.cloneDeep(rawFacts)

    const boxes = Object.fromEntries(
      Object.entries(def.structure).map(([nk, nv]) => {
        nv.title = def.master[nk]?.title
        nv.completed = Rezo.judgeCompleted(def, facts, nk)
        nv.pieces = Object.fromEntries(
          Object.entries(nv.pieces || {}).map(([pk, pv]) => {
            pv.title = def.master[pk]?.title
            pv.hasNode = !!def.structure[pk]
            pv.completed = Rezo.judgeCompleted(def, facts, pk)
            return [pk, pv]
          })
        )
        return [nk, nv]
      })
    )

    const binds = Object.entries(def.structure)
      .map(([nk, nv]) => {
        if (!nv.pieces) return null
        return Object.keys(nv.pieces).map((pk) => {
          return { from: pk, to: nk }
        })
      })
      .flat()

    return { boxes, binds, facts }
  }

  static createAllBoxes(boxes) {
    if (!boxes) return null
    return Object.entries(boxes).map(([id, box]) => {
      return <Node id={id} key={id} {...box} />
    })
  }

  static createAllWires(root) {
    if (!root?.binds) return null
    return root.binds.map((bd, i) => {
      const sp = { ...root.boxes[bd.from]?.pos }
      const ep = { ...root.boxes[bd.to]?.pos }
      if (!sp || !ep) return null
      sp.x = sp.x + 200
      sp.y = sp.y + 15
      const tgtIdx = Object.entries(root.boxes[bd.to].pieces).findIndex(
        ([pk, pv]) => pk === bd.from
      )
      ep.x = ep.x + 10
      ep.y = ep.y + 25 * tgtIdx + 50 + 5
      return <Wire key={i} sp={sp} ep={ep} />
    })
  }

  static MOVE_NODE(root, arg) {
    const { def, facts, boxes, binds } = root
    const pos = { x: arg.x, y: arg.y }
    const tgtBox = boxes[arg.id]
    tgtBox.pos = pos
    const newBoxes = { ...boxes, [arg.id]: tgtBox }
    return { def, facts, boxes: newBoxes, binds }
  }

  static extractFacts(root) {
    const { boxes } = root
    const factsAll = Object.entries(boxes)
      .map(([bk, bv]) => {
        return Object.entries(bv?.pieces)
          .filter(([pk, pv]) => {
            return pv.completed
          })
          .map(([pk, pv]) => {
            return pv.title
          })
      })
      .flat()
    return _.uniq(factsAll)
  }

  static ADD_FACT(root, fact) {
    dg('[#ADD_FACT]', fact)
    const { def, facts } = root
    const newFacts = _.uniq([...(facts || []), fact])
    return Rezo.prepare({ def, facts: newFacts })
  }

  static REM_FACT(root, fact) {
    dg('[#REM_FACT]', fact)
    const { def, facts } = root
    _.pull(facts, fact)
    return Rezo.prepare({ def, facts })
  }

  static changePiecesSort(pieces, tgtPieceId, isUp) {
    const pieceArr = Object.entries(pieces).map(([pk, pv], idx) => {
      pv.sort = idx
      pv.subkey = 0
      return [pk, pv]
    })
    const [tpk, tpv] = pieceArr.find(([pk, pv]) => pk === tgtPieceId)
    tpv.sort = tpv.sort + (isUp ? -1 : 1)
    tpv.subkey = isUp ? -1 : 1
    pieceArr.sort(([ak, av], [bk, bv]) => {
      if (av.sort !== bv.sort) {
        return av.sort - bv.sort
      }
      return av.subkey - bv.subkey
    })
    pieceArr.forEach(([pk, pv], idx) => {
      _.unset(pv, 'subkey')
      pv.sort = idx
    })
    return Object.fromEntries(pieceArr)
  }

  static restoreSaveData(savedata) {
    return JSON.parse(savedata)
  }

  static makeSaveData(root) {
    const { def, facts } = root
    def.meta.lastUpdate = dayjs().format()
    const data = { def, facts }
    return JSON.stringify(data, null, 2)
  }

  static downloadByUrl(filename, url) {
    const anchor = document.createElement('a')
    anchor.setAttribute('href', url)
    anchor.setAttribute('download', filename)
    const mouseEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window,
    })
    anchor.dispatchEvent(mouseEvent)
  }

  static downloadAsJson(filename, textdata) {
    const blob = new Blob([textdata], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    Rezo.downloadByUrl(filename, url)
  }

  static receiveJsonFile(acceptedFiles) {
    dg('receiveJsonFile')
    return new Promise((resolve, reject) => {
      const file = acceptedFiles[0]
      const reader = new FileReader()
      reader.onabort = () => reject('file reading was aborted')
      reader.onerror = () => reject('file reading has failed')
      reader.onload = () => {
        const jsonText = reader.result
        resolve(jsonText)
      }
      reader.readAsText(file)
    })
  }

  static getTimestampLabel(timestamp) {
    return dayjs(timestamp).format('YYYY-MM-DD HH:mm:ss')
  }

  static getMemoriesSummary() {
    const memories = Object.entries(_.forOwn(window.localStorage))
      .filter(([k, v]) => {
        return k.startsWith('savedata-')
      })
      .map(([k, v]) => {
        // TODO: Save data validation
        const { head, meta } = JSON.parse(v).def
        meta.lastUpdateLabel = Rezo.getTimestampLabel(meta.lastUpdate)
        return { id: k, head, meta }
      })
    memories.sort((a, b) => {
      return b.meta.lastUpdate.localeCompare(a.meta.lastUpdate)
    })
    return memories
  }
}
