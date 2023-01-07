import { useSelector } from 'react-redux'
import Wire from './Wire'

export default function TeleportWire(props) {
  const { mousepos } = props
  const tele = useSelector((state) => state.rezo.teleport)

  const sp = tele.pos
  const ep = mousepos

  return <Wire id="TeleportWire" sp={sp} ep={ep} color="orange" />
}
