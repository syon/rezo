import React from 'react'
import { Group, Rect, Line, Text } from 'react-konva'

export default function CyanBox(props) {
  const { id, x, y, onMoving } = props
  const [pos, setPos] = React.useState({ x, y })

  const onDragMove = (e) => {
    const { id, x, y } = e.target.attrs
    setPos({ x, y })
    onMoving({ id, x, y })
  }

  return (
    <Group id={id} x={pos.x} y={pos.y} draggable onDragMove={onDragMove}>
      <Rect x={0} y={0} width={50} height={50} fill="cyan" opacity={0.5} />
      <Text
        x={3}
        y={3}
        text={`${pos.x}, ${pos.y}`}
        fontSize={12}
        fontFamily={'Calibri'}
        fill={'blue'}
        opacity={0.3}
      />
    </Group>
  )
}
