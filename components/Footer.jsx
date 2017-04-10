import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import { Paper, BottomNavigation, BottomNavigationItem } from 'material-ui';

import TodayIcon from 'material-ui/svg-icons/action/today';
import ListIcon from 'material-ui/svg-icons/action/list';
import DateRangeIcon from 'material-ui/svg-icons/action/date-range';

class Footer extends Component {
  render() {
    const { pathname } = this.props.router.location;
    const paths = ['/', '/week', '/all'];

    return (
      <footer className="footer">        
        <Paper zDepth={2}>
          <BottomNavigation selectedIndex={paths.indexOf(pathname)} style={{backgroundColor: '#EDE9E1'}}>
            {this.getNavigationItems()}
          </BottomNavigation>
        </Paper>
      </footer>
    );
  }

  getNavigationItems() {
    const { disabled, actions } = this.props;
    const items = []

    if (!disabled) {
      items.push(
        <BottomNavigationItem key='today'
                              label='Due Today'
                              onTouchTap={() => actions.push('/')}
                              icon={<TodayIcon/>}/>
      );
      items.push(
        <BottomNavigationItem key='week' 
                              label='This Week' 
                              onTouchTap={() => actions.push('/week')}
                              icon={<DateRangeIcon/>}/>
      );  
      items.push(
        <BottomNavigationItem key='all' 
                              label='All' 
                              onTouchTap={() => actions.push('/all')}
                              icon={<ListIcon/>}/>
      );    
    } 

    return items;
  }
}

Footer.propTypes = {
  actions: PropTypes.object.isRequired,
  disabled: PropTypes.bool.isRequired,
  router: PropTypes.object.isRequired
};

export default Footer;
