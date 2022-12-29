import React from 'react'
import { Group, Rect, Line, Text } from 'react-konva'
import { useDispatch } from 'react-redux'
import { rd } from '../store/rootSlice'

export default function Node(props) {
  const { id, pos, title, completed, pieces } = props
  const dispatch = useDispatch()

  const onDragMove = (e) => {
    const { id, x, y } = e.target.attrs
    dispatch(rd.moveNode({ id, x, y }))
  }

  const pieceEntries = Object.entries(pieces || {})
  const percentText = calcPercent(pieceEntries)

  const pieceList = pieceEntries.map(([k, p], i) => {
    const y = 25 * i + 50
    const mark = p.completed ? '✅' : '⬜'
    const onClickPiece = async () => {
      if (!p.hasNode) {
        if (p.completed) {
          dispatch(rd.removeFact(p.title))
        } else {
          dispatch(rd.addFact(p.title))
        }
      }
    }
    return (
      <Group key={k} onClick={onClickPiece}>
        <Text x={20} y={y} text={p.title} />
        <Text x={170} y={y} text={mark} />
      </Group>
    )
  })

  const gx = pos?.x || 0
  const gy = pos?.y || 0
  const boxW = 200
  const boxH = 55 + 25 * pieceList.length
  const posText = `x:${gx} y:${gy}`
  const nodeCompleted = completed ? '✅' : '⬜'
  const bgColor = completed ? '#eeffee' : 'white'
  const strokeColor = completed ? 'lime' : 'black'

  return (
    <Group id={id} x={gx} y={gy} draggable onDragMove={onDragMove}>
      <Text x={10} y={-15} text={id} opacity={0.3} />
      <Text x={135} y={-15} text={posText} opacity={0.3} />
      <Rect
        x={0}
        y={0}
        width={boxW}
        height={boxH}
        stroke={strokeColor}
        strokeWidth={2}
        fill={bgColor}
      />
      <Line points={[0, 30, boxW, 30]} stroke={strokeColor} />
      <Text x={10} y={10} text={title} />
      <Text x={145} y={10} text={percentText} />
      <Text x={180} y={10} text={nodeCompleted} />
      {pieceList}
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
