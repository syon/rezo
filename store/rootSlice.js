import Debug from 'debug'
import { createSlice } from '@reduxjs/toolkit'
import Rezo from '../lib/Rezo'

const dg = Debug('@:$:slice')

const rootSlice = createSlice({
  name: 'rezo',
  initialState: {
    root: {},
  },
  reducers: {
    initRoot(state, action) {
      dg('[#initRoot]')
      state.root = action.payload
    },
    moveNode(state, action) {
      const arg = action.payload
      const pos = { x: arg.x, y: arg.y }
      const { def } = state.root
      def.structure[arg.id].pos = pos
      rootSlice.caseReducers.refresh(state, action)
    },
    addFact(state, action) {
      dg('[#addFact]')
      const fact = action.payload
      const { facts } = state.root
      facts.push(fact)
      rootSlice.caseReducers.refresh(state, action)
    },
    removeFact(state, action) {
      dg('[#removeFact]')
      const fact = action.payload
      const { facts } = state.root
      _.pull(facts, fact)
      rootSlice.caseReducers.refresh(state, action)
    },
    refresh(state) {
      const { def, facts } = state.root
      state.root = Rezo.prepare({ def, facts })
    },
  },
})

export const rd = rootSlice.actions

export default rootSlice.reducer
