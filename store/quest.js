export const state = () => ({
  questdata: null,
  bonddata: null,
  factdata: null,
})

export const getters = {
  questBoxSet(state) {
    return state.questdata || {}
  },
  questBonds(state) {
    return state.bonddata || []
  },
  questFacts(state) {
    return state.factdata || {}
  },
}

export const mutations = {
  SET_Data(state, computedResult) {
    state.questdata = computedResult.questSet
    state.bonddata = computedResult.bonds
    state.factdata = computedResult.facts
  },
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
  async init({ commit }) {
    const computedResult = await this.$axios.$get(`/api/quests`)
    commit('SET_Data', computedResult)
  },
  async addQuestItem({ dispatch }) {
    const data = {
      title: '新しいタイトル',
      x: 500,
      y: 200,
    }
    await this.$axios.$post(`/api/quests`, data)
    await dispatch('init')
  },
  changeQuestItem({ commit }, payload) {
    const { id, x: rawX, y: rawY } = payload
    const x = Math.floor(rawX)
    const y = Math.floor(rawY)
    const item = { id, x, y }
    commit('changeQuest', item)
  },
  async addSocket({ dispatch }, payload) {
    console.log('[#addSocket]', payload)
    const { questId, socketId, type } = payload
    const data = { id: socketId, type }
    await this.$axios.$post(`/api/quests/${questId}/sockets`, data)
    await dispatch('init')
  },
}
