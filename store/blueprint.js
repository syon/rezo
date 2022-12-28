import axios from 'axios'
import Node from '../components/Node'
import Wire from '../components/Wire'

const state = {}

const getter = {}

const helper = {
  async getRemoteData() {
    const res = await axios.get('/api/blueprint')
    return res.data
  },
  createAllBoxes(boxes, onMoving) {
    if (!boxes) return null
    return Object.entries(boxes).map(([id, box]) => {
      return <Node id={id} key={id} {...box} onMoving={onMoving} />
    })
  },
  createAllWires(root) {
    if (!root || !root.binds) return null
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
  },
}

export const $blueprint = {
  state,
  getter,
  helper,
}
