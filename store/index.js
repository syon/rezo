import { configureStore } from '@reduxjs/toolkit'

import rootReducer from './rootSlice'

const store = configureStore({
  reducer: {
    rezo: rootReducer,
  },
})

export default store
