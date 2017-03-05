import React, { Component, PropTypes } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { RefreshIndicator, Snackbar } from 'material-ui';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MainSection from '../components/MainSection';
import * as TodoActions from '../actions/todos';

// For Customization Options, edit  or use
// './src/material_ui_raw_theme_file.jsx' as a template.
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../src/material_ui_raw_theme_file'

class App extends Component {
  render() {
    const { todos, actions } = this.props;
    
    const mainSection = <MainSection categories={todos.categories} 
                                     deleteConfirmation={todos.deleteConfirmation} 
                                     actions={actions}/>

    const refreshIndicator = <RefreshIndicator top={0} 
                                              left={-60} 
                                              size={120}
                                              style={{marginLeft: '50%', marginTop: 'calc(50vh - 60px)'}}
                                              status='loading'/>

    return (
      <div>
        <MuiThemeProvider muiTheme={theme}>
          <div>
            <Header actions={actions} busy={todos.busy}/>
            <section className="body">
            {todos.busy ? refreshIndicator : mainSection}
            </section>
            <Footer disabled={todos.busy || todos.categories.length === 0}/>
            <Snackbar open={!!todos.error} 
                      message={todos.error || ''} 
                      autoHideDuration={3000}
                      onRequestClose={() => actions.setError(null)}/>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }

  componentDidMount() {
    this.props.actions.cleanup();
    this.props.actions.getTodos();
  }
}

App.propTypes = {
  todos: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

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
)(App);
