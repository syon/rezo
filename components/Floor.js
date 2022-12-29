import React from 'react'
import Hud from './Hud'

const Stage = React.lazy(() => import('./Stage'))

const FloorComponent = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Hud />
      <Stage />
    </React.Suspense>
  )
}

export default FloorComponent
