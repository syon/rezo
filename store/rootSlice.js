import Debug from 'debug'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Rezo from '../lib/Rezo'
import _ from 'lodash'

const dg = Debug('@:$:slice')

const initRoot = createAsyncThunk('rezo/initRoot', Rezo.fetchRemote)

const sliceArg = {
  name: 'rezo',
  initialState: {
    root: {},
    isHud: false,
    activeNodeId: null,
  },
  selectors: {
    gHudTarget(globalState) {
      const { root, activeNodeId } = globalState.rezo
      if (!activeNodeId) return {}
      const node = root.def.structure[activeNodeId]
      return { id: activeNodeId, ...node }
    },
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
      slice.caseReducers.refresh(state, action)
    },
    addFact(state, action) {
      dg('[#addFact]')
      const fact = action.payload
      const { facts } = state.root
      facts.push(fact)
      slice.caseReducers.refresh(state, action)
    },
    removeFact(state, action) {
      dg('[#removeFact]')
      const fact = action.payload
      const { facts } = state.root
      _.pull(facts, fact)
      slice.caseReducers.refresh(state, action)
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
      slice.caseReducers.refresh(state, action)
    },
    editPiece(state, action) {
      dg('[#editPiece]', action.payload)
      const { id: pieceId, title } = action.payload
      const { def } = state.root
      def.master[pieceId].title = title
      slice.caseReducers.refresh(state, action)
    },
    addNode(state, action) {
      dg('[#addNode]', action.payload)
      const { id } = action.payload
      const { def } = state.root
      const curPos = def.structure[state.activeNodeId].pos
      def.structure[id] = {
        pos: { x: curPos.x - 250, y: curPos.y },
        pieces: {},
      }
      slice.caseReducers.refresh(state, action)
    },
    removeNode(state, action) {
      dg('[#removeNode]')
      const { def } = state.root
      _.unset(def.structure, state.activeNodeId)
      slice.caseReducers.refresh(state, action)
      slice.caseReducers.closeHud(state, action)
    },
  },
  // https://redux-toolkit.js.org/api/createAsyncThunk
  extraReducers: (builder) => {
    builder.addCase(initRoot.fulfilled, (state, action) => {
      dg('[#initRoot(extra)]')
      state.root = Rezo.prepare(action.payload)
    })
  },
}

const slice = createSlice(sliceArg)

export const sl = sliceArg.selectors
export const rd = slice.actions
export const erd = { initRoot }

export default slice.reducer
