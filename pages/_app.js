import Debug from 'debug'
import { Provider } from 'react-redux'
import '../styles/globals.scss'
import store from '../store'

if (process.env.NODE_ENV === 'development') {
  Debug.enable('@:*')
}

function MyApp({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <Component {...pageProps} />
    </Provider>
  )
}

export default MyApp
