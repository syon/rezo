import { Circle } from 'react-konva'
import { useDispatch } from 'react-redux'
import { rd } from '../store/rootSlice'

export default function NodePieceKnot(props) {
  const { x, y, nid, pid, piece } = props
  const dispatch = useDispatch()

  const handleClickKnot = (e) => {
    e.cancelBubble = true
    dispatch(rd.toggleFold({ nodeId: nid, pieceId: pid }))
  }

  const fill = piece.fold ? 'rgb(56 189 248)' : '#e2e8f0'

  return piece.hasNode ? (
    <Circle x={x} y={y} radius={5} fill={fill} onClick={handleClickKnot} />
  ) : null
}
