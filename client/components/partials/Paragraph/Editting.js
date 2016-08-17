import React, { Component, PropTypes } from 'react';
import styles from './styles.css';

function EdittingParagraph(props) {
  return (
    <textarea>{props.children}</textarea>
  );
}

EdittingParagraph.propTypes = {};

export default EdittingParagraph;
