/* eslint-env jest */

import React from 'react'
import PropTypes from 'prop-types'
import { shallow } from 'enzyme'
import expect from 'expect'
import Header from '../components/Header'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton'
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh'

function setup (pathname = '/', busy = false) {
  const props = {
    actions: {
      getTodos: jest.fn()
    },
    router: {
      location: {
        pathname
      }
    },
    busy
  }

  const options = {
    context: {
      muiTheme: getMuiTheme()
    },
    childContextTypes: {
      muiTheme: PropTypes.object.isRequired
    }
  }

  const wrapper = shallow(<Header {...props} />, options)

  return {
    props,
    wrapper,
    options
  }
}

describe('components', () => {
  describe('Header', () => {
    it('should render self and subcomponents', () => {
      const { wrapper, options } = setup()

      const appBar = wrapper.find(AppBar)
      expect(appBar.length).toBe(1)
      expect(appBar.prop('title')).toBe('Todo')

      const iconButton = appBar.dive(options).find(IconButton)
      expect(iconButton.length).toBe(1)
      expect(iconButton.prop('title')).toBe('Refresh')
      expect(iconButton.prop('disabled')).toBe(false)
      expect(iconButton.dive(options).find(RefreshIcon).length).toBe(1)
    })

    it('should display refresh icon for week list', () => {
      const { wrapper, options } = setup('/week')

      expect(wrapper.find(AppBar).dive(options).find(IconButton).length).toBe(1)
    })

    it('should display refresh icon for full list', () => {
      const { wrapper, options } = setup('/all')

      expect(wrapper.find(AppBar).dive(options).find(IconButton).length).toBe(1)
    })

    it('should disable the refresh button while busy', () => {
      const { wrapper, options } = setup('/', true)

      const iconButton = wrapper.find(AppBar).dive(options).find(IconButton)
      expect(iconButton.length).toBe(1)
      expect(iconButton.prop('title')).toBe('Refresh')
      expect(iconButton.prop('disabled')).toBe(true)
      expect(iconButton.dive(options).find(RefreshIcon).length).toBe(1)
    })

    it('should hide the refresh button for the add page', () => {
      const { wrapper, options } = setup('/add', true)

      const iconButton = wrapper.find(AppBar).dive(options).find(IconButton)
      expect(iconButton.length).toBe(0)
    })

    it('should refresh the today list', () => {
      const { wrapper, options, props } = setup()

      wrapper.find(AppBar).dive(options).find(IconButton).simulate('touchTap')

      expect(props.actions.getTodos.mock.calls.length).toBe(1)
      expect(props.actions.getTodos.mock.calls[0][0]).toBe('today')
    })

    it('should refresh the week list', () => {
      const { wrapper, options, props } = setup('/week')

      wrapper.find(AppBar).dive(options).find(IconButton).simulate('touchTap')

      expect(props.actions.getTodos.mock.calls.length).toBe(1)
      expect(props.actions.getTodos.mock.calls[0][0]).toBe('week')
    })

    it('should refresh the full list', () => {
      const { wrapper, options, props } = setup('/all')

      wrapper.find(AppBar).dive(options).find(IconButton).simulate('touchTap')

      expect(props.actions.getTodos.mock.calls.length).toBe(1)
      expect(props.actions.getTodos.mock.calls[0][0]).toBe('all')
    })
  })
})
