/* eslint-env jest */

import React from 'react'
import PropTypes from 'prop-types'
import { shallow } from 'enzyme'
import expect from 'expect'
import { BottomNavigation, BottomNavigationItem } from 'material-ui'
import Footer from '../components/Footer'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

function setup (pathname = '/', disabled = false) {
  const props = {
    actions: {
      push: jest.fn()
    },
    router: {
      location: {
        pathname
      }
    },
    disabled
  }

  const options = {
    context: {
      muiTheme: getMuiTheme()
    },
    childContextTypes: {
      muiTheme: PropTypes.object.isRequired
    }
  }

  const wrapper = shallow(<Footer {...props} />, options)

  return {
    props,
    wrapper,
    options
  }
}

describe('components', () => {
  describe('Footer', () => {
    it('should render self and subcomponents', () => {
      const { wrapper } = setup()

      expect(wrapper.find('footer').length).toBe(1)

      const bottomNavigation = wrapper.find(BottomNavigation)
      expect(bottomNavigation.length).toBe(1)
      expect(bottomNavigation.prop('selectedIndex')).toBe(0)

      expect(bottomNavigation.find(BottomNavigationItem).length).toBe(3)

      expect(wrapper.find({ label: 'Due Today' }).length).toBe(1)
      expect(wrapper.find({ label: 'This Week' }).length).toBe(1)
      expect(wrapper.find({ label: 'All' }).length).toBe(1)
    })

    it('should show This Week as active when selected', () => {
      const { wrapper } = setup('/week')

      expect(wrapper.find(BottomNavigation).prop('selectedIndex')).toBe(1)
    })

    it('should show All as active when selected', () => {
      const { wrapper } = setup('/all')

      expect(wrapper.find(BottomNavigation).prop('selectedIndex')).toBe(2)
    })

    it('should show no items as active when on the Add page', () => {
      const { wrapper } = setup('/add')

      expect(wrapper.find(BottomNavigation).prop('selectedIndex')).toBe(-1)
    })

    it('should navigate to the Due Today page', () => {
      const { wrapper, props } = setup('/add')

      wrapper.find({ label: 'Due Today' }).simulate('touchTap')

      expect(props.actions.push.mock.calls.length).toBe(1)
      expect(props.actions.push.mock.calls[0][0]).toBe('/')
    })

    it('should navigate to the This page', () => {
      const { wrapper, props } = setup('/add')

      wrapper.find({ label: 'This Week' }).simulate('touchTap')

      expect(props.actions.push.mock.calls.length).toBe(1)
      expect(props.actions.push.mock.calls[0][0]).toBe('/week')
    })

    it('should navigate to the All page', () => {
      const { wrapper, props } = setup('/add')

      wrapper.find({ label: 'All' }).simulate('touchTap')

      expect(props.actions.push.mock.calls.length).toBe(1)
      expect(props.actions.push.mock.calls[0][0]).toBe('/all')
    })

    it('should not display navigation items when disabled', () => {
      const { wrapper } = setup('/', true)

      const bottomNavigation = wrapper.find(BottomNavigation)
      expect(bottomNavigation.length).toBe(1)

      expect(bottomNavigation.find(BottomNavigationItem).length).toBe(0)
    })
  })
})
