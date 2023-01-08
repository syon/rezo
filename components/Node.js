import React, { useState } from 'react'
import { Group, Rect, Line, Text } from 'react-konva'
import { useSelector, useDispatch } from 'react-redux'
import NodePiece from './NodePiece'
import { rd } from '../store/rootSlice'

const isDebug = false

export default function Node(props) {
  const { id, pos, title, completed, pieces } = props
  const himo = useSelector((s) => s.rezo.himo)
  const teleport = useSelector((s) => s.rezo.teleport)
  const [draggable, setDraggable] = useState(true)
  const dispatch = useDispatch()

  const onClick = (e) => {
    e.cancelBubble = true
    if (himo.active) {
      dispatch(rd.endHimo(id))
    } else if (teleport.active) {
      dispatch(rd.tereportPieceTo(id))
    } else {
      dispatch(rd.activateNode(id))
    }
  }

  const onDragMove = (e) => {
    const { id, x, y } = e.target.attrs
    dispatch(rd.moveNode({ id, x, y }))
  }

  const onDragEnd = () => {
    dispatch(rd.autoSave())
  }

  const pieceEntries = Object.entries(pieces || {})
  const percentText = calcPercent(pieceEntries)

  const gx = pos?.x || 0
  const gy = pos?.y || 0
  const boxW = 200

  const pieceList = pieceEntries.map(([k, p], i) => {
    const gPos = { x: gx, y: gy }
    const oPos = { x: boxW - 10, y: 25 * i + 50 }
    return (
      <NodePiece key={k} nid={id} pid={k} piece={p} gPos={gPos} oPos={oPos} />
    )
  })

  const handleClickStick = (e) => {
    e.cancelBubble = true
    const pos = { x: gx + 200, y: gy + 15 }
    dispatch(rd.startHimo({ id, pos }))
  }

  const boxH = 55 + 25 * pieceList.length
  const posText = `x:${gx} y:${gy}`
  const nodeCompleted = completed ? '✅' : '⬜'
  const bgColor = completed ? 'rgb(240 253 244)' : 'white'
  const strokeColor = completed ? 'rgb(134 239 172)' : 'rgb(0 0 0 / 80%)'

  return (
    <Group
      id={id}
      x={gx}
      y={gy}
      draggable={draggable}
      onClick={onClick}
      onDragMove={onDragMove}
      onDragEnd={onDragEnd}
    >
      {isDebug && <Text x={10} y={-15} text={id} opacity={0.3} />}
      {isDebug && <Text x={135} y={-15} text={posText} opacity={0.3} />}
      <Rect
        x={0}
        y={0}
        width={boxW}
        height={boxH}
        stroke={strokeColor}
        strokeWidth={2}
        fill={bgColor}
      />
      <Line points={[0, 30, boxW, 30]} stroke={strokeColor} strokeWidth={1} />
      <Text x={10} y={10} text={title} />
      <Text x={145} y={10} text={percentText} />
      <Text x={180} y={10} text={nodeCompleted} />
      {pieceList}
      <Rect
        x={201}
        y={-1}
        width={16}
        height={32}
        fill="hsl(210deg 30% 88%)"
        onClick={handleClickStick}
      />
    </Group>
  )
}

function calcPercent(pieceEntries) {
  if (pieceEntries.length === 0) return ''
  const completedCount = pieceEntries.filter(([k, p]) => p.completed).length
  const pieceCount = pieceEntries.length || 0
  const num = Math.round((completedCount / pieceCount) * 100)
  return `${num}%`
}
