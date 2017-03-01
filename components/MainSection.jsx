import React, { Component, PropTypes } from 'react';
import TodoItem from './TodoItem';
import Footer from './Footer';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';
import { Checkbox, List } from 'material-ui';

class MainSection extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = { filter: SHOW_ALL };
  }

  handleShow(filter) {
    this.setState({ filter });
  }

  renderFooter() {
    const { filter } = this.state;
    const { todos } = this.props;

    if (todos.length) {
      return (
        <Footer filter={filter}
                onShow={this.handleShow.bind(this)} />
      );
    }
  }

  render() {
    const { todos, actions } = this.props;
    const { filter } = this.state;

    return (
      <section className="main">
        <List className="todo-list">
          {todos.map(todo =>
            <TodoItem key={todo.id} todo={todo} {...actions} />
          )}
        </List>
        {this.renderFooter()}
      </section>
    );
  }
}

MainSection.propTypes = {
  todos: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

export default MainSection;
