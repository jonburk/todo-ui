/* eslint-env jest */

import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as types from '../constants/ActionTypes'
import nock from 'nock'
import expect from 'expect'
import axios from 'axios'
import httpAdapter from 'axios/lib/adapters/http'
import moment from 'moment'

jest.mock(
    'Config',
    () => {
      return {
        App: {
          api: {
            host: 'https://example.com',
            port: 443
          }
        }
      }
    },
    {virtual: true}
  )

jest.mock(
  'react-router-redux',
  () => {
    return {
      push: jest.fn((destination) => {
        return {
          type: 'PUSH',
          destination
        }
      }),
      goBack: jest.fn(() => {
        return {
          type: 'GO_BACK'
        }
      })
    }
  }
)

const routerMock = require.requireMock('react-router-redux')
const actions = require('../actions/todos')

const mockStore = configureMockStore([ thunk ])
axios.defaults.adapter = httpAdapter

describe('actions', () => {
  describe('todos', () => {
    afterEach(() => {
      nock.cleanAll()
    })

    it('should push', () => {
      const store = mockStore({ })

      store.dispatch(actions.push('destination'))
      expect(routerMock.push.mock.calls.length).toBe(1)
      expect(routerMock.push.mock.calls[0][0]).toBe('destination')
    })

    it('should go back', () => {
      const store = mockStore({ })

      store.dispatch(actions.goBack())
      expect(routerMock.goBack.mock.calls.length).toBe(1)
    })

    it('should get category names', () => {
      nock('https://example.com:443')
        .get('/api/tasks/categories')
        .reply(200, [ 'alpha', 'bravo' ])

      const expectedActions = [
        {
          type: types.GET_CATEGORY_NAMES,
          payload: [ 'alpha', 'bravo' ]
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.getCategoryNames())
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should handle errors when getting category names', () => {
      nock('https://example.com:443')
        .get('/api/tasks/categories')
        .reply(500)

      const expectedActions = [
        {
          type: types.SET_ERROR,
          error: 'Unable to load categories.'
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.getCategoryNames())
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should get the todo list for today', () => {
      const tasks = [
        {
          _id: 'Test',
          tasks: [
            {
              id: '1',
              name: 'task'
            }
          ]
        }
      ]

      nock('https://example.com:443')
        .get('/api/tasks')
        .query({ dueDate: moment().format('YYYY-MM-DD') })
        .reply(200, tasks)

      const expectedActions = [
        {
          type: types.SET_BUSY,
          busy: true
        },
        {
          type: types.GET_TODOS,
          payload: tasks
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.getTodos('today'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should get the todo list for this week', () => {
      const tasks = [
        {
          _id: 'Test',
          tasks: [
            {
              id: '1',
              name: 'task'
            }
          ]
        }
      ]

      nock('https://example.com:443')
        .get('/api/tasks')
        .query({ dueDate: moment().endOf('isoWeek').format('YYYY-MM-DD') })
        .reply(200, tasks)

      const expectedActions = [
        {
          type: types.SET_BUSY,
          busy: true
        },
        {
          type: types.GET_TODOS,
          payload: tasks
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.getTodos('week'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should get the full todo list', () => {
      const tasks = [
        {
          _id: 'Test',
          tasks: [
            {
              id: '1',
              name: 'task'
            }
          ]
        }
      ]

      nock('https://example.com:443')
        .get('/api/tasks')
        .reply(200, tasks)

      const expectedActions = [
        {
          type: types.SET_BUSY,
          busy: true
        },
        {
          type: types.GET_TODOS,
          payload: tasks
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.getTodos('all'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should handle errors when getting the todo list', () => {
      nock('https://example.com:443')
        .get('/api/tasks')
        .reply(500)

      const expectedActions = [
        {
          type: types.SET_BUSY,
          busy: true
        },
        {
          type: types.SET_ERROR,
          error: 'Unable to load tasks.'
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.getTodos('all'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should get a task', () => {
      const task = {
        id: '1',
        name: 'test'
      }

      nock('https://example.com:443')
        .get('/api/tasks/1')
        .reply(200, task)

      const expectedActions = [
        {
          type: types.SET_BUSY,
          busy: true
        },
        {
          type: types.GET_TODO,
          payload: task
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.getTodo('1'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should handle errors when getting a task', () => {
      nock('https://example.com:443')
        .get('/api/tasks/1')
        .reply(500)

      const expectedActions = [
        {
          type: types.SET_BUSY,
          busy: true
        },
        {
          type: types.SET_ERROR,
          error: 'Unable to get task.'
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.getTodo('1'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should start the Add Todo process', () => {
      const expected = { type: types.START_ADD_TODO }
      const result = actions.startAddTodo()
      expect(result).toEqual(expected)
    })

    it('should cancel the Add/Edit Todo process', () => {
      const expected = { type: types.CANCEL_ADD_EDIT_TODO }
      const result = actions.cancelAddEditTodo()
      expect(result).toEqual(expected)
    })

    it('should add a task', () => {
      const input = {
        name: 'test',
        dueDate: '2020-01-02T01:01:01',
        repeat: {
          rate: '10',
          unit: 'days'
        }
      }

      const result = {
        name: 'test',
        dueDate: '2020-01-02',
        repeat: {
          rate: 10,
          unit: 'days'
        }
      }

      nock('https://example.com:443')
        .post('/api/tasks', result)
        .reply(201)

      const expectedActions = [
        {
          type: types.SET_BUSY,
          busy: true
        },
        {
          type: types.ADD_TODO,
          task: result
        },
        {
          type: 'PUSH',
          destination: '/'
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.addTodo(input))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should remove empty fields when adding a task', () => {
      const input = {
        name: 'test',
        dueDate: '',
        repeat: {
          rate: '10'
        }
      }

      const result = {
        name: 'test'
      }

      nock('https://example.com:443')
        .post('/api/tasks', result)
        .reply(201)

      const expectedActions = [
        {
          type: types.SET_BUSY,
          busy: true
        },
        {
          type: types.ADD_TODO,
          task: result
        },
        {
          type: 'PUSH',
          destination: '/'
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.addTodo(input))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should handle erros when adding a task', () => {
      const task = {
        name: 'test'
      }

      nock('https://example.com:443')
        .post('/api/tasks', task)
        .reply(500)

      const expectedActions = [
        {
          type: types.SET_BUSY,
          busy: true
        },
        {
          type: types.SET_ERROR,
          error: 'Unable to create new task.'
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.addTodo(task))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should delete a task', () => {
      nock('https://example.com:443')
        .delete('/api/tasks/1')
        .reply(204)

      const expectedActions = [
        {
          type: types.DELETE_TODO,
          id: '1'
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.deleteTodo('1'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should hanle errors when deleting a task', () => {
      nock('https://example.com:443')
        .delete('/api/tasks/1')
        .reply(500)

      const expectedActions = [
        {
          type: types.SET_ERROR,
          error: 'Unable to delete task.'
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.deleteTodo('1'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should reschedule a task', () => {
      const task = {
        _id: '1',
        name: 'test',
        dueDate: '2010-01-02'
      }

      nock('https://example.com:443')
        .put('/api/tasks/1', task)
        .reply(204)

      const expectedActions = [
        {
          type: types.SET_BUSY,
          busy: true
        },
        {
          type: types.EDIT_TODO,
          task
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.rescheduleTodo(task))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should edit a task', () => {
      const task = {
        _id: '1',
        name: 'test',
        dueDate: '2010-01-02'
      }

      nock('https://example.com:443')
        .put('/api/tasks/1', task)
        .reply(204)

      const expectedActions = [
        {
          type: types.SET_BUSY,
          busy: true
        },
        {
          type: types.EDIT_TODO,
          task
        },
        {
          type: 'GO_BACK'
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.editTodo(task))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should handle errors when editing a task', () => {
      const task = {
        _id: '1',
        name: 'test'
      }

      nock('https://example.com:443')
        .put('/api/tasks/1', task)
        .reply(500)

      const expectedActions = [
        {
          type: types.SET_BUSY,
          busy: true
        },
        {
          type: types.SET_ERROR,
          error: 'Unable to update task.'
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.editTodo(task))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should complete a task', () => {
      nock('https://example.com:443')
        .post('/api/tasks/1/complete')
        .reply(204)

      const expectedActions = [
        {
          type: types.COMPLETE_TODO,
          id: '1'
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.completeTodo('1'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should handle errors when completing a task', () => {
      nock('https://example.com:443')
        .post('/api/tasks/1/complete')
        .reply(500)

      const expectedActions = [
        {
          type: types.SET_ERROR,
          error: 'Unable to complete task.'
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.completeTodo('1'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should un-complete a task', () => {
      nock('https://example.com:443')
        .delete('/api/tasks/1/complete')
        .reply(204)

      const expectedActions = [
        {
          type: types.UNCOMPLETE_TODO,
          id: '1'
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.uncompleteTodo('1'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should handle errors when un-completing a task', () => {
      nock('https://example.com:443')
        .delete('/api/tasks/1/complete')
        .reply(500)

      const expectedActions = [
        {
          type: types.SET_ERROR,
          error: 'Unable to un-complete task.'
        }
      ]

      const store = mockStore({ })

      return store.dispatch(actions.uncompleteTodo('1'))
        .then(() => {
          expect(store.getActions()).toEqual(expectedActions)
        })
    })

    it('should cleanup tasks', () => {
      nock('https://example.com:443')
        .post('/api/tasks/cleanup')
        .reply(304)

      const store = mockStore({ })

      return store.dispatch(actions.cleanup())
        .then(() => {
          expect(store.getActions()).toEqual([])
        })
    })

    it('should open the delete confirmation', () => {
      const expected = { type: types.OPEN_DELETE_CONFIRMATION, todo: { name: 'test' } }
      const result = actions.openDeleteConfirmation({ name: 'test' })
      expect(result).toEqual(expected)
    })

    it('should close the delete confirmation', () => {
      const expected = { type: types.CLOSE_DELETE_CONFIRMATION }
      const result = actions.closeDeleteConfirmation()
      expect(result).toEqual(expected)
    })

    it('should set the busy state', () => {
      const expected = { type: types.SET_BUSY, busy: true }
      const result = actions.setBusy(true)
      expect(result).toEqual(expected)
    })

    it('should set the error message', () => {
      const expected = { type: types.SET_ERROR, error: 'error message' }
      const result = actions.setError('error message', { value: 1 })
      expect(result).toEqual(expected)
    })
  })
})
