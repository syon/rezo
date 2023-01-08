import React from 'react'
import { useDispatch } from 'react-redux'
import StageDropzone from './hud/StageDropzone'
import MemoryDialog from './hud/MemoryDialog'
import AppDrawer from './hud/AppDrawer'
import NodeDrawer from './hud/NodeDrawer'
import { rd } from '../store/rootSlice'

const Stage = React.lazy(() => import('./Stage'))

const FloorComponent = () => {
  const dispatch = useDispatch()

  const onDragOver = () => {
    dispatch(rd.openStageDropzone())
  }

  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <div onDragOver={onDragOver}>
        <Stage />
      </div>
      <NodeDrawer />
      <AppDrawer />
      <StageDropzone />
      <MemoryDialog />
    </React.Suspense>
  )
}

export default FloorComponent
