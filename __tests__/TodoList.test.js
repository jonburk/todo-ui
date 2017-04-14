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
  );

import React from 'react';
import PropTypes from 'prop-types';
import { shallow } from 'enzyme';
import expect from 'expect';
import { TodoList } from '../components/TodoList';
import TodoCategory from '../components/TodoCategory';
import BusyIndicator from '../components/BusyIndicator';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import { List, Dialog, FlatButton, FloatingActionButton } from 'material-ui';
import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle';
import AddIcon from 'material-ui/svg-icons/content/add';

function setup(categories = [], mode = 'all', busy = false, deleteConfirmation) {

  if (!deleteConfirmation) {
    deleteConfirmation = {
      open: false
    }
  }

  const props = {
    muiTheme: getMuiTheme(),
    actions: {
      push: jest.fn(),
      closeDeleteConfirmation: jest.fn(),
      deleteTodo: jest.fn()
    },
    mode,
    todos: {
      categories,
      deleteConfirmation,
      busy
    }
  };

  const options = {
    context: {
      muiTheme: getMuiTheme(),
    },
    childContextTypes: {
      muiTheme: PropTypes.object.isRequired,
    }
  }

  const wrapper = shallow(<TodoList {...props}/>, options);

  return {
    props,
    wrapper,
    options
  };
}

function createCategories(categoryCount = 1, tasksPerCategory = 1) {
  const result = [];

  for (let i = 0; i < categoryCount; i++) {
    const category = {
      _id: `Category ${i + 1}`,
      tasks: []
    }

    for (let j = 0; j < tasksPerCategory; j++) {
      const task = {
        name: `Task ${i + 1}.${j + 1}`
      }

      category.tasks.push(task);
    }

    result.push(category);
  }

  return result;
}

describe('components', () => {
  describe('TodoList', () => {
    it('should render list with one item', () => {
      const { wrapper } = setup(createCategories());

      expect(wrapper.find(List).length).toBe(1);

      const categories = wrapper.find(TodoCategory);
      expect(categories.length).toBe(1);
      expect(categories.prop('last')).toBe(true);
    });

    it('should render list with multiple items', () => {
      const { wrapper, props } = setup(createCategories(2, 2));

      expect(wrapper.find(List).length).toBe(1);

      const categories = wrapper.find(TodoCategory);
      expect(categories.length).toBe(2);
      expect(categories.at(0).prop('category')).toBe(props.todos.categories[0])
      expect(categories.at(0).prop('last')).toBe(false);
      expect(categories.at(1).prop('category')).toBe(props.todos.categories[1])
      expect(categories.at(1).prop('last')).toBe(true);

    });  

    it('should render the busy indicator', () => {
      const { wrapper } = setup([], 'all', true);

      expect(wrapper.find(BusyIndicator).length).toBe(1);
      expect(wrapper.find(List).length).toBe(0);
    }); 

    it('should render the empty list message for the Today view', () => {
      const { wrapper } = setup([], 'today');  

      expect(wrapper.find('.empty-list').length).toBe(1);
      expect(wrapper.find(CheckCircleIcon).length).toBe(1);  
      const message = wrapper.find('.empty-list-message');
      expect(message.length).toBe(1);
      expect(message.text()).toBe('Nothing left to do!');
    });  

    it('should render the empty list message for the Week view', () => {
      const { wrapper } = setup([], 'week');  

      expect(wrapper.find('.empty-list').length).toBe(1);
      expect(wrapper.find(CheckCircleIcon).length).toBe(1);  
      const message = wrapper.find('.empty-list-message');
      expect(message.length).toBe(1);
      expect(message.text()).toBe('Nothing left to do!');
    });  

    it('should render the empty list message for the All view', () => {
      const { wrapper } = setup([]);

      expect(wrapper.find('.empty-list').length).toBe(1);
      const message = wrapper.find('.empty-list-message');
      expect(message.length).toBe(1);
      expect(message.text()).toBe('Begin by adding a task…');      
    }); 

    it('should navigate to the Add page', () => {
      const { wrapper, props } = setup();    

      const addButton = wrapper.find(FloatingActionButton);
      expect(addButton.length).toBe(1);
      expect(addButton.find(AddIcon).length).toBe(1);

      addButton.simulate('touchTap');
      expect(props.actions.push.mock.calls.length).toBe(1);
      expect(props.actions.push.mock.calls[0][0]).toBe('add');       
    }); 

    it('should hide the Delete confirmation by default', () => {
      const { wrapper } = setup();

      const dialog = wrapper.find(Dialog);
      expect(dialog.length).toBe(1);
      expect(dialog.prop('open')).toBe(false);
    });

    it('should show the Delete confirmation and allow cancellation', () => {
      const deleteConfirmation = {
        open: true,
        todo: {
          name: 'Test Item'
        }
      };

      const { wrapper, options, props } = setup([], 'all', false, deleteConfirmation);

      const dialog = wrapper.find(Dialog);
      expect(dialog.length).toBe(1);
      expect(dialog.prop('open')).toBe(true);
      expect(dialog.childAt(0).text()).toBe('Delete Test Item?');

      const actions = dialog.prop('actions');
      expect(actions.length).toBe(2);

      const button = shallow(actions[0], options);
      expect(button.find({ label: 'Cancel' }).length).toBe(1);

      button.simulate('touchTap');
      expect(props.actions.closeDeleteConfirmation.mock.calls.length).toBe(1);
    }); 

    it('should show the Delete confirmation and allow confirmation', () => {
      const deleteConfirmation = {
        open: true,
        todo: {
          _id: '1',
          name: 'Test Item'
        }
      };

      const { wrapper, options, props } = setup([], 'all', false, deleteConfirmation);

      const dialog = wrapper.find(Dialog);
      expect(dialog.length).toBe(1);
      expect(dialog.prop('open')).toBe(true);
      expect(dialog.childAt(0).text()).toBe('Delete Test Item?');

      const actions = dialog.prop('actions');
      expect(actions.length).toBe(2);

      const button = shallow(actions[1], options);
      expect(button.find({ label: 'Delete' }).length).toBe(1);

      button.simulate('touchTap');
      expect(props.actions.deleteTodo.mock.calls.length).toBe(1);  
      expect(props.actions.deleteTodo.mock.calls[0][0]).toBe('1'); 
    });
  })
})