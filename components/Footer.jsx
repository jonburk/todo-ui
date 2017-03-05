import React, { Component, PropTypes } from 'react';
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
      items.push(<BottomNavigationItem key='today' label='Due Today' icon={<TodayIcon/>}/>);
      items.push(<BottomNavigationItem key='all' label='All' icon={<ListIcon/>}/>);
      items.push(<BottomNavigationItem key='add' label='Add Task' icon={<AddIcon/>}/>);
    } 

    return items;
  }
}

Footer.propTypes = {
  disabled: PropTypes.bool.isRequired
};

export default Footer;
