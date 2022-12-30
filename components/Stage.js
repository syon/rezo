import React, { useState } from 'react'
import { Stage, Layer, Text } from 'react-konva'
import { useSelector, useDispatch } from 'react-redux'
import { rd, erd } from '../store/rootSlice'
import Rezo from '../lib/Rezo'
import Himo from './Himo'

const StageComponent = () => {
  const rezoRoot = useSelector((state) => state.rezo.root)
  const [pos, setPos] = useState({})
  const dispatch = useDispatch()

  React.useEffect(() => {
    dispatch(erd.initRoot())
  }, [dispatch])

  const handleStageClick = () => {
    dispatch(rd.closeHud())
  }

  const handleStageDblClick = (e) => {
    const stage = e.target.getStage()
    const { x, y } = stage.getRelativePointerPosition()
    dispatch(rd.newNode({ pos: { x, y } }))
  }

  const handleStageMove = (e) => {
    const stage = e.target.getStage()
    const { x, y } = stage.getRelativePointerPosition()
    setPos({ x, y })
  }

  const boxes = Rezo.createAllBoxes(rezoRoot.boxes)
  const binds = Rezo.createAllWires(rezoRoot)

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      draggable
      onClick={handleStageClick}
      onDblClick={handleStageDblClick}
      onMouseMove={handleStageMove}
    >
      <Layer>
        {boxes}
        {binds}
        <Himo mousepos={pos} />
        <Text x={10} y={10} text={`X${pos.x} Y${pos.y}`} />
      </Layer>
    </Stage>
  )
}

export default StageComponent
