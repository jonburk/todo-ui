/* eslint-env jest */

import React from 'react'
import PropTypes from 'prop-types'
import { shallow } from 'enzyme'
import expect from 'expect'
import { Subheader, Divider } from 'material-ui'
import TodoCategory from '../components/TodoCategory'
import TodoItem from '../components/TodoItem'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

function setup (category, last = false) {
  const props = {
    actions: {
      openDeleteConfirmation: jest.fn()
    },
    category,
    last
  }

  const options = {
    context: {
      muiTheme: getMuiTheme()
    },
    childContextTypes: {
      muiTheme: PropTypes.object.isRequired
    }
  }

  const wrapper = shallow(<TodoCategory {...props} />, options)

  return {
    props,
    wrapper,
    options
  }
}

describe('components', () => {
  describe('TodoCategory', () => {
    it('should render self and subcomponents', () => {
      const category = {
        _id: 'Test Category',
        tasks: [
          {_id: '1'},
          {_id: '2'}
        ]
      }

      const { wrapper, options } = setup(category)

      const subheader = wrapper.find(Subheader)
      expect(subheader.length).toBe(1)
      expect(subheader.dive(options).text()).toBe(category._id)

      expect(wrapper.find(TodoItem).length).toBe(2)
      expect(wrapper.find(Divider).length).toBe(1)
    })

    it('should not render a divider when it is the last category', () => {
      const category = {
        _id: 'Test Category',
        tasks: []
      }

      const { wrapper } = setup(category, true)
      expect(wrapper.find(Divider).length).toBe(0)
    })
  })
})
