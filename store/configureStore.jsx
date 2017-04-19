import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import { browserHistory } from 'react-router'
import rootReducer from '../reducers'

export default function configureStore () {
  const middleware = applyMiddleware(thunk, routerMiddleware(browserHistory))
  const store = createStore(rootReducer, middleware)

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducers', () => {
      const nextReducer = require('../reducers')
      store.replaceReducer(nextReducer)
    })
  }

  return store
}
