import axios from 'axios'
import * as types from '../constants/ActionTypes'
import moment from 'moment'
import qs from 'qs'
import { push as navigate, goBack as navigateBack } from 'react-router-redux'
import _ from 'lodash'
import Config from 'Config'

const API_URL = `${Config.App.api.host}:${Config.App.api.port}/api`

export function push (destination) {
  return (dispatch) => {
    dispatch(navigate(destination))
  }
}

export function goBack () {
  return (dispatch) => {
    dispatch(navigateBack())
  }
}

export function getCategoryNames () {
  return (dispatch) => {
    return axios.get(`${API_URL}/tasks/categories`)
         .then(response => {
           dispatch({
             type: types.GET_CATEGORY_NAMES,
             payload: response.data
           })
         })
         .catch((error) => dispatch(setError('Unable to load categories.', error)))
  }
}

export function getTodos (mode) {
  return (dispatch) => {
    dispatch(setBusy(true))

    const params = {}
    if (mode === 'today') {
      params.dueDate = moment().format('YYYY-MM-DD')
    } else if (mode === 'week') {
      params.dueDate = moment().endOf('isoWeek').format('YYYY-MM-DD')
    }

    return axios.get(`${API_URL}/tasks${_.isEmpty(params) ? '' : '?'}${qs.stringify(params)}`)
         .then(response => {
           dispatch({
             type: types.GET_TODOS,
             payload: response.data
           })
         })
         .catch((error) => dispatch(setError('Unable to load tasks.', error)))
  }
}

export function getTodo (id) {
  return (dispatch) => {
    dispatch(setBusy(true))

    return axios.get(`${API_URL}/tasks/${id}`)
         .then(response => {
           dispatch({
             type: types.GET_TODO,
             payload: response.data
           })
         })
         .catch((error) => dispatch(setError('Unable to get task.', error)))
  }
}

export function startAddTodo () {
  return { type: types.START_ADD_TODO }
}

export function cancelAddEditTodo () {
  return { type: types.CANCEL_ADD_EDIT_TODO }
}

export function addTodo (task) {
  return (dispatch) => {
    dispatch(setBusy(true))

    prepareTask(task)

    return axios.post(`${API_URL}/tasks`, task)
         .then(response => {
           dispatch({
             type: types.ADD_TODO,
             task
           })

           dispatch(push('/'))
         })
         .catch((error) => dispatch(setError('Unable to create new task.', error)))
  }
}

export function deleteTodo (id) {
  return (dispatch) => {
    return axios.delete(`${API_URL}/tasks/${id}`)
         .then(response => {
           dispatch({
             type: types.DELETE_TODO,
             id
           })
         })
         .catch((error) => dispatch(setError('Unable to delete task.', error)))
  }
}

export function rescheduleTodo (task) {
  return updateTodo(task, true)
}

export function editTodo (task) {
  return updateTodo(task, false)
}

function updateTodo (task, isReschedule) {
  return (dispatch) => {
    dispatch(setBusy(true))

    prepareTask(task)

    return axios.put(`${API_URL}/tasks/${task._id}`, task)
         .then(response => {
           dispatch({
             type: types.EDIT_TODO,
             task
           })

           if (!isReschedule) {
             dispatch(navigateBack())
           }
         })
         .catch((error) => dispatch(setError('Unable to update task.', error)))
  }
}

export function completeTodo (id) {
  return (dispatch) => {
    return axios.post(`${API_URL}/tasks/${id}/complete`)
         .then(response => {
           dispatch({
             type: types.COMPLETE_TODO,
             id
           })
         })
         .catch((error) => dispatch(setError('Unable to complete task.', error)))
  }
}

export function uncompleteTodo (id) {
  return (dispatch) => {
    return axios.delete(`${API_URL}/tasks/${id}/complete`)
         .then(response => {
           dispatch({
             type: types.UNCOMPLETE_TODO,
             id
           })
         })
         .catch((error) => dispatch(setError('Unable to un-complete task.', error)))
  }
}

export function cleanup () {
  return (dispatch) => {
    return axios.post(`${API_URL}/tasks/cleanup`, null, {validateStatus: status => status < 400})
         .catch(error => console.error(error))
  }
}

export function openDeleteConfirmation (todo) {
  return { type: types.OPEN_DELETE_CONFIRMATION, todo }
}

export function closeDeleteConfirmation () {
  return { type: types.CLOSE_DELETE_CONFIRMATION }
}

export function setBusy (busy) {
  return { type: types.SET_BUSY, busy }
}

export function setError (message, error) {
  return { type: types.SET_ERROR, error: message }
}

function prepareTask (task) {
  if (task.dueDate) {
    task.dueDate = moment(task.dueDate).startOf('day').format('YYYY-MM-DD')
  } else {
    delete task.dueDate
  }

  if (task.repeat) {
    if (!task.repeat.rate || !task.repeat.unit) {
      delete task.repeat
    } else {
      task.repeat.rate = parseInt(task.repeat.rate)
    }
  }
}
