import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Paper, BottomNavigation, BottomNavigationItem } from 'material-ui';
import { browserHistory } from 'react-router';

import TodayIcon from 'material-ui/svg-icons/action/today';
import ListIcon from 'material-ui/svg-icons/action/list';
import AddIcon from 'material-ui/svg-icons/content/add';

class Footer extends Component {
  render() {
    const { pathname } = this.props.router.location;
    const paths = ['/', 'all', 'add'];

    return (
      <footer className="footer">        
        <Paper zDepth={3}>
          <BottomNavigation selectedIndex={paths.indexOf(pathname)} style={{backgroundColor: '#EDE9E1'}}>
            {this.getNavigationItems()}
          </BottomNavigation>
        </Paper>
      </footer>
    );
  }

  getNavigationItems() {
    const { disabled } = this.props;
    const items = []

    if (!disabled) {
      items.push(
        <BottomNavigationItem key='today'
                              label='Due Today'
                              onTouchTap={() => browserHistory.push('/')}
                              icon={<TodayIcon/>}/>
      );
      items.push(
        <BottomNavigationItem key='all' 
                              label='All' 
                              onTouchTap={() => browserHistory.push('all')}
                              icon={<ListIcon/>}/>
      );
      items.push(
        <BottomNavigationItem key='add' 
                              label='Add Task' 
                              onTouchTap={() => browserHistory.push('add')}
                              icon={<AddIcon/>}/>
      );
    } 

    return items;
  }
}

Footer.propTypes = {
  disabled: PropTypes.bool.isRequired,
  router: PropTypes.object.isRequired
};

export default Footer;
