import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import muiThemeable from 'material-ui/styles/muiThemeable';
import * as TodoActions from '../actions/todos';
import { IconButton, Card, CardText, CardHeader, MenuItem, RaisedButton } from 'material-ui';
import { TextField, AutoComplete, DatePicker, SelectField } from 'redux-form-material-ui';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import CheckboxIcon from 'material-ui/svg-icons/toggle/check-box';
import CheckboxOutlineIcon from 'material-ui/svg-icons/toggle/check-box-outline-blank';

const validate = values => {
  const errors = {};

  if (!values.name) {
    errors.name = 'Required';
  }

  return errors;
};

class AddEditTask extends Component {
  render() {
    const { handleSubmit, change, dispatch, submitting } = this.props;
    const { addTodo } = this.props.actions;
    const { categoryNames, busy } = this.props.todos;
    const { palette } = this.props.muiTheme;

    const style = {
      padding: '0 16px'
    }

    return (
      <form>
        <div style={style}>
          <h2>New Task</h2>
          <Field component={TextField} 
                 hintText='Name' 
                 floatingLabelText='Name' 
                 fullWidth={true}
                 style={{marginTop: '-16px'}}
                 name='name'/>
          <Field component={AutoComplete} 
                 hintText='Category' 
                 floatingLabelText='Category' 
                 fullWidth={true}    
                 filter={(searchText, key) => searchText !== '' && key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1}                   
                 dataSource={categoryNames}
                 name='category'/>
          <div style={{position: 'relative'}}>
            <Field component={DatePicker} 
                   hintText='Due date'
                   floatingLabelText='Due date'
                   fullWidth={true}
                   autoOk={true}
                   format={null}
                   defaultValue={null}
                   name='dueDate'/>
            <IconButton style={{position: 'absolute', top: '24px', right: '0px'}}
                        iconStyle={{color: palette.secondaryTextColor}}
                        type='button'
                        onTouchTap={() => change('dueDate', null)}>
              <ClearIcon />
            </IconButton>
          </div>        
          <Card zDepth={1} 
                style={{marginTop: '16px'}} 
                expandable={true} 
                initiallyExpanded={true}>
            <CardHeader title='Repeat this task'
                        actAsExpander={true}
                        showExpandableButton={true}
                        closeIcon={<CheckboxOutlineIcon color={palette.secondaryTextColor} 
                                                        onTouchTap={() => {
                                                            change('repeat.rate', null);
                                                            change('repeat.unit', null);
                                                          }
                                                        }/>}
                        openIcon={<CheckboxIcon color={palette.secondaryTextColor}/>}/>
            <CardText expandable={true}>
              <Field component={TextField} 
                     type='number'
                     hintText='Every'
                     floatingLabelText='Every'
                     fullWidth={true}
                     style={{marginTop: '-48px'}}
                     name='repeat.rate'/>
              <Field component={SelectField} 
                     hintText='Frequency'
                     floatingLabelText='Frequency'
                     fullWidth={true}
                     name='repeat.unit'>
                <MenuItem value='days' primaryText='Days'/>
                <MenuItem value='weeks' primaryText='Weeks'/>
                <MenuItem value='months' primaryText='Months'/>
              </Field>                        
            </CardText>
          </Card>
          <RaisedButton label='Add' 
                        secondary={true} 
                        style={{margin: '16px 0', float: 'right'}}
                        type='button'
                        disabled={submitting || busy}
                        onTouchTap={handleSubmit(addTodo)}/>
        </div>
      </form>
    )
  }

  componentDidMount() {
    const { actions } = this.props;
    actions.getCategoryNames();
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

export default reduxForm({form: 'addEditTask', validate})(connect(
  mapStateToProps,
  mapDispatchToProps
)(muiThemeable()(AddEditTask)));