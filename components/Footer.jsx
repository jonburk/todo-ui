import React, { Component } from 'react';
import classnames from 'classnames';
import { Paper, BottomNavigation, BottomNavigationItem } from 'material-ui';

import TodayIcon from 'material-ui/svg-icons/action/today';
import ListIcon from 'material-ui/svg-icons/action/list';
import AddIcon from 'material-ui/svg-icons/content/add';

class Footer extends Component {
  render() {
    return (
      <footer className="footer">        
        <Paper zDepth={3}>
          <BottomNavigation selectedIndex={1} style={{backgroundColor: '#EDE9E1'}}>
            <BottomNavigationItem label='Due Today' icon={<TodayIcon/>}/>
            <BottomNavigationItem label='All' icon={<ListIcon/>}/>
            <BottomNavigationItem label='Add Task' icon={<AddIcon/>}/>
          </BottomNavigation>
        </Paper>
      </footer>
    );
  }
}

export default Footer;
