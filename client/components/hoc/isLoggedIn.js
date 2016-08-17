import React, { Component } from 'react';
import * as Api from '#app/api';

export default function isLoggedIn(ComposedComponent) {
  const isLoggedIn = Api.auth.fetchToken() !== null;

  return (props) => <ComposedComponent isLoggedIn={isLoggedIn} {...props} />;
}
