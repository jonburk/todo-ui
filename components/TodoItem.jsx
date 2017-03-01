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
    const { todo, completeTodo } = this.props;
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
                onTouchTap={() => completeTodo(todo._id)}
                leftIcon={todo.completed ? <CheckBoxIcon color={palette.disabledColor} /> : <CheckBoxBlankIcon color={checkBoxColor} />}
                rightIconButton={rightIconMenu}/>
    );
  }
}

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  completeTodo: PropTypes.func.isRequired
};

export default muiThemeable()(TodoItem);
