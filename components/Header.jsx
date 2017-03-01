import React, { PropTypes, Component } from 'react';
import TodoTextInput from './TodoTextInput';
import IconButton from 'material-ui/IconButton';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import AppBar from 'material-ui/AppBar';

const defaultStyle = {
  marginLeft: 20
};

class Header extends Component {
  handleSave(text) {
    if (text.length !== 0) {
      this.props.addTodo(text);
    }
  }

  render() {
    return (
      <header className="header">
          <AppBar title="Todo"
                  showMenuIconButton={false}
                  iconElementRight={<IconButton title="Refresh"><RefreshIcon/></IconButton>} />
          <h1 style={defaultStyle} >todos</h1>
          <TodoTextInput newTodo
                         onSave={this.handleSave.bind(this)}
                         placeholder="What needs to be done?" />
      </header>
    );
  }
}

Header.propTypes = {
  addTodo: PropTypes.func.isRequired
};

export default Header;
