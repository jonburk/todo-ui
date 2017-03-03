import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { ListItem, IconButton, IconMenu, MenuItem } from 'material-ui';
import muiThemeable from 'material-ui/styles/muiThemeable';
import moment from 'moment';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import CheckBoxIcon from 'material-ui/svg-icons/toggle/check-box';
import CheckBoxBlankIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import ScheduleIcon from 'material-ui/svg-icons/action/schedule';
import EditIcon from 'material-ui/svg-icons/image/edit';
import DeleteIcon from 'material-ui/svg-icons/action/delete';


class TodoItem extends Component {
  render() {
    const { todo } = this.props;
    const { palette } = this.props.muiTheme;

    const rightIconMenu = (
      <IconMenu iconButtonElement={
          <IconButton>
            <MoreVertIcon color={palette.primary3Color} />
          </IconButton>
        }
      >
        <MenuItem primaryText="Reschedule"
                  leftIcon={<ScheduleIcon/>}/>
        <MenuItem primaryText="Edit" 
                  leftIcon={<EditIcon/>}/>
        <MenuItem primaryText="Delete" 
                  leftIcon={<DeleteIcon/>}/>
      </IconMenu>
    );

    const checkBoxColor = (todo.dueDate && moment().isAfter(todo.dueDate)) ? '#cb0044' : palette.accent1Color;

    return (
      <ListItem primaryText={todo.name}
                onTouchTap={() => this.toggleTodo(todo)}
                leftIcon={todo.completed ? <CheckBoxIcon color={palette.disabledColor} /> : <CheckBoxBlankIcon color={checkBoxColor} />}
                secondaryText={todo.repeat ? `Every ${this.getRepetitionDescription(todo.repeat)}` : null}
                rightIconButton={rightIconMenu}/>
    );
  }

  getRepetitionDescription(repeat) {
    if (repeat.rate === 1) {
      return repeat.unit.substring(0, repeat.unit.length - 1);
    } else {
      return `${repeat.rate} ${repeat.unit}`;
    }
  }

  toggleTodo(todo) {
    const { completeTodo, uncompleteTodo } = this.props;

    if (!todo.completed) {
      completeTodo(todo._id);
    } else {
      uncompleteTodo(todo._id);
    }
  }
}

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  completeTodo: PropTypes.func.isRequired
};

export default muiThemeable()(TodoItem);
