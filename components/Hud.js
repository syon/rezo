import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { sl, rd } from '../store/rootSlice'

export default function Hud(props) {
  const isHud = useSelector((state) => state.rezo.isHud)
  const target = useSelector(sl.gHudTarget)
  const { id, title, pieces } = target
  const dispatch = useDispatch()
  const [text, setText] = useState('')

  const pieceEntries = Object.entries(pieces || {})
  const pieceList = pieceEntries.map(([k, p], i) => {
    return <li key={k}>{p.title}</li>
  })

  const handleAddPiece = () => {
    dispatch(rd.addPiece({ id, text }))
    setText('')
  }

  return (
    <div className={`Hud ${isHud ? 'active' : ''}`}>
      [{id}] - {title}
      <ul>{pieceList}</ul>
      <hr />
      <div>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button disabled={!text} onClick={handleAddPiece}>
          add
        </button>
      </div>
    </div>
  )
}
