export default function PieceLeftBtn(props) {
  const { icon, outline, accent, onClick } = props
  const classes = ['btn', 'btn-circle', 'btn-ghost', 'btn-xs']
  if (outline) classes.push('btn-outline')
  if (accent) classes.push('btn-accent')

  return (
    <button className={classes.join(' ')} onClick={onClick}>
      {icon}
    </button>
  )
}
