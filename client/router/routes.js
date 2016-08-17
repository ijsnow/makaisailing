import React, {Component} from 'react';
import {Route, IndexRoute, Redirect} from 'react-router';
import App from '#app/components/app';
import Homepage from '#app/components/homepage';
import Gallery from '#app/components/gallery';
import Contact from '#app/components/contact';
import Policy from '#app/components/policy';
import Usage from '#app/components/usage';

import Login from '#app/components/login';

import NotFound from '#app/components/not-found';

import isLoggedIn from '#app/components/hoc/isLoggedIn';
import * as Api from '#app/api';

class Logout extends Component {
  componentWillMount() {
    Api.auth.logout();
  }

  render() {
    return <div />;
  }
}

/**
 * Returns configured routes for different
 * environments. `w` - wrapper that helps skip
 * data fetching with onEnter hook at first time.
 * @param {Object} - any data for static loaders and first-time-loading marker
 * @returns {Object} - configured routes
 */
export default ({store, first}) => {

  // Make a closure to skip first request
  function w(loader) {
    return (nextState, replaceState, callback) => {
      if (first.time) {
        first.time = false;
        return callback();
      }

      // TODO: Get image carousel that works with ssr
      // This is a hack to get the size for the image carousel fixed for ssr.
      // I hate this but I'm in a rush.
      window['--ui-initial-load'] = false;

      return loader ? loader({store, nextState, replaceState, callback}) : callback();
    };
  }

  return (
    <Route path="/" component={App}>
      <IndexRoute component={isLoggedIn(Homepage)} onEnter={w(Homepage.onEnter)} />

      <Route path="/gallery" component={isLoggedIn(Gallery)} onEnter={w(Gallery.onEnter)} />
      <Route path="/contact" component={isLoggedIn(Contact)} onEnter={w(Contact.onEnter)} />
      <Route path="/policy" component={isLoggedIn(Policy)} onEnter={w(Policy.onEnter)} />
      <Route path="/terms" component={isLoggedIn(Policy)} onEnter={w(Policy.onEnter)} />

      <Route path="/login" component={isLoggedIn(Login)} onEnter={w(Login.onEnter)} />
      <Route path="/logout" component={Logout} />
      <Route path="/usage" component={isLoggedIn(Usage)} onEnter={w(Usage.onEnter)} />

      <Route path="*" component={NotFound} onEnter={w(NotFound.onEnter)} />
    </Route>
  );
};
