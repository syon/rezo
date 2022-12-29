import _ from 'lodash'
import axios from 'axios'
import Node from '../components/Node'
import Wire from '../components/Wire'

let _def = []
let _facts = []

export default class Rezo {
  static async getRemoteData() {
    const res = await axios.get('/api/blueprint')
    const { def, facts } = res.data
    const { boxes, binds } = Rezo.convertForDraw(def, facts)
    _def = def
    _facts = facts
    return { boxes, binds, facts: _facts }
  }

  static rebuild() {
    const { boxes, binds } = Rezo.convertForDraw(_def, _facts)
    return { boxes, binds, facts: _facts }
  }

  static judgeCompleted(def, facts, nodeKey) {
    const nodePieces = def.structure[nodeKey]?.pieces
    const nodeTitle = def.master[nodeKey]?.title
    if (_.isEmpty(nodePieces)) {
      return facts.includes(nodeTitle)
    }
    const completedList = Object.entries(nodePieces).map(([pk, pv]) => {
      const pTitle = def.master[pk]?.title
      const hasPieces = def.structure[pk]?.pieces?.length > 0
      if (hasPieces) {
        return judgeCompleted(def, facts, pk)
      }
      return facts.includes(pTitle)
    })
    const isCompleted = completedList.every(Boolean)
    if (isCompleted) {
      facts = _.uniq([...facts, nodeTitle])
    }
    return isCompleted
  }

  static convertForDraw(def, facts) {
    if (!def?.structure) return null
    const interFacts = [...facts]

    const boxes = Object.fromEntries(
      Object.entries(def.structure).map(([nk, nv]) => {
        nv.title = def.master[nk]?.title
        nv.completed = Rezo.judgeCompleted(def, interFacts, nk)
        nv.pieces = Object.fromEntries(
          Object.entries(nv.pieces || {}).map(([pk, pv]) => {
            pv.title = def.master[pk]?.title
            pv.hasNode = !!def.structure[pk]
            pv.completed = Rezo.judgeCompleted(def, interFacts, pk)
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

  static createAllBoxes(boxes, onMoving, onChange) {
    if (!boxes) return null
    return Object.entries(boxes).map(([id, box]) => {
      return (
        <Node
          id={id}
          key={id}
          {...box}
          onMoving={onMoving}
          onChange={onChange}
        />
      )
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

  static refreshRootOnMoving(root, arg) {
    const { boxes, binds } = root
    const pos = { x: arg.x, y: arg.y }
    const tgtBox = boxes[arg.id]
    tgtBox.pos = pos
    const newBoxes = { ...boxes, [arg.id]: tgtBox }
    return { boxes: newBoxes, binds }
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

  static ADD_FACT(fact) {
    _facts = _.uniq([..._facts, fact])
  }

  static REM_FACT(fact) {
    _.pull(_facts, fact)
  }
}
