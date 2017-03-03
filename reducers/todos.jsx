import * as types from '../constants/ActionTypes';
import _ from 'lodash';

export default function todos(state = [], action) {
  let newState;

  switch (action.type) {
  case types.GET_TODOS:
    return action.payload;

  case types.ADD_TODO:
    return [{
      _id: state.reduce((maxId, todo) => Math.max(todo._id, maxId), -1) + 1,
      completed: false,
      name: action.text
    }, ...state];

  case types.DELETE_TODO:
    return state.filter(todo =>
      todo._id !== action.id
    );

  case types.EDIT_TODO:
    return state.map(todo =>
      todo._id === action.id ?
        Object.assign({}, todo, { name: action.text }) :
        todo
    );

  case types.COMPLETE_TODO:
    newState = [...state];
    _.forEach(newState, c => {
      _.filter(c.tasks, t => t._id === action.id).map(t => t.completed = true);
    });

    return newState;

  case types.UNCOMPLETE_TODO:
    newState = [...state];
    _.forEach(newState, c => {
      _.filter(c.tasks, t => t._id === action.id).map(t => t.completed = false);
    });

    return newState;

  default:
    return state;
  }
}
