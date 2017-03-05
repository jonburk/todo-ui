import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import TodoCategory from './TodoCategory';
import BusyIndicator from './BusyIndicator';
import { List, Dialog, FlatButton, FloatingActionButton } from 'material-ui';
import * as TodoActions from '../actions/todos';
import muiThemeable from 'material-ui/styles/muiThemeable';
import { browserHistory } from 'react-router';

import CheckCircleIcon from 'material-ui/svg-icons/action/check-circle';
import AddIcon from 'material-ui/svg-icons/content/add';

class TodoList extends Component {
  constructor(props, context) {
    super(props, context);
  }

  render() {
    const { actions, all } = this.props;
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

    const todayPlaceholder = (
      <div className='empty-list'>
        <CheckCircleIcon style={{width: '60px', height: '60px'}} color={palette.accent2Color}/>
        <div className='empty-list-message'>Nothing left to do today!</div>
      </div>
    )

    const allPlaceholder = (
      <div className='empty-list'>
        <FloatingActionButton secondary={true} onTouchTap={() => browserHistory.push('add')}>
          <AddIcon/>
        </FloatingActionButton>
        <div className='empty-list-message'>Begin by adding a task&hellip;</div>
      </div>
    )    

    const placeholder = all ? allPlaceholder : todayPlaceholder;

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
      <div>
        {component}
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
    this.props.actions.getTodos(this.props.all);
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