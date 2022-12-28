import React from 'react'
import { Stage, Layer } from 'react-konva'
import Rezo from '../lib/Rezo'

const StageComponent = () => {
  const [root, setRoot] = React.useState({})

  React.useEffect(() => {
    Rezo.getRemoteData().then((data) => {
      setRoot(data)
    })
  }, [setRoot])

  const onMoving = (arg) => {
    setRoot(Rezo.refreshRootOnMoving(root, arg))
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
