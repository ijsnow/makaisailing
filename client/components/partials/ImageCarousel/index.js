import React, { Component } from 'react';
import _ from 'lodash';


import Carousel from 'nuka-carousel';

import Scroll from 'react-scroll';

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
    console.log('~~~~~~~~~~', this, arguments);

    return {
      hasResized: false,
      index: 0,
    };
  },

  // componentDidMount() {
  //   console.log(this.refs.carousel.refs.slider);
  //   window.addEventListener('resize', () => this.setState({hasResized: true}))
  // },

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeImage && !this.props.activeImage) {
      const newIndex = this.props.sources.findIndex(src => src._id === nextProps.activeImage);
      this.setState({index: newIndex});
      Scroll.animateScroll.scrollTo(100);

      this.props.onChanged();
    }
  },

  // render() {
  //   return (
  //     <div style={{
  //       maxWidth: 1000,
  //       minHeight: 700,
  //       borderColor: 'yellow',
  //       boarderWidth: 10,
  //     }}>
  //       <Carousel ref="carousel" data={() => this.setCarouselData('carousel')}
  //         className={classNames.carousel}
  //         decorators={this.getDecorators(this.props.footer, this.state.hasResized)}
  //         dragging={true}
  //         frameOverflow={'visible'}
  //       >
  //         {this.props.sources.map(source => (
  //           <ImageCell key={source._id}
  //             {...source}
  //             isLoggedIn={this.props.isLoggedIn}
  //             onEdit={this.props.onEdit}
  //             onDelete={this.props.onDelete}
  //           />)
  //         )}
  //       </Carousel>
  //     </div>
  //   );
  // },

  nextSlide() {
    const newIndex = this.state.index + 1;

    if (newIndex < this.props.sources.length) {
      this.setState({index: newIndex});
    }
  },

  previousSlide() {
    const newIndex = this.state.index - 1;

    if (newIndex >= 0) {
      this.setState({index: newIndex});
    }
  },

  render() {
    const source = this.props.sources[this.state.index];

    if (!source) {
      return <div />;
    }

    return (
      <div className={classNames.containerElement}>
        <IconButton className={`${classNames.icon} ${classNames.visibleBig}`} onClick={this.previousSlide}>
          <LeftArrow color={colors.beige} />
        </IconButton>

        <ImageCell key={source._id}
          {...source}
          isLoggedIn={this.props.isLoggedIn}
          onEdit={this.props.onEdit}
          onDelete={this.props.onDelete}
        />

        <div className={classNames.visibleSmall}>
          <IconButton className={`${classNames.icon}`} onClick={this.previousSlide}>
            <LeftArrow color={colors.beige} />
          </IconButton>

          <IconButton className={`${classNames.icon}`} onClick={this.nextSlide}>
            <RightArrow color={colors.beige} />
          </IconButton>
        </div>

        <IconButton className={`${classNames.icon} ${classNames.visibleBig}`} onClick={this.nextSlide}>
          <RightArrow color={colors.beige} />
        </IconButton>
      </div>
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
