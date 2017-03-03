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
  return { type: types.DELETE_TODO, id };
}

export function editTodo(id, text) {
  return { type: types.EDIT_TODO, id, text };
}

export function completeTodo(id) {
  return { type: types.COMPLETE_TODO, id };
}

export function completeAll() {
  return { type: types.COMPLETE_ALL };
}

export function clearCompleted() {
  return { type: types.CLEAR_COMPLETED };
}
