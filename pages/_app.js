import Debug from 'debug'
import React from 'react'
import { Provider } from 'react-redux'
import '../styles/globals.css'
import store from '../store'

if (process.env.NODE_ENV === 'development') {
  Debug.enable('@:*')
}

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Component {...pageProps} />
      </React.Suspense>
    </Provider>
  )
}

export default MyApp
