import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form'
import muiThemeable from 'material-ui/styles/muiThemeable'
import * as TodoActions from '../actions/todos'
import _ from 'lodash'
import { IconButton, Card, CardText, CardHeader, MenuItem, RaisedButton } from 'material-ui'
import { TextField, AutoComplete, DatePicker, SelectField } from 'redux-form-material-ui'
import ClearIcon from 'material-ui/svg-icons/content/clear'
import CheckboxIcon from 'material-ui/svg-icons/toggle/check-box'
import CheckboxOutlineIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank'
import BusyIndicator from './BusyIndicator'

export const validate = values => {
  const errors = {}

  if (!values.name) {
    errors.name = 'Required'
  }

  if (values.repeat) {
    if (values.repeat.unit && !values.repeat.rate) {
      errors.repeat = {}
      errors.repeat.rate = 'Required'
    } else if (values.repeat.rate && !values.repeat.unit) {
      errors.repeat = {}
      errors.repeat.unit = 'Required'
    }
  }

  return errors
}

export class AddEditTask extends Component {
  render () {
    const { handleSubmit, change, submitting, add } = this.props
    const { addTodo, editTodo, goBack, cancelAddEditTodo } = this.props.actions
    const { categoryNames, busy, addEditTask } = this.props.todos
    const { palette } = this.props.muiTheme

    const save = add ? addTodo : editTodo

    const style = {
      padding: '0 16px'
    }

    if (addEditTask == null) {
      return <BusyIndicator />
    }

    return (
      <form style={style}>
        <h2>{add ? 'New Task' : 'Edit Task'}</h2>
        <Field component={TextField}
          hintText='Name'
          floatingLabelText='Name'
          fullWidth
          style={{marginTop: '-16px'}}
          name='name' />
        <Field component={AutoComplete}
          hintText='Category'
          floatingLabelText='Category'
          fullWidth
          filter={(searchText, key) => searchText !== '' && key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1}
          dataSource={categoryNames}
          name='category' />
        <div style={{position: 'relative'}}>
          <Field component={DatePicker}
            hintText='Due date'
            floatingLabelText='Due date'
            fullWidth
            autoOk
            format={value => value ? new Date(value) : null}
            name='dueDate' />
          <IconButton style={{position: 'absolute', top: '24px', right: '0px'}}
            iconStyle={{color: palette.secondaryTextColor}}
            type='button'
            onTouchTap={() => change('dueDate', null)}>
            <ClearIcon />
          </IconButton>
        </div>
        <Card zDepth={1}
          style={{marginTop: '16px'}}
          expandable
          initiallyExpanded={!_.isEmpty(addEditTask.repeat)}>
          <CardHeader title='Repeat this task'
            actAsExpander
            showExpandableButton
            closeIcon={<CheckboxOutlineIcon color={palette.secondaryTextColor} />}
            openIcon={<CheckboxIcon color={palette.secondaryTextColor}
              onTouchTap={() => {
                change('repeat.rate', null)
                change('repeat.unit', null)
              }
                                              } />} />
          <CardText expandable>
            <Field component={TextField}
              type='number'
              hintText='Every'
              floatingLabelText='Every'
              fullWidth
              style={{marginTop: '-48px'}}
              name='repeat.rate' />
            <Field component={SelectField}
              hintText='Frequency'
              floatingLabelText='Frequency'
              fullWidth
              name='repeat.unit'>
              <MenuItem value='days' primaryText='Days' />
              <MenuItem value='weeks' primaryText='Weeks' />
              <MenuItem value='months' primaryText='Months' />
            </Field>
          </CardText>
        </Card>
        <RaisedButton label={add ? 'Add' : 'Save'}
          secondary
          style={{margin: '16px 0', float: 'right'}}
          type='button'
          disabled={submitting || busy}
          onTouchTap={handleSubmit(save)} />
        <RaisedButton label='Cancel'
          style={{margin: '16px', float: 'right'}}
          type='button'
          disabled={submitting || busy}
          onTouchTap={() => {
            cancelAddEditTodo()
            goBack()
          }
                      } />
      </form>
    )
  }

  componentWillMount () {
    const { actions, add, params } = this.props
    actions.getCategoryNames()

    if (add) {
      actions.startAddTodo()
    } else {
      actions.getTodo(params.id)
    }
  }
}

function mapStateToProps (state) {
  return {
    todos: state.todos,
    initialValues: state.todos.addEditTask
  }
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(TodoActions, dispatch)
  }
}

AddEditTask.propTypes = {
  add: PropTypes.bool
}

let AddEditTaskContainer = reduxForm({
  form: 'addEditTask',
  validate,
  enableReinitialize: true
})(AddEditTask)

AddEditTaskContainer = connect(mapStateToProps, mapDispatchToProps)(AddEditTaskContainer)

AddEditTaskContainer = muiThemeable()(AddEditTaskContainer)

export default AddEditTaskContainer
