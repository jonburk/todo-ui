import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form'
import todos from './todos'

const rootReducer = combineReducers({
  todos,
  form: formReducer,
  routing: routerReducer
})

export default rootReducer
