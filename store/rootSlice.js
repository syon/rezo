import Debug from 'debug'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Rezo from '../lib/Rezo'

const dg = Debug('@:$:slice')

const initRoot = createAsyncThunk('rezo/initRoot', Rezo.fetchRemote)

const rootSlice = createSlice({
  name: 'rezo',
  initialState: {
    root: {},
  },
  reducers: {
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
  // https://redux-toolkit.js.org/api/createAsyncThunk
  extraReducers: (builder) => {
    builder.addCase(initRoot.fulfilled, (state, action) => {
      dg('[#initRoot(extra)]')
      state.root = Rezo.prepare(action.payload)
    })
  },
})

export const rd = rootSlice.actions
export const erd = { initRoot }

export default rootSlice.reducer
