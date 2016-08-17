import React, { Component } from 'react';
import _ from 'lodash/fp';
import { Link } from 'react-router';

import * as Api from '../../api';
//import classNames from './styles';

import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Error from '../partials/Error';

export default class Login extends Component {
  /*eslint-disable */
  static onEnter({store, nextState, replaceState, callback}) {
    // Load here any data.
    callback(); // this call is important, don't forget it
  }
  /*eslint-enable */

  static contextTypes = {
    router: React.PropTypes.object
  };

  componentWillMount() {
    if (this.props.isLoggedIn) {
      this.context.router.replace('/');
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      username: '',
      usernameError: null,
      password: '',
      passwordError: null,
      error: null
    };

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();

    let errors = {};

    if (this.state.username === '') {
      errors.usernameError = 'Username is required';
    }

    if (this.state.password === '') {
      errors.passwordError = 'Password is required';
    }

    if (_.isEmpty(errors)) {
      // send request
      Api.auth.login(this.state.username, this.state.password)
        .then(res => {
          if (res.error) {
            return this.setState({
              error: res.error,
              password: ''
            });
          }

          Api.auth.storeToken(res.token);
        })
        .catch(err => console.log(err));
    } else {
      this.setState({password: '', ...errors});
    }
  }

  render() {
    return (
      <div style={{maxWidth: 300, marginLeft: 'auto', marginRight: 'auto', paddingTop: 30}}>
        <h1>Login</h1>
        <form onSubmit={this.handleSubmit}>

          <TextField style={{width: '100%'}}
            hintText="Username"
            errorText={this.state.usernameError}
            onChange={event => this.setState({username: event.target.value, usernameError: null})}
          /><br />

          <TextField style={{width: '100%'}}
            hintText="Password"
            type="password"
            errorText={this.state.passwordError}
            onChange={event => this.setState({password: event.target.value, passwordError: null})}
          /><br />

          {
            this.state.error && (
              <Error>{this.state.error}</Error>
            )
          }

          <RaisedButton label="Login" fullWidth={true} type="submit" />
        </form>
      </div>
    );
  }
}
