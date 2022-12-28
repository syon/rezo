import React from 'react'
import { Stage, Layer } from 'react-konva'
import { $blueprint } from '../store/blueprint'

const StageComponent = () => {
  const [root, setRoot] = React.useState({})

  React.useEffect(() => {
    $blueprint.helper.getRemoteData().then((data) => {
      setRoot(data)
    })
  }, [setRoot])

  const onMoving = (arg) => {
    const { boxes, binds } = root
    const pos = { x: arg.x, y: arg.y }
    const tgtBox = boxes[arg.id]
    tgtBox.pos = pos
    const newBoxes = { ...boxes, [arg.id]: tgtBox }
    setRoot({ boxes: newBoxes, binds })
  }

  const boxes = $blueprint.helper.createAllBoxes(root.boxes, onMoving)
  const binds = $blueprint.helper.createAllWires(root)

  return (
    <Stage width={window.innerWidth} height={window.innerHeight} draggable>
      <Layer>
        {boxes}
        {binds}
      </Layer>
    </Stage>
  )
}

export default StageComponent
