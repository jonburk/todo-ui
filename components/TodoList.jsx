import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TodoCategory from './TodoCategory';
import BusyIndicator from './BusyIndicator';
import { List, Dialog, FlatButton, FloatingActionButton } from 'material-ui';
import * as TodoActions from '../actions/todos';
import muiThemeable from 'material-ui/styles/muiThemeable';

import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle';
import AddIcon from 'material-ui/svg-icons/content/add';

class TodoList extends Component {
  render() {
    const { actions, mode } = this.props;
    const { categories, deleteConfirmation, busy } = this.props.todos;
    const { palette } = this.props.muiTheme;

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

    const filteredListPlaceholder = (
      <div className='empty-list'>
        <CheckCircleIcon style={{width: '60px', height: '60px'}} color={palette.accent2Color}/>
        <div className='empty-list-message'>Nothing left to do!</div>
      </div>
    )

    const allPlaceholder = (
      <div className='empty-list'>
        <div className='empty-list-message'>Begin by adding a task&hellip;</div>
      </div>
    )    

    const placeholder = mode === 'all' ? allPlaceholder : filteredListPlaceholder;

    const busyIndicator = <BusyIndicator/>

    let component;
    if (busy) {
      component = busyIndicator;
    } else if (categories.length === 0) {
      component = placeholder;
    } else {
      component = todoList;
    }

    return (
      <div style={{marginBottom: '66px'}}>
        {component}
        <FloatingActionButton secondary={true} 
                              onTouchTap={() => 
                              actions.push('add')}
                              style={{position: 'fixed', right: '10px', bottom: '66px', zIndex: 100}}>
          <AddIcon/>
        </FloatingActionButton>        
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

  componentDidMount() {
    this.props.actions.getTodos(this.props.mode);
  }
}

function mapStateToProps(state) {
  return {
    todos: state.todos
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(TodoActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(muiThemeable()(TodoList));
