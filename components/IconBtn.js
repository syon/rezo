import Btn from './Btn'

export default function EmojiBtn(props) {
  const { icon, size, onClick } = props

  return (
    <Btn ghost xs size={size} onClick={onClick}>
      {icon}
    </Btn>
  )
}
