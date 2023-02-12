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

  const nodeElems = Rezo.createAllBoxes(rezoRoot?.boxes)
  const wireElems = Rezo.createAllWires(rezoRoot)

  React.useEffect(() => {
    const scaleBy = 1.01
    const stgCrr = stageRef.current
    stgCrr.on('wheel', (e) => {
      // stop default scrolling
      e.evt.preventDefault()

      const oldScale = stgCrr.scaleX()
      const pointer = stgCrr.getPointerPosition()

      const mousePointTo = {
        x: (pointer.x - stgCrr.x()) / oldScale,
        y: (pointer.y - stgCrr.y()) / oldScale,
      }

      // how to scale? Zoom in? Or zoom out?
      let direction = e.evt.deltaY > 0 ? 1 : -1

      // when we zoom on trackpad, e.evt.ctrlKey is true
      // in that case lets revert direction
      if (e.evt.ctrlKey) {
        direction = -direction
      }

      const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy

      stgCrr.scale({ x: newScale, y: newScale })

      const newPos = {
        x: pointer.x - mousePointTo.x * newScale,
        y: pointer.y - mousePointTo.y * newScale,
      }
      stgCrr.position(newPos)
    })
  }, [stageRef.current])

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

export default StageComponent

export const getStageRef = () => stageRef.current
