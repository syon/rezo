import React from 'react'
const Stage = React.lazy(() => import('./Stage'))

const FloorComponent = () => {
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Stage />
    </React.Suspense>
  )
}

export default FloorComponent
