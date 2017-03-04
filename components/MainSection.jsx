import React, { Component, PropTypes } from 'react';
import TodoCategory from './TodoCategory';
import { List, Dialog, FlatButton } from 'material-ui';

class MainSection extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { categories, deleteConfirmation, actions } = this.props;

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
        <Dialog open={deleteConfirmation.open}
                modal={false}
                onRequestClose={() => actions.closeDeleteConfirmation()}
                actions={[
                  <FlatButton label='Cancel' primary={false} onTouchTap={() => actions.closeDeleteConfirmation()}/>,
                  <FlatButton label='Delete' primary={true} onTouchTap={() => actions.deleteTodo(deleteConfirmation.todo._id)}/>
                ]}>
          Delete "{_.get(deleteConfirmation, 'todo.name', '')}"?
        </Dialog>
      </section>
    );
  }
}

MainSection.propTypes = {
  categories: PropTypes.array.isRequired,
  deleteConfirmation: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default MainSection;
