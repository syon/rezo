import _ from 'lodash'
import dynamic from 'next/dynamic'

const Node = dynamic(() => import('../components/Node'), {
  ssr: false,
})
const Wire = dynamic(() => import('../components/Wire'), {
  ssr: false,
})

import TutorialData from './TutorialData.json'

export default class RezoDraw {
  static prepare({ def, fact }) {
    // dg('[#prepare]')
    const { boxes, binds } = RezoDraw.computeDraw(def, fact)
    return { def, fact, boxes, binds }
  }

  static judgeCompleted(def, fact, nodeKey) {
    const judgeCompletedInner = (nodeKey) => {
      const master = def.master[nodeKey]
      if (master.remote) {
        return fact.remoteTitles.includes(master.title)
      } else {
        return fact.localIds.includes(nodeKey)
      }
    }

    const onlyPiece = !def.structure[nodeKey]
    if (onlyPiece) {
      return judgeCompletedInner(nodeKey)
    }

    const nodePieces = def.structure[nodeKey]?.pieces || {}
    const isCompleted = Object.keys(nodePieces)
      .map((pk) => {
        const hasPieces = !_.isEmpty(def.structure[pk]?.pieces)
        if (hasPieces) {
          return RezoDraw.judgeCompleted(def, fact, pk)
        }
        return judgeCompletedInner(pk)
      })
      .every(Boolean)
    if (isCompleted) {
      fact.localIds = _.uniq([...fact.localIds, nodeKey])
    }
    return isCompleted
  }

  static collectOffspringIds(def, nodeId) {
    const pieces = def.structure[nodeId]?.pieces || {}
    let offspringIds = [nodeId]
    for (const pk of Object.keys(pieces)) {
      offspringIds = offspringIds.concat(RezoDraw.collectOffspringIds(def, pk))
    }
    return offspringIds
  }

  /**
   * 折りたたみ対象のすべての子孫が、折りたたみ外のノードと繋がっていないことを確認
   */
  static judgeClosedChildren(root, nodeId, ancestorIds) {
    const { def, binds } = root
    const myBinds = binds.filter((bd) => bd.from === nodeId)
    const onlyClosed = myBinds.every((bd) => {
      return ancestorIds.includes(bd.to)
    })
    if (!onlyClosed) {
      return false
    }
    ancestorIds.push(nodeId)
    const pieces = def.structure[nodeId]?.pieces || {}
    return Object.entries(pieces).every(([pk, pv]) => {
      return RezoDraw.judgeClosedChildren(root, pk, ancestorIds)
    })
  }

  static computeDraw(rawDef, rawFact) {
    if (!rawDef?.structure) return TutorialData
    const def = _.cloneDeep(rawDef)
    const fact = _.cloneDeep(rawFact)

    const allNodesArr = Object.entries(def.structure)

    const foldedList = []
    for (const [nk, nv] of allNodesArr) {
      Object.entries(nv.pieces).forEach(([pk, pv]) => {
        if (pv.fold) {
          foldedList.push({ nodeId: nk, pieceId: pk })
        }
      })
    }

    let hiddenNodeIds = []
    for (const { pieceId, nodeId } of foldedList) {
      hiddenNodeIds = hiddenNodeIds.concat(
        RezoDraw.collectOffspringIds(def, pieceId)
      )
    }

    const targetNodeArr = allNodesArr.filter(([nk, nv]) => {
      return !hiddenNodeIds.includes(nk)
    })

    const boxes = Object.fromEntries(
      targetNodeArr.map(([nk, nv]) => {
        nv.title = def.master[nk]?.title
        nv.completed = RezoDraw.judgeCompleted(def, fact, nk)
        nv.pieces = Object.fromEntries(
          Object.entries(nv.pieces || {}).map(([pk, pv]) => {
            pv.title = def.master[pk]?.title
            pv.hasNode = !!def.structure[pk]
            pv.completed = RezoDraw.judgeCompleted(def, fact, pk)
            return [pk, pv]
          })
        )
        return [nk, nv]
      })
    )

    const binds = targetNodeArr
      .map(([nk, nv]) => {
        if (!nv.pieces) return null
        return Object.entries(nv.pieces)
          .filter(([pk, pv]) => pv.hasNode)
          .map(([pk]) => {
            return { from: pk, to: nk }
          })
      })
      .flat()

    return { boxes, binds, fact }
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
}
