import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { rd } from '../../store/rootSlice'
import Btn from '../Btn'
import IconBtn from '../IconBtn'
import PieceLeftBtn from './PieceLeftBtn'

export default function PieceItem(props) {
  const { id, title: rawTitle, hasNode, completed } = props
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(rawTitle)
  const dispatch = useDispatch()

  const handleEdit = () => {
    setEditing(true)
  }

  const handleAddNode = () => {
    dispatch(rd.addNode({ id }))
  }

  const handleWarpNode = () => {
    dispatch(rd.activateNode(id))
  }

  const handleEditSubmit = () => {
    dispatch(rd.editPiece({ id, title }))
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return
    handleEditSubmit(e)
  }

  const handleAddFact = () => {
    if (!hasNode) {
      if (completed) {
        dispatch(rd.removeFact(title))
      } else {
        dispatch(rd.addFact(title))
      }
    }
  }

  const handleSort = (isUp) => {
    dispatch(rd.changePieceSort({ id, isUp }))
  }

  const handleRemovePiece = () => {
    dispatch(rd.removePiece(id))
  }

  const pieceClass = completed ? 'bg-green-50 border-green-300' : 'white'

  const viewingUI = (
    <div className="flex mb-2">
      <div className="w-8 flex justify-start items-center">
        {hasNode ? (
          <PieceLeftBtn icon="🔍" onClick={handleWarpNode} />
        ) : (
          <PieceLeftBtn icon="⬅️" outline accent onClick={handleAddNode} />
        )}
      </div>
      <div className={`flex-1 ${pieceClass} border rounded p-2`}>
        <div className="flex justify-between items-center">
          <div className="text-xs">
            {id} {hasNode ? '🔗' : ''}
          </div>
          <div>
            <IconBtn
              icon="↑"
              size="xs"
              onClick={() => {
                handleSort(true)
              }}
            />
            <IconBtn
              icon="↓"
              size="xs"
              onClick={() => {
                handleSort(false)
              }}
            />
            <Btn ghost size="xs" onClick={handleRemovePiece}>
              <span className="text-red-500">✕</span>
            </Btn>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span>{title}</span>
          <div>
            {editing ? null : (
              <IconBtn icon="✏️" size="sm" onClick={handleEdit} />
            )}
            <IconBtn
              icon={completed ? '✅' : '⬜'}
              size="sm"
              onClick={handleAddFact}
            />
          </div>
        </div>
      </div>
    </div>
  )

  const editingUI = (
    <div className="bg-white border rounded p-2 mb-2">
      <input
        type="text"
        value={title}
        autoFocus={true}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        className="input input-sm input-primary w-full max-w-xs"
      />
    </div>
  )

  return <>{editing ? editingUI : viewingUI}</>
}
