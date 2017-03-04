import axios from 'axios';
import * as types from '../constants/ActionTypes';

const API_URL = 'http://localhost:8080/api';

export function getTodos() {
  return (dispatch) => {
    axios.get(`${API_URL}/tasks`)
         .then(response => {
           dispatch({
             type: types.GET_TODOS,
             payload: response.data
           })
         })
         .catch(error => console.log(error));
  }
}

export function addTodo(text) {
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
         .catch(error => console.log(error));
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
         .catch(error => console.log(error));
  }
}

export function cleanup() {
  return (dispatch) => {
    axios.post(`${API_URL}/tasks/cleanup`, null, {validateStatus: status => status < 400})
         .catch(error => console.log(error));    
  }
}

export function openDeleteConfirmation(todo) {
  return { type: types.OPEN_DELETE_CONFIRMATION, todo };
}

export function closeDeleteConfirmation() {
  return { type: types.CLOSE_DELETE_CONFIRMATION };
}
