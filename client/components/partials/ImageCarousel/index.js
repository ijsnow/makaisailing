import React, { Component } from 'react';
import Carousel from 'nuka-carousel';
import Slider from 'react-slick';
import isLoggedIn from '../../hoc/isLoggedIn';

import {Card, CardMedia, CardTitle, CardActions, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import LeftArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import RightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

import ImageCell from './ImageCell';

import classNames from './styles.css';
import colors from '../../../css/vars';

// TODO: Get image carousel that works with ssr
// This is a hack to get the size for the image carousel fixed for ssr.
// I hate this but I'm in a rush.
const ImageCarousel = React.createClass({
  mixins: [Carousel.ControllerMixin],

  getInitialState() {
    return {
      hasResized: false,
    };
  },

  componentDidMount() {
    console.log(this.refs.carousel.refs.slider);
    window.addEventListener('resize', () => this.setState({hasResized: true}))
  },

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeImage) {
      this.refs.carousel.goToSlide(_.findIndex(this.props.sources, source => (
        source._id === nextProps.activeImage
      )))
      this.props.onChanged();
    }
  },

  render() {
    return (
      <Carousel ref="carousel" data={() => this.setCarouselData('carousel')}
        className={classNames.carousel}
        decorators={this.getDecorators(this.props.footer, this.state.hasResized)}
        dragging={true}
        frameOverflow={'visible'}
      >
        {this.props.sources.map(source => (
          <ImageCell key={source._id}
            {...source}
            isLoggedIn={this.props.isLoggedIn}
            onEdit={this.props.onEdit}
            onDelete={this.props.onDelete}
          />)
        )}
      </Carousel>
    );
  },

  getDecorators: (footer, hasResized) => {
    return [
      {
        component: function(props) {
          return (
            <IconButton onClick={props.previousSlide}>
              <LeftArrow color={colors.beige} />
            </IconButton>
          );
        },
        position: 'CenterLeft',
        style: {}//hasResized || !window['--ui-initial-load'] ? {} : {top: '35vw'}
      },
      {
        component: function(props) {
          return (
            <IconButton onClick={props.nextSlide}>
              <RightArrow color={colors.beige} />
            </IconButton>
          );
        },
        position: 'CenterRight',
        style: {}//hasResized || !window['--ui-initial-load'] ? {} : {top: '35vw'}
      },
      {
        component: () => footer || <div />,
        position: 'BottomCenter',
        style: {}//hasResized || !window['--ui-initial-load'] ? {bottom: undefined} : {bottom: '-70vw'}
      }
    ];
  },
});

export default isLoggedIn(ImageCarousel);
