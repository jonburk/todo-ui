import React, { Component, PropTypes } from 'react';
import { ListItem, IconButton, IconMenu, MenuItem, FlatButton, DatePicker } from 'material-ui';
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
    const { todo, openDeleteConfirmation, push, completeTodo, uncompleteTodo } = this.props;
    const { palette } = this.props.muiTheme;

    const rightIconMenu = (
      <IconMenu iconButtonElement={
          <IconButton>
            <MoreVertIcon color={palette.primary3Color} />
          </IconButton>
        }
      >
        <MenuItem primaryText="Reschedule"
                  leftIcon={<ScheduleIcon/>}
                  onTouchTap={() => this.refs.reschedule.openDialog()}/>
        <MenuItem primaryText="Edit" 
                  leftIcon={<EditIcon/>}
                  onTouchTap={() => push(`/edit/${todo._id}`)}/>
        <MenuItem primaryText="Delete" 
                  leftIcon={<DeleteIcon/>}
                  onTouchTap={() => openDeleteConfirmation(todo)}/>
      </IconMenu>
    );

    const overdueColor = '#cb0044';
    const overdue = (todo.dueDate && moment().startOf('day').isAfter(todo.dueDate));
    const checkBoxColor = overdue ? overdueColor : palette.accent1Color;

    const repeatText = todo.repeat ? (
      <div>{`Repeats every ${this.getRepetitionDescription(todo.repeat)}.`}</div>
    ) : null;

    const dueText = todo.dueDate ? (
      <div style={overdue && !todo.completed ? {color: overdueColor} : null}>
        {`Due ${moment(todo.dueDate).format('ddd MMMM Do')}`}
      </div>
    ) : null;

    return (
      <ListItem primaryText={todo.name}
                style={overdue && !todo.completed ? {color: overdueColor} : null}                
                leftIcon={todo.completed ? 
                  <CheckBoxIcon color={palette.disabledColor} onTouchTap={() => uncompleteTodo(todo._id)} /> : 
                  <CheckBoxBlankIcon color={checkBoxColor} onTouchTap={() => completeTodo(todo._id)} />}
                secondaryText={<div>{dueText}{repeatText}</div>}
                secondaryTextLines={2}
                rightIconButton={rightIconMenu}>
        <DatePicker name='reschedule' 
                    ref='reschedule' 
                    style={{display: 'none'}}
                    autoOk={true}
                    defaultDate={todo.dueDate ? moment(todo.dueDate).toDate() : moment().toDate()}
                    onChange={(event, date) => this.reschedule(todo, date)}/>
      </ListItem>
    );
  }

  reschedule(todo, date) {
    todo.dueDate = moment(date).format('YYYY-MM-DD');
    this.props.rescheduleTodo(todo);
  }

  getRepetitionDescription(repeat) {
    if (repeat.rate === 1) {
      return repeat.unit.substring(0, repeat.unit.length - 1);
    } else {
      return `${repeat.rate} ${repeat.unit}`;
    }
  }
}

TodoItem.propTypes = {
  todo: PropTypes.object.isRequired,
  openDeleteConfirmation: PropTypes.func.isRequired
};

export default muiThemeable()(TodoItem);
