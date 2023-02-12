import { Group, Text, Circle } from 'react-konva'
import { useDispatch } from 'react-redux'
import { rd } from '../store/rootSlice'
import Knot from './NodePieceKnot'

export default function NodePiece(props) {
  const { nid, pid, piece, gPos, oPos } = props
  const { x: gx, y: gy } = gPos
  const { x: ox, y: oy } = oPos
  const dispatch = useDispatch()

  const onDblClick = (e) => {
    e.cancelBubble = true
    const pos = { x: gx + ox, y: gy + oy + 5 }
    dispatch(rd.tereportPieceFrom({ node: nid, piece: pid, pos }))
  }

  const mark = piece.completed ? '✅' : '⬜'

  return (
    <Group onDblClick={onDblClick}>
      <Knot x={10} y={oy + 5} nid={nid} pid={pid} piece={piece} />
      <Text x={20} y={oy} text={piece.title} />
      <Text x={170} y={oy} text={mark} />
    </Group>
  )
}
