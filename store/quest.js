import { v4 as uuid } from 'uuid'
import questdataJson from '@/db/ComputedQuestSet.json'
import bonddataJson from '@/db/bonddata.json'

export const state = () => ({
  questdata: questdataJson,
  bonddata: bonddataJson,
})

export const getters = {
  questBoxSet(state) {
    return state.questdata
  },
  questBonds(state) {
    return state.bonddata
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
  addQuestItem({ commit, dispatch }) {
    const id = uuid().slice(0, 8)
    const item = {
      id,
      x: 500,
      y: 200,
      reqs: ['Habc', 'Hdef'],
    }
    commit('addQuest', item)
    dispatch('calcQuest')
  },
  changeQuestItem({ commit }, payload) {
    const { id, x: rawX, y: rawY } = payload
    const x = Math.floor(rawX)
    const y = Math.floor(rawY)
    const item = { id, x, y }
    commit('changeQuest', item)
  },
}
