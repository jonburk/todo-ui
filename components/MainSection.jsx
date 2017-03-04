import React, { Component, PropTypes } from 'react';
import TodoCategory from './TodoCategory';
import { List } from 'material-ui';

class MainSection extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { categories, actions } = this.props;

    return (
      <section className="body">
        <List className="todo-list">
          {categories.map((category, index) =>
            <TodoCategory category={category} 
                          key={category._id}
                          actions={actions}
                          last={index === categories.length - 1}/>
          )}
        </List>
      </section>
    );
  }
}

MainSection.propTypes = {
  categories: PropTypes.array.isRequired,
  actions: PropTypes.object.isRequired
};

export default MainSection;
