import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { rd } from '../store/rootSlice'

export default function Hud(props) {
  const target = useSelector((state) => {
    const { root, activeNodeId } = state.rezo
    if (!activeNodeId) return {}
    const node = root.def.structure[activeNodeId]
    return { id: activeNodeId, ...node }
  })
  const { id, title, pieces } = target
  const dispatch = useDispatch()

  const pieceEntries = Object.entries(pieces || {})
  const pieceList = pieceEntries.map(([k, p], i) => {
    return <li key={k}>{p.title}</li>
  })

  const handleAddPiece = () => {
    dispatch(rd.addPiece({ id }))
  }

  return (
    <div className="Hud">
      [{id}] - {title}
      <ul>{pieceList}</ul>
      <button onClick={handleAddPiece}>add</button>
    </div>
  )
}
