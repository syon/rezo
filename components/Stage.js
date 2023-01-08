import React, { useState } from 'react'
import { Stage, Layer } from 'react-konva'
import { useSelector, useDispatch } from 'react-redux'
import { rd } from '../store/rootSlice'
import Rezo from '../lib/Rezo'
import Himo from './Himo'
import TeleportWire from './TeleportWire'

let stageRef = null

const StageComponent = () => {
  const rezoRoot = useSelector((s) => s.rezo.root)
  const [pos, setPos] = useState({})
  const dispatch = useDispatch()
  stageRef = React.useRef()

  React.useEffect(() => {
    dispatch(rd.initRoot())
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
      ref={stageRef}
    >
      <Layer>
        {boxes}
        {binds}
        <Himo mousepos={pos} />
        <TeleportWire mousepos={pos} />
      </Layer>
    </Stage>
  )
}

export default StageComponent

export const getStageRef = () => stageRef.current
