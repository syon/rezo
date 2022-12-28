import { Path } from 'react-konva'

function computeBezierData({ sp, ep }) {
  const ap = { x: sp.x, y: sp.y }
  const zp = { x: ep.x, y: ep.y }
  const sh = { x: (ap.x + zp.x) / 2, y: ap.y }
  const eh = { x: (ap.x + zp.x) / 2, y: zp.y }
  const d = `M${ap.x},${ap.y} C${sh.x},${sh.y} ${eh.x},${eh.y} ${zp.x},${zp.y}`
  return d
}

export default function Wire(props) {
  const { id, sp, ep } = props
  if (!sp || !ep) return null
  const data = computeBezierData({ sp, ep })
  return <Path id={id} x={0} y={0} data={data} stroke="orange" />
}
