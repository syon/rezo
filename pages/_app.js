import '../styles/globals.css'
import React from 'react'
import { RecoilRoot } from 'recoil'

function MyApp({ Component, pageProps }) {
  return (
    <RecoilRoot>
      <React.Suspense fallback={<div>Loading...</div>}>
        <Component {...pageProps} />
      </React.Suspense>
    </RecoilRoot>
  )
}

export default MyApp
