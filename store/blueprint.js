import axios from 'axios'
import CyanBox from '../components/CyanBox'
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
    return Object.entries(boxes || {}).map(([id, pos]) => {
      return <CyanBox id={id} key={id} {...pos} onMoving={onMoving} />
    })
  },
  createAllWires(root) {
    if (!root || !root.binds) return null
    return root.binds.map((bd, i) => {
      const sp = root.boxes[bd.from]
      const ep = root.boxes[bd.to]
      return <Wire key={i} sp={sp} ep={ep} />
    })
  },
}

export const $blueprint = {
  state,
  getter,
  helper,
}
