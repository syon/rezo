import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { sl, rd } from '../../store/rootSlice'
import PieceItem from './PieceItem'

export default function NodeDrawer(props) {
  const { node: active } = useSelector((s) => s.rezo.drawer)
  const target = useSelector(sl.gTargetNode)
  const { id, title: rawTitle, pieces } = target
  const dispatch = useDispatch()
  const [text, setText] = useState('')
  const [editing, setEditing] = useState(false)
  const [title, setTitle] = useState(rawTitle || '')

  React.useEffect(() => {
    setTitle(rawTitle || '')
  }, [rawTitle])

  const pieceEntries = Object.entries(pieces || {})
  const pieceList = pieceEntries.map(([id, p], i) => {
    return (
      <li key={id}>
        <PieceItem id={id} {...p} />
      </li>
    )
  })

  const handleEdit = () => {
    setEditing(true)
  }

  const handleAddPiece = () => {
    dispatch(rd.addPiece({ id, text }))
    setText('')
  }

  const handleKeyDownPiece = (e) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return
    handleAddPiece(e)
  }

  const handleEditSubmit = () => {
    dispatch(rd.editNode({ title }))
    setEditing(false)
  }

  const handleKeyDownTitle = (e) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return
    handleEditSubmit(e)
  }

  const handleRemoveNode = () => {
    dispatch(rd.removeNode())
  }

  const viewingUI = (
    <>
      <div className="text-lg font-bold">{rawTitle}</div>
      <div>
        {editing ? null : (
          <button className="btn btn-ghost btn-sm" onClick={handleEdit}>
            ✏️
          </button>
        )}
        <button
          className="btn btn-ghost btn-xs text-red-500"
          onClick={handleRemoveNode}
        >
          ✕
        </button>
      </div>
    </>
  )

  const editingUI = (
    <div className="bg-white border rounded p-2 mb-2">
      <input
        type="text"
        value={title}
        autoFocus={true}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDownTitle}
        className="input input-sm input-primary max-w-xs"
      />
      <button
        className="btn btn-ghost btn-xs"
        onClick={() => {
          setEditing(false)
        }}
      >
        Cancel
      </button>
    </div>
  )

  return (
    <div className={`NodeDrawer ${active ? 'active' : ''}`}>
      <div>
        <div className="text-xs">{id}</div>
        <div className="flex justify-between items-center">
          {editing ? editingUI : viewingUI}
        </div>
      </div>
      <ul className="mt-4">{pieceList}</ul>
      <hr className="my-4" />
      <div className="m-2">
        <input
          type="text"
          value={text}
          className="input input-bordered input-sm max-w-xs mr-2"
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDownPiece}
        />
        <button
          className="btn btn-outline btn-accent btn-xs"
          disabled={!text}
          onClick={handleAddPiece}
        >
          追加
        </button>
      </div>
    </div>
  )
}
