import React from 'react'
import { Group, Rect, Line, Text } from 'react-konva'

export default function Node(props) {
  const { id, pos: rawPos, title, pieces, onMoving } = props
  const [pos, setPos] = React.useState(rawPos)

  const onDragMove = (e) => {
    const { id, x, y } = e.target.attrs
    setPos({ x, y })
    onMoving({ id, x, y })
  }

  const pieceList = Object.entries(pieces || {}).map(([k, p], i) => {
    const y = 25 * i + 50
    return <Text key={k} x={20} y={y} text={p.title} />
  })

  const gx = pos?.x || 0
  const gy = pos?.y || 0
  const boxW = 200
  const boxH = 55 + 25 * pieceList.length

  return (
    <Group id={id} x={gx} y={gy} draggable onDragMove={onDragMove}>
      <Text x={10} y={-15} text={id} opacity={0.3} />
      <Rect
        x={0}
        y={0}
        width={boxW}
        height={boxH}
        stroke="black"
        strokeWidth={2}
        fill="white"
      />
      <Line points={[0, 30, boxW, 30]} stroke="black" />
      <Text x={10} y={10} text={title} />
      {pieceList}
    </Group>
  )
}
