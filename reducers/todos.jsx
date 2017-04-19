import * as types from '../constants/ActionTypes'
import _ from 'lodash'

const initialState = {
  categoryNames: [],
  categories: [],
  deleteConfirmation: {
    open: false
  },
  busy: true,
  addEditTask: null
}

export default function todos (state = initialState, action) {
  const newState = {...state, busy: false}

  switch (action.type) {
    case types.GET_CATEGORY_NAMES:
      newState.categoryNames = action.payload
      break

    case types.GET_TODOS:
      newState.categories = action.payload
      break

    case types.GET_TODO:
      newState.addEditTask = action.payload
      break

    case types.START_ADD_TODO:
      newState.addEditTask = {}
      break

    case types.CANCEL_ADD_EDIT_TODO:
      newState.addEditTask = null
      break

    case types.ADD_TODO:
      break

    case types.DELETE_TODO:
      // Remove the delete task
      newState.categories.forEach(c => {
        _.remove(c.tasks, t => t._id === action.id)
      })

      // Remove any empty categories (in case this was the last task in the category)
      _.remove(newState.categories, c => c.tasks.length === 0)

      // Close the confirmation dialog
      newState.deleteConfirmation.open = false
      break

    case types.EDIT_TODO:
      break

    case types.COMPLETE_TODO:
      newState.categories.forEach(c => {
        c.tasks.filter(t => t._id === action.id).forEach(t => { t.completed = true })
      })
      break

    case types.UNCOMPLETE_TODO:
      newState.categories.forEach(c => {
        c.tasks.filter(t => t._id === action.id).forEach(t => { t.completed = false })
      })
      break

    case types.OPEN_DELETE_CONFIRMATION:
      newState.deleteConfirmation = {
        open: true,
        todo: action.todo
      }
      break

    case types.CLOSE_DELETE_CONFIRMATION:
      newState.deleteConfirmation.open = false
      break

    case types.SET_BUSY:
      newState.busy = action.busy
      break

    case types.SET_ERROR:
      newState.error = action.error
      break
  }

  return newState
}
