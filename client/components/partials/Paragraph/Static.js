import React, { Component, PropTypes } from 'react';
import styles from './styles.css';

function StaticParagraph(props) {
  return (
    <p>{props.children}</p>
  );
}

StaticParagraph.propTypes = {};

export default StaticParagraph;
