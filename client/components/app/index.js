import React, { Component } from 'react';
import Helmet from 'react-helmet';
import Footer from '../partials/Footer';

export default class App extends Component {
  render() {
    return (
      <div>
        <Helmet title='Makai Sailing' />
        {this.props.children}
      </div>
    );
  }
}
