/* eslint-env jest */

import React from 'react'
import PropTypes from 'prop-types'
import { shallow, mount } from 'enzyme'
import expect from 'expect'
import sinon from 'sinon'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import injectTapEventPlugin from 'react-tap-event-plugin'
import { IconButton, Card, CardHeader } from 'material-ui'

jest.mock(
    'Config',
    () => {
      return {
        App: {
          api: {}
        }
      }
    },
    {virtual: true}
  )

const { AddEditTask, validate } = require('../components/AddEditTask')

// The redux-form Field component only works inside of a component wrapped in ReduxForm.
// Create a mock to render the target component instead of the field.
const ReduxForm = require.requireActual('redux-form')

ReduxForm.Field = (props) => {
  const { component: Component, ...others } = props
  const input = {onChange: () => {}}
  const meta = {}
  return <Component input={input} meta={meta} {...others} />
}

injectTapEventPlugin()

function setup (add = true, id, busy = false, submitting = false, addEditTask) {
  const props = {
    muiTheme: getMuiTheme(),
    add,
    actions: {
      getCategoryNames: jest.fn(),
      startAddTodo: jest.fn(),
      getTodo: jest.fn(),
      addTodo: jest.fn(),
      editTodo: jest.fn(),
      goBack: jest.fn(),
      cancelAddEditTodo: jest.fn()
    },
    params: {
      id
    },
    todos: {
      busy,
      addEditTask: addEditTask || {},
      categoryNames: []
    },
    handleSubmit: jest.fn(),
    change: jest.fn(),
    submitting
  }

  const options = {
    context: {
      muiTheme: getMuiTheme()
    },
    childContextTypes: {
      muiTheme: PropTypes.object.isRequired
    }
  }

  const wrapper = shallow(<AddEditTask {...props} />, options)

  return {
    props,
    wrapper,
    options
  }
}

