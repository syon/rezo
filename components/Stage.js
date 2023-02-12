import React, { useState } from 'react'
import { Stage, Layer } from 'react-konva'
import { useSelector, useDispatch } from 'react-redux'
import { rd } from '../store/rootSlice'
import Rezo from '../lib/Rezo'
import Himo from './Himo'
import TeleportWire from './TeleportWire'

let stageNode = null

const StageComponent = () => {
  const rezoRoot = useSelector((s) => s.rezo.root)
  const [pos, setPos] = useState({})
  const dispatch = useDispatch()

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

  const nodeElems = Rezo.Draw.createAllBoxes(rezoRoot?.boxes)
  const wireElems = Rezo.Draw.createAllWires(rezoRoot)

  const [stage, stageRef] = useStageRef()
  React.useEffect(() => {
    stageNode = stage
    Rezo.zoom(stage)
  }, [stage])

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
        {nodeElems}
        {wireElems}
        <Himo mousepos={pos} />
        <TeleportWire mousepos={pos} />
      </Layer>
    </Stage>
  )
}

export function useStageRef() {
  const [stage, setStage] = useState(null)
  const ref = React.useCallback((node) => {
    setStage(node)
  }, [])
  return [stage, ref]
}

export default StageComponent

export const getStageNode = () => stageNode
