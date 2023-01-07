import Debug from 'debug'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import Rezo from '../lib/Rezo'
import _ from 'lodash'

const dg = Debug('@:$:slice')

const initRoot = createAsyncThunk('rezo/initRoot', async () => {
  if (_.isEmpty(window.localStorage.savedata)) {
    dg('[#initRoot(Thunk)] Load from remote')
    return await Rezo.fetchRemote()
  }
  dg('[#initRoot(Thunk)] Load from localStorage')
  return JSON.parse(window.localStorage.savedata)
})

const sliceArg = {
  name: 'rezo',
  initialState: {
    root: {},
    stage: {
      drop: false,
    },
    drawer: {
      app: false,
      node: false,
    },
    activeNodeId: null,
    himo: {
      active: false,
      childId: null,
      childPos: {},
    },
    teleport: {
      active: false,
      pos: {},
      piece: null,
      node: null,
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
    refresh(state, action) {
      const { def, facts } = state.root
      state.root = Rezo.prepare({ def, facts })
    },
    autoSave(state, action) {
      dg('[#autoSave]')
      const savedata = Rezo.makeSaveData(state.root)
      window.localStorage.savedata = savedata
    },
    refreshAndSave(state, action) {
      dg('[#refreshAndSave]')
      slice.caseReducers.refresh(state, action)
      slice.caseReducers.autoSave(state, action)
    },
    openStageDropzone(state, action) {
      state.drawer.app = false
      state.stage.drop = true
    },
    closeStageDropzone(state, action) {
      state.stage.drop = false
    },
    openAppDrawer(state, action) {
      state.drawer.app = true
    },
    activateNode(state, action) {
      state.drawer.node = true
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
    tereportPieceFrom(state, action) {
      dg('[#tereportPieceFrom]', action.payload)
      const { node, piece, pos } = action.payload
      state.teleport.active = true
      state.teleport.pos = pos
      state.teleport.piece = piece
      state.teleport.node = node
    },
    tereportPieceTo(state, action) {
      dg('[#tereportPieceTo]', action.payload)
      const toNodeId = action.payload
      const { structure } = state.root.def
      const { node: fromNodeId, piece: pId } = state.teleport
      if (fromNodeId !== toNodeId) {
        structure[toNodeId].pieces[pId] = structure[fromNodeId].pieces[pId]
        _.unset(structure[fromNodeId].pieces, pId)
      }
      state.teleport.active = false
      state.teleport.pos = {}
      state.teleport.piece = null
      state.teleport.node = null
      slice.caseReducers.refreshAndSave(state, action)
    },
    closeHud(state) {
      state.drawer.app = false
      state.drawer.node = false
    },
    addPiece(state, action) {
      const { id, text } = action.payload
      const { def } = state.root
      const pieceId = Math.random().toString(36).slice(-4)
      def.structure[id].pieces[pieceId] = { sort: 0 }
      def.master[pieceId] = { title: text }
      slice.caseReducers.refreshAndSave(state, action)
    },
    editPiece(state, action) {
      dg('[#editPiece]', action.payload)
      const { id: pieceId, title } = action.payload
      const { def } = state.root
      def.master[pieceId].title = title
      slice.caseReducers.refreshAndSave(state, action)
    },
    removePiece(state, action) {
      dg('[#removePiece]', action.payload)
      const pieceId = action.payload
      const { def } = state.root
      _.unset(def.structure[state.activeNodeId].pieces, pieceId)
      slice.caseReducers.refreshAndSave(state, action)
    },
    changePieceSort(state, action) {
      dg('[#changePieceSort]', action.payload)
      const { id: pieceId, isUp } = action.payload
      const { def } = state.root
      const pieces = def.structure[state.activeNodeId].pieces
      const newPieces = Rezo.changePiecesSort(pieces, pieceId, isUp)
      def.structure[state.activeNodeId].pieces = newPieces
      slice.caseReducers.refreshAndSave(state, action)
    },
    newNode(state, action) {
      dg('[#newNode]', action.payload)
      const { pos } = action.payload
      const { def } = state.root
      const id = Math.random().toString(36).slice(-4)
      def.structure[id] = { pos, pieces: {} }
      def.master[id] = { title: '新しい項目' }
      slice.caseReducers.refreshAndSave(state, action)
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
      slice.caseReducers.refreshAndSave(state, action)
    },
    editNode(state, action) {
      dg('[#editNode]', action.payload, state.activeNodeId)
      const { title } = action.payload
      const { def } = state.root
      const tgtMaster = def.master[state.activeNodeId] || {}
      tgtMaster.title = title
      def.master[state.activeNodeId] = tgtMaster
      slice.caseReducers.refreshAndSave(state, action)
    },
    removeNode(state, action) {
      dg('[#removeNode]')
      const { def } = state.root
      _.unset(def.structure, state.activeNodeId)
      slice.caseReducers.refreshAndSave(state, action)
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
      slice.caseReducers.refreshAndSave(state, action)
    },
    cancelHimo(state, action) {
      state.himo = {
        active: false,
        childId: null,
        childPos: {},
      }
    },
    loadSaveData(state, action) {
      dg('[#loadSaveData]', action.payload)
      window.localStorage.savedata = action.payload
      window.location.reload()
    },
    deleteSaveData(state, action) {
      dg('[#deleteSaveData]')
      window.localStorage.removeItem('savedata')
      window.location.reload()
    },
    fileDownload(state, action) {
      dg('[#fileDownload]')
      const savedata = Rezo.makeSaveData(state.root)
      Rezo.downloadAsJson('rezo.json', savedata)
    },
    downloadAsPNG(state, action) {
      dg('[#downloadAsPNG]')
      const url = action.payload
      Rezo.downloadByUrl('rezo.png', url)
    },
  },
  // https://redux-toolkit.js.org/api/createAsyncThunk
  extraReducers: (builder) => {
    builder.addCase(initRoot.fulfilled, (state, action) => {
      dg('[#initRoot(extra)]', action.payload)
      state.root = Rezo.prepare(action.payload)
    })
  },
}

const slice = createSlice(sliceArg)

export const sl = sliceArg.selectors
export const rd = slice.actions
export const erd = { initRoot }

export default slice.reducer
