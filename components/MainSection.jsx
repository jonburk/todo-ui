import React, { Component, PropTypes } from 'react';
import TodoItem from './TodoItem';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';
import { Checkbox, List } from 'material-ui';

class MainSection extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { filter: SHOW_ALL };
  }

  render() {
    const { todos, actions } = this.props;
    const { filter } = this.state;

    return (
      <section className="body">
        <List className="todo-list">
          {todos.map(todo =>
            <TodoItem key={todo.id} todo={todo} {...actions} />
          )}
        </List>
      </section>
    );
  }
}

MainSection.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

export default MainSection;
