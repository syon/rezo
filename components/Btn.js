export default function PieceLeftBtn(props) {
  const { children, ghost, circle, outline, accent, size, onClick } = props
  const classes = ['btn']
  if (ghost) classes.push('btn-ghost')
  if (circle) classes.push('btn-circle')
  if (outline) classes.push('btn-outline')
  if (accent) classes.push('btn-accent')
  if (size) classes.push(`btn-${size}`)

  return (
    <button className={classes.join(' ')} onClick={onClick}>
      {children}
    </button>
  )
}
