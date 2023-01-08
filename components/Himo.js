import { useSelector } from 'react-redux'
import Wire from './Wire'

export default function Himo(props) {
  const { mousepos } = props
  const himo = useSelector((s) => s.rezo.himo)

  const sp = himo.childPos
  const ep = mousepos

  return <Wire id="himo" sp={sp} ep={ep} color="red" />
}
