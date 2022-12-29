import React from 'react'
import { Stage, Layer } from 'react-konva'
import { useSelector, useDispatch } from 'react-redux'
import { erd } from '../store/rootSlice'
import Rezo from '../lib/Rezo'

const StageComponent = () => {
  const rezoRoot = useSelector((state) => state.rezo.root)
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(erd.initRoot())
  }, [dispatch])

  const boxes = Rezo.createAllBoxes(rezoRoot.boxes)
  const binds = Rezo.createAllWires(rezoRoot)

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
