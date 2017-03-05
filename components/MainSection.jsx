import React, { Component, PropTypes } from 'react';
import TodoCategory from './TodoCategory';
import { List, Dialog, FlatButton, FloatingActionButton } from 'material-ui';

import AddIcon from 'material-ui/svg-icons/content/add';

class MainSection extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { categories, deleteConfirmation, actions } = this.props;

    const todoList = (
      <List>
        {categories.map((category, index) =>
          <TodoCategory category={category} 
                        key={category._id}
                        actions={actions}
                        last={index === categories.length - 1}/>
        )}
      </List>
    )

    const placeholder = (
      <div className='empty-list'>
        <FloatingActionButton secondary={true}>
          <AddIcon/>
        </FloatingActionButton>
        <div className='empty-list-message'>Begin by adding a task</div>
      </div>
    )

    return (
      <div>
        {categories.length > 0 ? todoList : placeholder}
        <Dialog open={deleteConfirmation.open}
                modal={false}
                onRequestClose={() => actions.closeDeleteConfirmation()}
                actions={[
                  <FlatButton label='Cancel' primary={false} onTouchTap={() => actions.closeDeleteConfirmation()}/>,
                  <FlatButton label='Delete' primary={true} onTouchTap={() => actions.deleteTodo(deleteConfirmation.todo._id)}/>
                ]}>
          Delete "{_.get(deleteConfirmation, 'todo.name', '')}"?
        </Dialog>
      </div>
    );
  }
}

MainSection.propTypes = {
  categories: PropTypes.array.isRequired,
  deleteConfirmation: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

export default MainSection;
