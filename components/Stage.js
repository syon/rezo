import React from 'react'
import { Stage, Layer } from 'react-konva'
import Rezo from '../lib/Rezo'
import { RootContext } from '../lib/RootContext'

const StageComponent = () => {
  const [root, setRoot] = React.useContext(RootContext)

  const onMoving = (arg) => {
    setRoot(Rezo.MOVE_NODE(root, arg))
  }

  const boxes = Rezo.createAllBoxes(root.boxes, onMoving)
  const binds = Rezo.createAllWires(root)

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
