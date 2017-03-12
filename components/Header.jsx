import React, { PropTypes, Component } from 'react';
import IconButton from 'material-ui/IconButton';
import RefreshIcon from 'material-ui/svg-icons/navigation/refresh';

import AppBar from 'material-ui/AppBar';

class Header extends Component {
  render() {
    const { getTodos } = this.props.actions;
    const { busy } = this.props;
    const { pathname } = this.props.router.location;

    const refreshButton = (
      <IconButton title="Refresh" 
                  onTouchTap={() => getTodos(pathname === 'all')}
                  disabled={busy}>
        <RefreshIcon/>
      </IconButton>
    )

    return (
      <header className="header">
          <AppBar title="Todo"                  
                  showMenuIconButton={false}
                  zDepth={2}
                  iconElementRight={pathname == '/all' || pathname == '/' ? refreshButton : null} />
      </header>
    );
  }
}

Header.propTypes = {
  actions: PropTypes.object.isRequired,
  busy: PropTypes.bool.isRequired,
  router: PropTypes.object.isRequired
};

export default Header;
