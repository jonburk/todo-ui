import React, { Component, PropTypes } from "react";
import { RefreshIndicator } from 'material-ui';

class BusyIndicator extends Component {
  render() {
    return <RefreshIndicator top={0} 
                             left={-60} 
                             size={120}
                             style={{marginLeft: '50%', marginTop: 'calc(50vh - 60px)'}}
                             status='loading'/>    
  }
}

export default BusyIndicator;