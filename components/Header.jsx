import React, { PropTypes, Component } from 'react';
import IconButton from 'material-ui/IconButton';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import AppBar from 'material-ui/AppBar';

class Header extends Component {
  render() {
    const { getTodos } = this.props.actions;

    const refreshButton = (
      <IconButton title="Refresh" 
                  onTouchTap={() => getTodos()}>
        <RefreshIcon/>
      </IconButton>
    )

    return (
      <header className="header">
          <AppBar title="Todo"                  
                  showMenuIconButton={false}
                  iconElementRight={refreshButton} />          
      </header>
    );
  }
}

Header.propTypes = {
  actions: PropTypes.object.isRequired
};

export default Header;
