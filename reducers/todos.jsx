import * as types from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = {
  categories: []
}

export default function todos(state = initialState, action) {
  const newState = {...state};

  switch (action.type) {
    case types.GET_TODOS:
      newState.categories = action.payload;
      break;

    case types.ADD_TODO:
      break;      

    case types.DELETE_TODO:
      _.forEach(newState.categories, c => {
        _.remove(c.tasks, t => t._id === action.id);
      });
      
      _.remove(newState.categories, c => c.tasks.length === 0);
      break;

    case types.EDIT_TODO:      
      break;

    case types.COMPLETE_TODO:
      _.forEach(newState.categories, c => {
        _.filter(c.tasks, t => t._id === action.id).map(t => t.completed = true);
      });
      break;

    case types.UNCOMPLETE_TODO:
      _.forEach(newState.categories, c => {
        _.filter(c.tasks, t => t._id === action.id).map(t => t.completed = false);
      });
      break;
  }

  return newState;
}
