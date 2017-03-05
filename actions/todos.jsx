import axios from 'axios';
import * as types from '../constants/ActionTypes';
import moment from 'moment';
import qs from 'qs';

const API_URL = 'http://localhost:8080/api';

export function getTodos(all) {
  return (dispatch) => {
    dispatch(setBusy(true));

    const params = {}
    if (!all) {
      params.dueDate = moment().format('YYYY-MM-DD');
    }
    
    axios.get(`${API_URL}/tasks?${qs.stringify(params)}`)
         .then(response => {
           dispatch({
             type: types.GET_TODOS,
             payload: response.data
           })
         })
         .catch(() => dispatch(setError('Unable to load tasks.')));
  }
}

export function addTodo(text) {
  setBusy(true);
  return { type: types.ADD_TODO, text };
}

export function deleteTodo(id) {
  return (dispatch) => {
    axios.delete(`${API_URL}/tasks/${id}`)
         .then(response => {
           dispatch({
             type: types.DELETE_TODO, 
             id 
            })
         })
         .catch(() => dispatch(setError('Unable to delete task.')));
  }
}

export function editTodo(todo) {
  return (dispatch) => {
    axios.put(`${API_URL}/tasks/${todo._id}`, todo)    
         .then(response => {
           dispatch({ 
             type: types.EDIT_TODO,
             todo
            })
         })
         .catch(() => dispatch(setError('Unable to update task.')));
  }
}

export function completeTodo(id) {
  return (dispatch) => {
    axios.post(`${API_URL}/tasks/${id}/complete`)
         .then(response => {
           dispatch({
             type: types.COMPLETE_TODO,
             id
           })
         })
         .catch(() => dispatch(setError('Unable to complete task.')));
  }
}

export function uncompleteTodo(id) {
  return (dispatch) => {
    axios.delete(`${API_URL}/tasks/${id}/complete`)
         .then(response => {
           dispatch({
             type: types.UNCOMPLETE_TODO,
             id
           })
         })
         .catch(() => dispatch(setError('Unable to un-complete task.')));
  }
}

export function cleanup() {
  return (dispatch) => {
    axios.post(`${API_URL}/tasks/cleanup`, null, {validateStatus: status => status < 400})
         .catch(error => console.error(error));    
  }
}

export function openDeleteConfirmation(todo) {
  return { type: types.OPEN_DELETE_CONFIRMATION, todo };
}

export function closeDeleteConfirmation() {
  return { type: types.CLOSE_DELETE_CONFIRMATION };
}

export function setBusy(busy) {
  return { type: types.SET_BUSY, busy };
}

export function setError(error) {
  console.error(error);
  return { type: types.SET_ERROR, error };
}
