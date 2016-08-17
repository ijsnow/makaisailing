import React, { Component } from 'react';

export default function RequireAuth(ComposedComponent) {
  return class RequiredAuthComponent extends Component {
    componentWillMount() {
      // check for token
    }

    render() {
      return <ComposedComponent {...this.props} />;
    }
  }
}
