import expect from 'expect';
import * as types from '../constants/ActionTypes';
import reducer from '../reducers/todos';

describe('actions', () => {
  describe('todos', () => {
    it('should return the initial state', () => {
      const expected = {
        categoryNames: [],
        categories: [],
        deleteConfirmation: {
          open: false
        },
        busy: false,
        addEditTask: null
      };

      expect(reducer(undefined, {})).toEqual(expected);
    });

    it('should return category names', () => {
      const payload = ['alpha', 'bravo'];

      const input = {
        type: types.GET_CATEGORY_NAMES,
        payload
      };

      const expected = {
        busy: false,
        categoryNames: payload
      };

      expect(reducer({}, input)).toEqual(expected);
    }); 

    it('should return todo list', () => {
      const payload = [
        {
          _id: 'Category',
          tasks: [{
            _id: '1',
            name: 'test'
          }]
        }
      ];

      const input = {
        type: types.GET_TODOS,
        payload
      };

      const expected = {
        busy: false,
        categories: payload
      };

      expect(reducer({}, input)).toEqual(expected);
    });

    it('should return a task', () => {
      const payload = {
        _id: '1',
        name: 'test'
      };

      const input = {
        type: types.GET_TODO,
        payload
      };

      const expected = {
        busy: false,
        addEditTask: payload
      };

      expect(reducer({}, input)).toEqual(expected);
    }); 

    it('should start adding a task', () => {

      const input = {
        type: types.START_ADD_TODO
      };

      const expected = {
        busy: false,
        addEditTask: {}
      };

      expect(reducer({}, input)).toEqual(expected);
    });  

    it('should start cancel adding a task', () => {

      const input = {
        type: types.CANCEL_ADD_EDIT_TODO
      };

      const expected = {
        busy: false,
        addEditTask: null
      };

      expect(reducer({ addEditTask: { name: 'test' } }, input)).toEqual(expected);
    });  

    it('should not change the state when adding a task', () => {

      const input = {
        type: types.ADD_TODO
      };

      const expected = {
        busy: false,
        foo: 'bar'
      };

      expect(reducer({ foo: 'bar' }, input)).toEqual(expected);
    });

    it('should remove a task', () => {
      const state = {
        deleteConfirmation: {
          open: true
        },
        categories: [
        {
          _id: 'Category 1',
          tasks: [
            {
              _id: '1',
              name: '1-1'
            },
            {
              _id: '2',
              name: '1-2'
            }
          ]
        },
        {
          _id: 'Category 2',
          tasks: [
            {
              _id: '3',
              name: '2-1'
            },
            {
              _id: '4',
              name: '2-2'
            }
          ]
        }        
      ]
      };

      const input = {
        type: types.DELETE_TODO,
        id: '3'
      };

      const expected = {
        busy: false,
        deleteConfirmation: {
          open: false
        },
        categories: [
        {
          _id: 'Category 1',
          tasks: [
            {
              _id: '1',
              name: '1-1'
            },
            {
              _id: '2',
              name: '1-2'
            }
          ]
        },
        {
          _id: 'Category 2',
          tasks: [
            {
              _id: '4',
              name: '2-2'
            }
          ]
        }        
      ]
      };

      expect(reducer(state, input)).toEqual(expected);
    });

    it('should remove a task and its empty category', () => {
      const state = {
        deleteConfirmation: {
          open: true
        },
        categories: [
        {
          _id: 'Category 1',
          tasks: [
            {
              _id: '1',
              name: '1-1'
            },
            {
              _id: '2',
              name: '1-2'
            }
          ]
        },
        {
          _id: 'Category 2',
          tasks: [
            {
              _id: '3',
              name: '2-1'
            }
          ]
        }        
      ]
      };

      const input = {
        type: types.DELETE_TODO,
        id: '3'
      };

      const expected = {
        busy: false,
        deleteConfirmation: {
          open: false
        },
        categories: [
        {
          _id: 'Category 1',
          tasks: [
            {
              _id: '1',
              name: '1-1'
            },
            {
              _id: '2',
              name: '1-2'
            }
          ]
        }
      ]
      };

      expect(reducer(state, input)).toEqual(expected);
    });

    it('should not change the state when editing a task', () => {

      const input = {
        type: types.EDIT_TODO
      };

      const expected = {
        busy: false,
        foo: 'bar'
      };

      expect(reducer({ foo: 'bar' }, input)).toEqual(expected);
    });

    it('should complete a task', () => {
      const state = {
        categories: [
        {
          _id: 'Category 1',
          tasks: [
            {
              _id: '1',
              name: '1-1'
            },
            {
              _id: '2',
              name: '1-2'
            }
          ]
        }       
      ]
      };

      const input = {
        type: types.COMPLETE_TODO,
        id: '2'
      };

      const expected = {
        busy: false,
        categories: [
        {
          _id: 'Category 1',
          tasks: [
            {
              _id: '1',
              name: '1-1'
            },
            {
              _id: '2',
              name: '1-2',
              completed: true
            }
          ]
        }      
      ]
      };

      expect(reducer(state, input)).toEqual(expected);
    });

    it('should un-complete a task', () => {
      const state = {
        categories: [
        {
          _id: 'Category 1',
          tasks: [
            {
              _id: '1',
              name: '1-1'
            },
            {
              _id: '2',
              name: '1-2',
              completed: true
            }
          ]
        }       
      ]
      };

      const input = {
        type: types.UNCOMPLETE_TODO,
        id: '2'
      };

      const expected = {
        busy: false,
        categories: [
        {
          _id: 'Category 1',
          tasks: [
            {
              _id: '1',
              name: '1-1'
            },
            {
              _id: '2',
              name: '1-2',
              completed: false
            }
          ]
        }      
      ]
      };

      expect(reducer(state, input)).toEqual(expected);
    });

    it('should open the delete confirmation', () => {
      const todo = {
        _id: '1',
        name: 'test'
      }

      const input = {
        type: types.OPEN_DELETE_CONFIRMATION,
        todo
      };

      const expected = {
        busy: false,
        deleteConfirmation: {
          open: true,
          todo
        }
      };

      expect(reducer({}, input)).toEqual(expected);
    }); 

    it('should close the delete confirmation', () => {
      const input = {
        type: types.CLOSE_DELETE_CONFIRMATION
      };

      const expected = {
        busy: false,
        deleteConfirmation: {
          open: false
        }
      };

      expect(reducer({ deleteConfirmation: {} }, input)).toEqual(expected);
    }); 

    it('should set the busy state', () => {
      const input = {
        type: types.SET_BUSY,
        busy: true
      };

      const expected = {
        busy: true
      };

      expect(reducer({ }, input)).toEqual(expected);
    });  

    it('should set the error state', () => {
      const input = {
        type: types.SET_ERROR,
        error: 'test'
      };

      const expected = {
        busy: false,
        error: 'test'
      };

      expect(reducer({ }, input)).toEqual(expected);
    });
  })
})