import React, { Component, PropTypes } from 'react';
import TodoCategory from './TodoCategory';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';
import { List } from 'material-ui';

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
          {todos.map(category =>
            <TodoCategory category={category} 
                          key={category._id}
                          actions={actions}/>
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
