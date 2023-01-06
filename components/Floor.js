import React from 'react'
import AppDrawer from './hud/AppDrawer'
import NodeDrawer from './hud/NodeDrawer'

const Stage = React.lazy(() => import('./Stage'))

const FloorComponent = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Stage />
      <NodeDrawer />
      <AppDrawer />
    </React.Suspense>
  )
}

export default FloorComponent
