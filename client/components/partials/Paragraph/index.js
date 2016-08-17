import React, { Component } from 'react';
import Static from './Static';
import Editting from './Editting';

class Paragraph extends Component {
  render() {
    let ParagraphComponent;

    if (this.props.isEditting) {
      ParagraphComponent = Editting;
    } else {
      ParagraphComponent = Static;
    }

    return (
      <ParagraphComponent>{this.props.children}</ParagraphComponent>
    );
  }
}

export default Paragraph;
