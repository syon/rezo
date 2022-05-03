export const state = () => ({
  panel: null,
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
  SET_Panel(state, panel) {
    state.panel = panel
  },
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
  async init({ commit }, panel) {
    const url = `/api/panels/${panel}`
    commit('SET_Panel', panel)
    const computedResult = await this.$axios.$get(url)
    commit('SET_Data', computedResult)
  },
  updatePositionOnMemory({ commit }, payload) {
    const { id, x: rawX, y: rawY } = payload
    const x = Math.floor(rawX)
    const y = Math.floor(rawY)
    const item = { id, x, y }
    commit('changeQuest', item)
  },
  async addQuestItem({ state, dispatch }) {
    const data = {
      title: '新しいタイトル',
      x: 500,
      y: 200,
    }
    const panel = state.panel
    const url = `/api/panels/${panel}/quests`
    await this.$axios.$post(url, data)
    await dispatch('init')
  },
  async addSocket({ dispatch }, payload) {
    console.log('[#addSocket]', payload)
    const { questId, socketId, type } = payload
    const data = { id: socketId, type }
    const panel = state.panel
    const url = `/api/panels/${panel}/quests/${questId}/sockets`
    await this.$axios.$post(url, data)
    await dispatch('init')
  },
  async savePosition({ state }, payload) {
    const { boxId } = payload
    const { x, y } = state.questdata[boxId]
    const data = { x, y }
    const panel = state.panel
    const url = `/api/panels/${panel}/quests/${boxId}/position`
    await this.$axios.$post(url, data)
  },
  async updateFactStatus({ dispatch }, payload) {
    const { boxId, done } = payload
    const data = { done }
    const panel = state.panel
    const url = `/api/panels/${panel}/facts/${boxId}`
    await this.$axios.$post(url, data)
    await dispatch('init')
  },
}
