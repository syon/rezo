import Btn from './Btn'

export default function IconBtn(props) {
  const { icon, size, onClick } = props

  return (
    <Btn ghost xs size={size} onClick={onClick}>
      {icon}
    </Btn>
  )
}
