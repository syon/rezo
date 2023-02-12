import Debug from 'debug'
import _ from 'lodash'
import dayjs from 'dayjs'
import RezoDraw from './RezoDraw'
import BlankRootData from './BlankRootData.json'
import TutorialData from './TutorialData.json'

const dg = Debug('@:lib:Rezo')

export default class Rezo {
  static Draw = RezoDraw

  static autoSave(root) {
    const savedata = Rezo.makeSaveData(root)
    const ls = window.localStorage
    const memId = ls.activeMemoryId
    ls[memId] = savedata
  }

  static getActiveMemoryId() {
    return window.localStorage.activeMemoryId
  }

  static changeActiveMemoryId(memId) {
    window.localStorage.activeMemoryId = memId
  }

  static removeMemoryById(memId) {
    _.unset(window.localStorage, memId)
  }

  static createNewMemoryId() {
    const noList = Object.entries(_.forOwn(window.localStorage))
      .filter(([k, v]) => {
        return k.startsWith('savedata-')
      })
      .map(([k, v]) => {
        const no = k.match(/savedata-(?<no>\d\d)/).groups.no
        return Number(no)
      })
    const nextNo = (_.max(noList) || 0) + 1
    const nextNN = String(nextNo).padStart(2, '0')
    return `savedata-${nextNN}`
  }

  static addNewMemory(savedataText) {
    // TODO: validation
    const newMemId = Rezo.createNewMemoryId()
    window.localStorage.activeMemoryId = newMemId
    window.localStorage[newMemId] = savedataText
  }

  static loadRootByActiveMemoryId() {
    const ls = window.localStorage
    const memId = ls.activeMemoryId
    try {
      const savedataText = ls[memId]
      return JSON.parse(savedataText)
    } catch (e) {
      return null
    }
  }

  static loadRoot() {
    let root = Rezo.loadRootByActiveMemoryId()
    if (_.isEmpty(root)) {
      window.localStorage.activeMemoryId = 'savedata-01'
      if (_.isEmpty(window.localStorage['savedata-01'])) {
        const savedataText = Rezo.makeSaveData(TutorialData)
        Rezo.addNewMemory(savedataText)
        root = TutorialData
      } else {
        root = Rezo.loadRootByActiveMemoryId()
      }
    }
    return root
  }

  static loadBlankRootData() {
    return BlankRootData
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

  static getNowTimestamp() {
    return dayjs().format()
  }

  static makeSaveData(root) {
    const { def, facts } = root
    def.meta.lastUpdate = Rezo.getNowTimestamp()
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
    dg('[#getMemoriesSummary]')
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

  static zoom(stageNode) {
    if (!stageNode) return
    const scaleBy = 1.015
    stageNode.on('wheel', (e) => {
      e.evt.preventDefault()

      const oldScale = stageNode.scaleX()
      const pointer = stageNode.getPointerPosition()

      const mousePointTo = {
        x: (pointer.x - stageNode.x()) / oldScale,
        y: (pointer.y - stageNode.y()) / oldScale,
      }

      let direction = e.evt.deltaY > 0 ? 1 : -1

      // when we zoom on trackpad, e.evt.ctrlKey is true
      // in that case lets revert direction
      if (e.evt.ctrlKey) {
        direction = -direction
      }

      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

      stageNode.scale({ x: newScale, y: newScale })

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      }
      stageNode.position(newPos)
    })
  }
}
