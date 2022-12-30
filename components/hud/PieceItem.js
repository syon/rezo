import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { rd } from '../../store/rootSlice'

export default function PieceItem(props) {
  const { id, title: rawTitle, hasNode } = props
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

  const viewingUI = (
    <div className="flex mb-2">
      <div className="w-8 flex justify-start items-center">
        {hasNode ? (
          <button
            className="btn btn-circle btn-ghost btn-xs"
            onClick={handleWarpNode}
          >
            🔍
          </button>
        ) : (
          <button
            className="btn btn-circle btn-outline btn-accent btn-xs"
            onClick={handleAddNode}
          >
            ⬅️
          </button>
        )}
      </div>
      <div className="flex-1 bg-white border rounded p-2">
        <div className="text-xs">
          {id} {hasNode ? '🔗' : ''}
        </div>
        <div className="flex justify-between items-center">
          <span>{title}</span>
          <div>
            {editing ? null : (
              <button
                className="btn btn-outline btn-accent btn-xs"
                onClick={handleEdit}
              >
                編集
              </button>
            )}
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
