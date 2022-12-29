import Debug from 'debug'
import '../styles/globals.css'
import React from 'react'
import { RootContext } from '../lib/RootContext'
import Root from '../lib/Root'
import Rezo from '../lib/Rezo'

if (process.env.NODE_ENV === 'development') {
  Debug.enable('@:*')
}

function MyApp({ Component, pageProps }) {
  const [root, setRoot] = React.useState(new Root())

  React.useEffect(() => {
    Rezo.fetchRemote().then((data) => {
      const arg = Rezo.prepare(data)
      setRoot(new Root(arg))
    })
  }, [])

  return (
    <RootContext.Provider value={[root, setRoot]}>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Component {...pageProps} />
      </React.Suspense>
    </RootContext.Provider>
  )
}

export default MyApp
