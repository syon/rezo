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

  const handleSubmit = () => {
    dispatch(rd.editPiece({ id, title }))
    setEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.nativeEvent.isComposing || e.key !== 'Enter') return
    handleSubmit(e)
  }

  const viewingUI = (
    <div style="">
      <div>
        {id} {hasNode ? '🔗' : ''}
      </div>
      <span> {title} </span>
      {editing ? null : <button onClick={handleEdit}>編集</button>}
    </div>
  )

  const editingUI = (
    <input
      type="text"
      value={title}
      autoFocus={true}
      onChange={(e) => setTitle(e.target.value)}
      onKeyDown={handleKeyDown}
    />
  )

  return <>{editing ? editingUI : viewingUI}</>
}
