import Debug from 'debug'
import { Provider } from 'react-redux'
import '../styles/globals.scss'
import store from '../store'
import dynamic from 'next/dynamic'

const ErrorBoundary = dynamic(() => import('../components/ErrorBoundary'), {
  ssr: false,
})

if (process.env.NODE_ENV === 'development') {
  Debug.enable('@:*')
}

function MyApp({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
    </ErrorBoundary>
  )
}

export default MyApp
