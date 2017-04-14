import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';
import expect from 'expect';
import { ListItem, IconMenu, IconButton, MenuItem, DatePicker } from 'material-ui';
import { TodoItem } from '../components/TodoItem';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import CheckBoxIcon from 'material-ui/svg-icons/toggle/check-box';
import CheckBoxBlankIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

function setup(todo) {

  if (!todo) {
    todo = {
      _id: '1',
      dueDate: '2100-01-02',
      completed: false,
      name: 'Test Item',
      repeat: {
        rate: 1,
        unit: 'Days'
      }
    }
  }

  const props = {
    todo,
    push: jest.fn(),
    openDeleteConfirmation: jest.fn(),
    muiTheme: getMuiTheme()
  };

  const options = {
    context: {
      muiTheme: getMuiTheme(),
    },
    childContextTypes: {
      muiTheme: PropTypes.object.isRequired,
    }
  }

  const wrapper = shallow(<TodoItem {...props}/>, options);

  return {
    props,
    wrapper,
    options
  };
}

describe('components', () => {
  describe('TodoItem', () => {
    it('should render self and subcomponents', () => {
      const { wrapper, options } = setup();
      
      const listItem = wrapper.find(ListItem);
      expect(listItem.length).toBe(1);
      expect(listItem.prop('primaryText')).toBe('Test Item');
      expect(listItem.prop('style')).toBe(null);
      expect(shallow(listItem.prop('secondaryText')).text()).toBe('Due Sat January 2ndRepeats every Day.');

      const listItemWrapper = listItem.dive(options);
      expect(listItemWrapper.find(CheckBoxBlankIcon).length).toBe(1);
      
      const datePicker = listItemWrapper.find(DatePicker);
      expect(datePicker.length).toBe(1);
      expect(datePicker.prop('style').display).toBe('none');

      const menu = listItemWrapper.find(IconMenu);
      expect(menu.length).toBe(1);

      const menuWrapper = menu.dive(options);
      expect(menuWrapper.find(IconButton).length).toBe(1);
      expect(menuWrapper.find(MoreVertIcon).length).toBe(1);
      expect(menuWrapper.find(MenuItem).length).toBe(3);
      expect(menuWrapper.find({ primaryText: 'Reschedule' }).length).toBe(1);
      expect(menuWrapper.find({ primaryText: 'Edit' }).length).toBe(1);
      expect(menuWrapper.find({ primaryText: 'Delete' }).length).toBe(1);      
    });

    it('should display only the repetition info when due date is empty', () => {
      const todo = {
        _id: '1',
        dueDate: null,
        completed: false,
        name: 'Test Item',
        repeat: {
          rate: 1,
          unit: 'Days'
        }
      }

      const { wrapper } = setup(todo);

      const listItem = wrapper.find(ListItem);
      expect(shallow(listItem.prop('secondaryText')).text()).toBe('Repeats every Day.');
    });

    it('should display only the due date when the repetition info is empty', () => {
      const todo = {
        _id: '1',
        dueDate: '2100-01-02',
        completed: false,
        name: 'Test Item',
        repeat: null
      }

      const { wrapper } = setup(todo);

      const listItem = wrapper.find(ListItem);
      expect(shallow(listItem.prop('secondaryText')).text()).toBe('Due Sat January 2nd');
    });

    it('should not display secondary text when the due date and repeition info are empty', () => {
      const todo = {
        _id: '1',
        dueDate: null,
        completed: false,
        name: 'Test Item',
        repeat: null
      }

      const { wrapper } = setup(todo);

      const listItem = wrapper.find(ListItem);
      expect(shallow(listItem.prop('secondaryText')).text()).toBe('');
    });

    it('should display plural repetition info', () => {
      const todo = {
        _id: '1',
        dueDate: null,
        completed: false,
        name: 'Test Item',
        repeat: {
          rate: 2,
          unit: 'Weeks'
        }
      }

      const { wrapper } = setup(todo);

      const listItem = wrapper.find(ListItem);
      expect(shallow(listItem.prop('secondaryText')).text()).toBe('Repeats every 2 Weeks.');
    });   

    it('should display checked box for a completed task', () => {
      const todo = {
        _id: '1',
        dueDate: null,
        completed: true,
        name: 'Test Item',
        repeat: null
      }

      const { wrapper, options } = setup(todo);

      expect(wrapper.find(ListItem).dive(options).find(CheckBoxIcon).length).toBe(1);
    });   

    it('should display primary and due date in red when overdue', () => {
      const todo = {
        _id: '1',
        dueDate: '2000-01-02',
        completed: false,
        name: 'Test Item',
        repeat: null
      }

      const { wrapper } = setup(todo);

      const overdueColor = '#cb0044';
      const listItem = wrapper.find(ListItem);
      expect(listItem.prop('style').color).toBe(overdueColor);
      expect(shallow(listItem.prop('secondaryText')).find('div').at(1).prop('style').color).toBe(overdueColor);
    });

    it('should delete tasks', () => {
      const { wrapper, options, props } = setup();

      wrapper.find(ListItem)
             .dive(options)
             .find({ primaryText: 'Delete' })
             .simulate('touchTap');

      expect(props.openDeleteConfirmation.mock.calls.length).toBe(1);
      expect(props.openDeleteConfirmation.mock.calls[0][0]).toBe(props.todo);
    });

    it('should navigate to the Edit page', () => {
      const { wrapper, options, props } = setup();

      wrapper.find(ListItem)
             .dive(options)
             .find({ primaryText: 'Edit' })
             .simulate('touchTap');

      expect(props.push.mock.calls.length).toBe(1);
      expect(props.push.mock.calls[0][0]).toBe(`/edit/${props.todo._id}`);
    });

    // TODO add tests for rescheduling
  })
})