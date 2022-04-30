import { v4 as uuid } from 'uuid'
import ComputedResultJson from '@/db/ComputedResult.json'

export const state = () => ({
  questdata: ComputedResultJson.questSet,
  bonddata: ComputedResultJson.bonds,
  factdata: ComputedResultJson.facts,
})

export const getters = {
  questBoxSet(state) {
    return state.questdata
  },
  questBonds(state) {
    return state.bonddata
  },
  questFacts(state) {
    return state.factdata
  },
}

export const mutations = {
  addQuest(state, item) {
    const { id, x, y, reqs } = item
    const obj = { x, y, reqs }
    state.questdata = { ...state.questdata, [id]: obj }
  },
  changeQuest(state, item) {
    const { id, x, y } = item
    const obj = state.questdata[id] || {}
    const after = { ...obj, x, y }
    state.questdata = { ...state.questdata, [id]: after }
  },
}

export const actions = {
  addQuestItem({ commit }) {
    const id = uuid().slice(0, 8)
    const item = {
      id,
      title: '新しいタイトル',
      x: 500,
      y: 200,
      sockets: [],
    }
    commit('addQuest', item)
  },
  changeQuestItem({ commit }, payload) {
    const { id, x: rawX, y: rawY } = payload
    const x = Math.floor(rawX)
    const y = Math.floor(rawY)
    const item = { id, x, y }
    commit('changeQuest', item)
  },
}
