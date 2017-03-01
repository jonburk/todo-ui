import React, { PropTypes, Component } from 'react';
import classnames from 'classnames';
import { SHOW_ALL, SHOW_COMPLETED, SHOW_ACTIVE } from '../constants/TodoFilters';
import { RaisedButton, List, ListItem, Divider, BottomNavigation, BottomNavigationItem } from 'material-ui';

import TodayIcon from 'material-ui/svg-icons/action/today';
import ListIcon from 'material-ui/svg-icons/action/list';
import AddIcon from 'material-ui/svg-icons/content/add';

import palette from '../src/material_ui_raw_theme_file';


const FILTER_TITLES = {
  [SHOW_ALL]: 'Due Today',
  [SHOW_ACTIVE]: 'All',
  [SHOW_COMPLETED]: 'Add Task'
};

const FILTER_ICONS = {
  [SHOW_ALL]: <TodayIcon />,
  [SHOW_ACTIVE]: <ListIcon />,
  [SHOW_COMPLETED]: <AddIcon />
};

class Footer extends Component {
  renderFilterLink(filter) {
    const title = FILTER_TITLES[filter];
    const { onShow } = this.props;
    
    return (
      <BottomNavigationItem key={filter} 
                            label={title}
                            icon={FILTER_ICONS[filter]}
                            onTouchTap={() => onShow(filter)} />
    );
  }

  render() {
    const { filter } = this.props;
    const filters = [SHOW_ALL, SHOW_ACTIVE, SHOW_COMPLETED];
    const selectedIndex = filters.indexOf(filter);

    return (
      <footer className="footer">
        <Divider style={{marginTop: 10}}/>
        <BottomNavigation selectedIndex={selectedIndex}>
          {filters.map(filter =>
            this.renderFilterLink(filter)
          )}          
        </BottomNavigation>
      </footer>
    );
  }
}

Footer.propTypes = {
  filter: PropTypes.string.isRequired,
  onShow: PropTypes.func.isRequired
};

export default Footer;
