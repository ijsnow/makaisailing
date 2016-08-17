import React, {Component} from 'react';
import classNames from './styles.css';

import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';
import FontIcon from 'material-ui/FontIcon';
import IconLocationOn from 'material-ui/svg-icons/communication/location-on';


class Footer extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  render() {
    console.log(this.context);
    return (
      <Paper zDepth={1} className={`${classNames.container} ${this.props.light ? classNames.light : ''}`}>
        <BottomNavigation>
          <BottomNavigationItem
            className={classNames.item}
            label="Policy & Terms"
            icon={<div />}
            onTouchTap={() => this.context.router.push('/policy')}
          />
          <BottomNavigationItem
            className={classNames.item}
            style={{padding: 'none'}}
            label="Copyright © 2016 Napali Makai LLC. All rights reserved."
            icon={<div />}
            onTouchTap={() => this.context.router.push('/policy')}
          />
        </BottomNavigation>
      </Paper>
    );
  }
}

export default Footer;
