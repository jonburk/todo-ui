import React, { PropTypes, Component } from 'react';
import TodoTextInput from './TodoTextInput';
import IconButton from 'material-ui/IconButton';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import AppBar from 'material-ui/AppBar';

class Header extends Component {
  render() {
    return (
      <header className="header">
          <AppBar title="Todo"                  
                  showMenuIconButton={false}
                  iconElementRight={<IconButton title="Refresh"><RefreshIcon/></IconButton>} />          
      </header>
    );
  }
}

export default Header;