describe('components', () => {
  describe('TodoList', () => {
    it('should get the category names on mount', () => {
      const { options, props } = setup()

      sinon.spy(AddEditTask.prototype, 'componentWillMount')
      mount(<AddEditTask {...props} />, options)

      expect(AddEditTask.prototype.componentWillMount.calledOnce).toBeTruthy()
    })

    it('should initialize for Add Task on mount', () => {
      const { props } = setup()

      expect(props.actions.startAddTodo.mock.calls.length).toBe(1)
    })

    it('should load a task to edit on mount', () => {
      const { props } = setup(false, '1')

      expect(props.actions.getTodo.mock.calls.length).toBe(1)
      expect(props.actions.getTodo.mock.calls[0][0]).toBe('1')
    })

    it('should cancel adding/editing a task', () => {
      const { wrapper, props } = setup()

      const cancelButton = wrapper.find('RaisedButton').filter({label: 'Cancel'})
      expect(cancelButton.length).toBe(1)
      expect(cancelButton.prop('disabled')).toBe(false)
      cancelButton.simulate('touchTap')

      expect(props.actions.cancelAddEditTodo.mock.calls.length).toBe(1)
      expect(props.actions.goBack.mock.calls.length).toBe(1)
    })

    it('should save when adding a task', () => {
      const { wrapper, props } = setup()

      const saveButton = wrapper.find('RaisedButton').filter({label: 'Add'})
      expect(saveButton.length).toBe(1)
      expect(saveButton.prop('disabled')).toBe(false)
      saveButton.simulate('touchTap')

      expect(props.handleSubmit.mock.calls.length).toBe(1)
      expect(props.handleSubmit.mock.calls[0][0]).toBe(props.actions.addTodo)
    })

    it('should save when editing a task', () => {
      const { wrapper, props } = setup(false)

      const saveButton = wrapper.find('RaisedButton').filter({label: 'Save'})
      expect(saveButton.length).toBe(1)
      expect(saveButton.prop('disabled')).toBe(false)
      saveButton.simulate('touchTap')

      expect(props.handleSubmit.mock.calls.length).toBe(1)
      expect(props.handleSubmit.mock.calls[0][0]).toBe(props.actions.editTodo)
    })

    it('should disable buttons when busy', () => {
      const { wrapper } = setup(false, null, true)

      const buttons = wrapper.find('RaisedButton')
      expect(buttons.length).toBe(2)
      expect(buttons.at(0).prop('disabled')).toBe(true)
      expect(buttons.at(1).prop('disabled')).toBe(true)
    })

    it('should disable buttons when submitting', () => {
      const { wrapper } = setup(false, null, false, true)

      const buttons = wrapper.find('RaisedButton')
      expect(buttons.length).toBe(2)
      expect(buttons.at(0).prop('disabled')).toBe(true)
      expect(buttons.at(1).prop('disabled')).toBe(true)
    })

    it('should clear the dueDate', () => {
      const { wrapper, props } = setup(false, null, false, false, { dueDate: '2010-01-01' })

      const clearButton = wrapper.find(IconButton)
      expect(clearButton.length).toBe(1)

      clearButton.simulate('touchTap')
      expect(props.change.mock.calls.length).toBe(1)
      expect(props.change.mock.calls[0][0]).toBe('dueDate')
      expect(props.change.mock.calls[0][1]).toBe(null)
    })

    it('should display the repeat block as collapsed by default when adding', () => {
      const { wrapper } = setup()

      const repeatBlock = wrapper.find(Card)
      expect(repeatBlock.length).toBe(1)
      expect(repeatBlock.prop('initiallyExpanded')).toBe(false)
    })

    it('should display the repeat block as collapsed when editing a non-repeating task', () => {
      const { wrapper } = setup(false)

      const repeatBlock = wrapper.find(Card)
      expect(repeatBlock.length).toBe(1)
      expect(repeatBlock.prop('initiallyExpanded')).toBe(false)
    })

    it('should display the repeat block as expanded when editing a repeating task', () => {
      const { wrapper } = setup(false, null, false, false, { repeat: { rate: 1, unit: 'days' } })

      const repeatBlock = wrapper.find(Card)
      expect(repeatBlock.length).toBe(1)
      expect(repeatBlock.prop('initiallyExpanded')).toBe(true)
    })

    it('should clear the task repeition info when expanding the repeat block', () => {
      const { wrapper, options, props } = setup(false)

      const cardHeader = wrapper.find(CardHeader)
      expect(cardHeader.length).toBe(1)

      const openIcon = shallow(cardHeader.prop('openIcon'), options)
      openIcon.simulate('touchTap')
      expect(props.change.mock.calls.length).toBe(2)
      expect(props.change.mock.calls[0][0]).toBe('repeat.rate')
      expect(props.change.mock.calls[0][1]).toBe(null)
      expect(props.change.mock.calls[1][0]).toBe('repeat.unit')
      expect(props.change.mock.calls[1][1]).toBe(null)
    })

    it('should return no errors for a valid non-repeating task', () => {
      const values = {
        name: 'Task'
      }

      const errors = validate(values)
      expect(errors).toEqual({})
    })

    it('should return no errors for a valid non-repeating task with blank repeition options', () => {
      const values = {
        name: 'Task',
        repeat: {}
      }

      const errors = validate(values)
      expect(errors).toEqual({})
    })

    it('should return no errors for a valid repeating task', () => {
      const values = {
        name: 'Task',
        repeat: {
          unit: 'days',
          rate: 1
        }
      }

      const errors = validate(values)
      expect(errors).toEqual({})
    })

    it('should return an error for a task with no name', () => {
      const values = {}

      const errors = validate(values)
      expect(errors.name).toBe('Required')
    })

    it('should return an error for a repeating task with no units', () => {
      const values = {
        name: 'Task',
        repeat: {
          rate: 1
        }
      }

      const errors = validate(values)
      expect(errors.repeat.unit).toBe('Required')
    })

    it('should return an error for a repeating task with no rate', () => {
      const values = {
        name: 'Task',
        repeat: {
          unit: 'days'
        }
      }

      const errors = validate(values)
      expect(errors.repeat.rate).toBe('Required')
    })
  })
})
