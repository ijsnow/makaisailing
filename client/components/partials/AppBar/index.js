import React, {Component} from 'react';
import {Link} from 'react-router';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import Divider from 'material-ui/Divider';

import isLoggedIn from '../../hoc/isLoggedIn';
import classNames from './styles.css';

class MKAppBar extends Component {
  static contextTypes = {
    router: React.PropTypes.object
  }

  render() {
    return (
      <AppBar
        title="Na Pali Makai Sailing"
        onTitleTouchTap={() => this.context.router.push('/')}
        style={{
          background: 'transparent',
          boxShadow: 'none',
        }}
        className={classNames.appBar}
        iconElementLeft={<div />}
        iconElementRight={
          <div>
            <IconMenu
              iconButtonElement={<IconButton className={classNames.menuIcon}><MoreVertIcon /></IconButton>}
              targetOrigin={{horizontal: 'right', vertical: 'top'}}
              anchorOrigin={{horizontal: 'right', vertical: 'top'}}
            >
              <MenuItem primaryText="Home" containerElement={<Link to="/" />} />
              <MenuItem primaryText="Gallery" containerElement={<Link to="/gallery" />} />
              <MenuItem primaryText="Contact" containerElement={<Link to="/contact" />} />

              {
                this.props.isLoggedIn && (
                  <MenuItem>
                    <Divider />
                    <Link to="/logout">Logout</Link>
                  </MenuItem>
                )
              }
            </IconMenu>

            <div className={classNames.navBar}>
              <Link to="/">Home</Link>
              <Link to="/gallery">Gallery</Link>
              <Link to="/contact">Contact</Link>
              {
                this.props.isLoggedIn && (
                  <Link to="/logout">Logout</Link>
                )
              }
            </div>
          </div>
        }
      />
    );
  }
}
// const AppBarExampleIconMenu = (props) => (
//
// );

export default isLoggedIn(MKAppBar);
