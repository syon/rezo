import { Path } from 'react-konva'

function computeHandleS(apX, zpX) {
  const center = (apX + zpX) / 2
  const tension = Math.abs(apX - zpX) * 0.5
  if (center < apX + 20) {
    return apX + Math.max(100, tension)
  }
  return Math.max(center, apX + tension)
}

function computeHandleE(apX, zpX) {
  const center = (apX + zpX) / 2
  const tension = Math.abs(apX - zpX) * 0.5
  if (zpX - 20 < center) {
    return zpX - Math.max(100, tension)
  }
  return Math.min(center, zpX - tension)
}

function computeBezierData({ sp, ep }) {
  const ap = { x: sp.x, y: sp.y }
  const zp = { x: ep.x, y: ep.y }
  const sh = { x: computeHandleS(ap.x, zp.x), y: ap.y }
  const eh = { x: computeHandleE(ap.x, zp.x), y: zp.y }
  const d = `M${ap.x},${ap.y} C${sh.x},${sh.y} ${eh.x},${eh.y} ${zp.x},${zp.y}`
  return d
}

export default function Wire(props) {
  const { id, sp, ep, color } = props
  if (!sp || !ep) return null
  const stroke = color || 'rgb(56 189 248)'
  const data = computeBezierData({ sp, ep })
  return <Path id={id} x={0} y={0} data={data} stroke={stroke} strokeWidth={1} />
}
