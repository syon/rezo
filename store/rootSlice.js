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
    himo: {
      active: false,
      childId: null,
      childPos: {},
    },
  },
  selectors: {
    gHudTarget(globalState) {
      const { root, activeNodeId } = globalState.rezo
      if (!activeNodeId) return {}
      const node = root.boxes[activeNodeId]
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
    removePiece(state, action) {
      dg('[#removePiece]', action.payload)
      const pieceId = action.payload
      const { def } = state.root
      _.unset(def.structure[state.activeNodeId].pieces, pieceId)
      slice.caseReducers.refresh(state, action)
    },
    newNode(state, action) {
      dg('[#newNode]', action.payload)
      const { pos } = action.payload
      const { def } = state.root
      const id = Math.random().toString(36).slice(-4)
      def.structure[id] = { pos, pieces: {} }
      def.master[id] = { title: '新しい項目' }
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
    editNode(state, action) {
      dg('[#editNode]', action.payload, state.activeNodeId)
      const { title } = action.payload
      const { def } = state.root
      const tgtMaster = def.master[state.activeNodeId] || {}
      tgtMaster.title = title
      def.master[state.activeNodeId] = tgtMaster
      slice.caseReducers.refresh(state, action)
    },
    removeNode(state, action) {
      dg('[#removeNode]')
      const { def } = state.root
      _.unset(def.structure, state.activeNodeId)
      slice.caseReducers.refresh(state, action)
      slice.caseReducers.closeHud(state, action)
    },
    startHimo(state, action) {
      dg('[#startHimo]', action.payload)
      const { id, pos } = action.payload
      state.himo.active = true
      state.himo.childId = id
      state.himo.childPos = pos
    },
    endHimo(state, action) {
      dg('[#endHimo]', action.payload)
      const parentId = action.payload
      const { childId } = state.himo
      const { def } = state.root
      // TODO: Check Infinite Loop
      def.structure[parentId].pieces[childId] = { sort: 0 }
      slice.caseReducers.cancelHimo(state, action)
      slice.caseReducers.refresh(state, action)
    },
    cancelHimo(state, action) {
      state.himo = {
        active: false,
        childId: null,
        childPos: {},
      }
    },
    copyToClipboard(state, action) {
      const text = JSON.stringify(state.root.def, null, 2)
      window.navigator.clipboard.writeText(text)
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
