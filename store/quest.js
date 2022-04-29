import questdataJson from '@/db/questdata.json'
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
    const { name, x, y, reqs } = item
    const obj = { x, y, reqs }
    state.questdata = { ...state.questdata, [name]: obj }
  },
  changeQuest(state, item) {
    const { name, x, y } = item
    const obj = state.questdata[name] || {}
    const after = { ...obj, x, y }
    state.questdata = { ...state.questdata, [name]: after }
  },
}

export const actions = {
  addQuestItem({ commit }) {
    const item = {
      name: 'hhh',
      x: 500,
      y: 200,
      reqs: ['Habc', 'Hdef'],
    }
    commit('addQuest', item)
  },
  changeQuestItem({ commit }, payload) {
    const { name, x: rawX, y: rawY } = payload
    const x = Math.floor(rawX)
    const y = Math.floor(rawY)
    const item = { name, x, y }
    commit('changeQuest', item)
  },
}
