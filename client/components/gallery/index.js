import React, {Component} from 'react';
import {connect} from 'react-redux';
import {
  fetchPageData,
  setPageData,
  editImage,
  removeImage,
} from '../../actions';

import * as Api from '../../api';
import Helmet from 'react-helmet';
import {Link} from 'react-router';
import classNames from './styles';

import AppBar from '../partials/AppBar';
import Footer from '../partials/Footer';
import Paragraph from '../partials/Paragraph';
import ImageCarousel from '../partials/ImageCarousel';
import UploadImage from '../partials/ImageCarousel/UploadImage';

import {GridList, GridTile} from 'material-ui/GridList';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

class Gallery extends Component {

  /*eslint-disable */
  static onEnter({store, nextState, replaceState, callback}) {
    fetch('/api/page/home').then(r => r.json())
      .then(res => {
        store.dispatch(setPageData(res));
        callback();
      });
  }
  /*eslint-enable */

  constructor(props) {
    super(props);

    this.state = {
      isAddingImage: false,
      activeImage: null,
    };
  }

  componentWillMount() {
    this.props.fetchPageData('gallery');
  }

  render() {
    return (
      <div>
        <Helmet title='Gallery - Makai Sailing' />

        <div className={classNames.container}>
          <div className={`${classNames.header} ${classNames.blue}`}>
            <AppBar />
          </div>

          <div className={`${classNames.blue} ${classNames.gallery}  ${classNames.heightFix}`}>
            {
              this.props.isLoggedIn && (
                <div style={{
                  marginBottom: '20px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <RaisedButton
                    label="add image"
                    primary={true}
                    onClick={() => this.setState({isAddingImage: true})}
                  />
                </div>
              )
            }
            <ImageCarousel
              sources={this.props.images}
              className={classNames.blue}
              activeImage={this.state.activeImage}
              onChanged={() => this.setState({activeImage: null})}
              onEdit={this.props.editImage}
              onDelete={this.props.removeImage}
            />

            {
              this.state.isAddingImage && (
                <Dialog
                  modal={false}
                  open={this.state.isAddingImage}
                  onRequestClose={this.handleClose}
                  className={classNames.dialog}
                >
                  <UploadImage
                    className={classNames.container}
                    isForHomePage={true}
                    onSave={() => {
                      this.props.fetchPageData('gallery');
                      this.setState({isAddingImage: false});
                    }}
                    onCancel={() => this.setState({isAddingImage: false})}
                  />
                </Dialog>
              )
            }
          </div>

          <div className={classNames.grid}>
            <GridList
              cellHeight={200}
              className={classNames.gridList}
            >
              {
                this.props.images.map(image => (
                  <GridTile
                    key={image._id}
                    className={classNames.tile}
                    onClick={() => this.setState({activeImage: image._id})}
                  >
                    <img src={Api.helpers.buildImageUrl(image._id)} className={classNames.tileImg} />
                  </GridTile>
                ))
              }
            </GridList>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default connect(state => ({ images: state.content.images }), {
  fetchPageData,
  setPageData,
  editImage,
  removeImage,
})(Gallery);
