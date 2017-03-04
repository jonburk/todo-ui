import * as types from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = {
  categories: [],
  deleteConfirmation: {
    open: false
  }
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
    // Remove the delete task
    _.forEach(newState.categories, c => {
      _.remove(c.tasks, t => t._id === action.id);
    });
    
    // Remove any empty categories (in case this was the last task in the category)
    _.remove(newState.categories, c => c.tasks.length === 0);

    // Close the confirmation dialog
    newState.deleteConfirmation.open = false;
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

  case types.OPEN_DELETE_CONFIRMATION:
    newState.deleteConfirmation = {
      open: true,
      todo: action.todo
    }
    break;

  case types.CLOSE_DELETE_CONFIRMATION:
    newState.deleteConfirmation.open = false;
    break;
  }

  return newState;
}
