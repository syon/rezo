import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { sl, rd } from '../store/rootSlice'
import PieceItem from './hud/PieceItem'

export default function Hud(props) {
  const isHud = useSelector((state) => state.rezo.isHud)
  const target = useSelector(sl.gHudTarget)
  const { id, title, pieces } = target
  const dispatch = useDispatch()
  const [text, setText] = useState('')

  const pieceEntries = Object.entries(pieces || {})
  const pieceList = pieceEntries.map(([id, p], i) => {
    return (
      <li key={id}>
        <PieceItem id={id} {...p} />
      </li>
    )
  })

  const handleAddPiece = () => {
    dispatch(rd.addPiece({ id, text }))
    setText('')
  }

  return (
    <div className={`Hud ${isHud ? 'active' : ''}`}>
      <div>
        <div className="text-xs">{id}</div>
        <div className="text-lg font-bold">{title}</div>
      </div>
      <ul className="mt-4">{pieceList}</ul>
      <hr className="my-4" />
      <div className="m-2">
        <input
          type="text"
          value={text}
          className="input input-bordered input-sm max-w-xs mr-2"
          onChange={(e) => setText(e.target.value)}
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
