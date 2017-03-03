import React, { Component, PropTypes } from 'react';
import TodoItem from './TodoItem';
import { Subheader, Divider } from 'material-ui';

class TodoCategory extends Component {
  render() {
    const { category, actions, last } = this.props;

    return (
      <div>
        <Subheader>{ category._id }</Subheader>
        {category.tasks.map(todo =>
          <TodoItem key={todo._id} todo={todo} {...actions} />
        )}
        {!last ? <Divider/> : null}
      </div>
    )
  }
}

TodoCategory.propTypes = {
  category: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
  last: PropTypes.bool
};

export default TodoCategory;