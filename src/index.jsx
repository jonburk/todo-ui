import React from 'react'
import ReactDOM from 'react-dom'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { Provider } from 'react-redux'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import { syncHistoryWithStore } from 'react-router-redux'
import './favicon.ico'

import App from '../containers/App'
import TodoList from '../components/TodoList'
import AddEditTask from '../components/AddEditTask'
import configureStore from '../store/configureStore'

// Needed for React Developer Tools
window.React = React

// Needed for onTouchTap
// Can go away when react 1.0 release
// Check this repo:
// https://github.com/zilverline/react-tap-event-plugin
injectTapEventPlugin()

const store = configureStore()
const history = syncHistoryWithStore(browserHistory, store)

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <Route path='/' component={App}>
        <IndexRoute component={() => <TodoList mode='today' />} />
        <Route path='/all' component={() => <TodoList mode='all' />} />
        <Route path='/week' component={() => <TodoList mode='week' />} />
        <Route path='/add' component={() => <AddEditTask add />} />
        <Route path='/edit/:id' component={AddEditTask} />
      </Route>
    </Router>
  </Provider>,
  document.getElementById('root')
)
