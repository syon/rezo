import Debug from 'debug'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Rezo from '../lib/Rezo'

const dg = Debug('@:$:slice')

const initRoot = createAsyncThunk('rezo/initRoot', Rezo.fetchRemote)

const rootSlice = createSlice({
  name: 'rezo',
  initialState: {
    root: {},
    isHud: false,
    activeNodeId: null,
  },
  reducers: {
    refresh(state) {
      const { def, facts } = state.root
      state.root = Rezo.prepare({ def, facts })
    },
    activateNode(state, action) {
      state.isHud = true
      state.activeNodeId = action.payload
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
    closeHud(state) {
      state.isHud = false
    },
    addPiece(state, action) {
      const { id, text } = action.payload
      const { def } = state.root
      const pieceId = Math.random().toString(36).slice(-4)
      def.structure[id].pieces[pieceId] = { sort: 0 }
      def.master[pieceId] = { title: text }
      rootSlice.caseReducers.refresh(state, action)
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
