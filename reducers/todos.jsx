import { ADD_TODO, DELETE_TODO, EDIT_TODO, COMPLETE_TODO, COMPLETE_ALL, CLEAR_COMPLETED } from '../constants/ActionTypes';
import _ from 'lodash';

const initialState = [
  {
    _id: "Software",
    tasks: [
      {
        name: 'Use Redux',
        completed: false,
        _id: 0,
        dueDate: '2017-01-01',
        category: 'Software development' 
      },
      {
        name: 'Use Material UI',
        completed: false,
        _id: 1,
        dueDate: '2017-04-01',
        category: 'Software development'     
      }
    ]
  },
  {
    _id: "Test",
    tasks: [
      {
        name: 'Add more tasks',
        completed: false,
        _id: 2,
        dueDate: '2017-04-01',
        category: 'Test'     
      }      
    ]
  }
];

export default function todos(state = initialState, action) {
  switch (action.type) {
  case ADD_TODO:
    return [{
      _id: state.reduce((maxId, todo) => Math.max(todo._id, maxId), -1) + 1,
      completed: false,
      name: action.text
    }, ...state];

  case DELETE_TODO:
    return state.filter(todo =>
      todo._id !== action.id
    );

  case EDIT_TODO:
    return state.map(todo =>
      todo._id === action.id ?
        Object.assign({}, todo, { name: action.text }) :
        todo
    );

  case COMPLETE_TODO:
    const newState = [...state];
    _.forEach(newState, c => {
      _.filter(c.tasks, t => t._id === action.id).map(t => t.completed = !t.completed);
    });

    return newState;

  case COMPLETE_ALL:
    const areAllMarked = state.every(todo => todo.completed);
    return state.map(todo => Object.assign({}, todo, {
      completed: !areAllMarked
    }));

  case CLEAR_COMPLETED:
    return state.filter(todo => todo.completed === false);

  default:
    return state;
  }
}
