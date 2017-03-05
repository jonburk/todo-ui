import React, { Component, PropTypes } from "react";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Snackbar } from 'material-ui';
import Header from '../components/Header';
import Footer from '../components/Footer';
import * as TodoActions from '../actions/todos';

// For Customization Options, edit  or use
// './src/material_ui_raw_theme_file.jsx' as a template.
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../src/material_ui_raw_theme_file'

class App extends Component {
  render() {
    const { todos, actions, router } = this.props;

    return (
      <div>
        <MuiThemeProvider muiTheme={theme}>
          <div>
            <Header actions={actions} busy={todos.busy} router={router}/>
            <section className="body">
              {this.props.children}            
            </section>
            <Footer disabled={todos.busy} router={router} actions={actions}/>
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
