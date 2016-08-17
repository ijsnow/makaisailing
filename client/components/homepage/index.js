import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
  fetchHomepageData,
  setPageData,
  fetchActivities,
  editActivity,
  removeActivity,
  editImage,
  removeImage,
} from '../../actions';

import * as Api from '../../api';

import Helmet from 'react-helmet';
import { Link } from 'react-router';
import classNames from './styles';

import AppBar from '../partials/AppBar';
import Footer from '../partials/Footer';
import Paragraph from '../partials/Paragraph';
import ImageCarousel from '../partials/ImageCarousel';
import UploadImage from '../partials/ImageCarousel/UploadImage';

import Card from '../partials/Card';
import RaisedButton from 'material-ui/RaisedButton';

class Homepage extends Component {
  /*eslint-disable */
  static onEnter({store, nextState, replaceState, callback}) {
    fetch('/api/page/gallery').then(r => r.json())
      .then(res => {
        store.dispatch(setPageData(res));
        callback();
      });
  }
  /*eslint-enable */

  constructor(props) {
    super(props);

    this.state = {
      isAddingActivity: false,
      isAddingImage: false,
    };
  }

  componentWillMount() {
    this.props.fetchHomepageData();
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <Helmet
          title='Makai Sailing'
          meta={[
            {
              property: 'og:title',
              content: 'Na Pali Makai Sailing'
            }
          ]}
        />
        <div className={classNames.header} style={{
          background: `url(${require('../../assets/images/makaisailing-bg-new.jpg')})`,
          backgroundSize: 'cover'
        }}>
          <AppBar />
        </div>

        <div className={classNames.container}>
        <section className={classNames.section}>
          <h1>
            What We Do
          </h1>

          {
            _.chunk(this.props.content.activities, 3).map((row, i) => (
              <div className={classNames.row} key={i}>
                {
                  row.map((card, i) => (
                    <Card key={i}
                      className={classNames.card}
                      {...card}
                      onSave={this.props.fetchActivities}
                      onEdit={this.props.editActivity}
                      onDelete={this.props.removeActivity}
                    />
                  ))
                }
              </div>
            ))
          }
          {
            this.props.isLoggedIn && (
              <div className={classNames.row}>
                {
                  this.state.isAddingActivity ? (
                    <Card
                      className={classNames.card}
                      isNew={true}
                      id={''}
                      title={''}
                      subtitle={''}
                      body={''}

                      onSave={this.props.fetchActivities}
                      onFinish={() => this.setState({isAddingActivity: false})}
                    />
                  ) : (
                    <RaisedButton
                      onClick={() => this.setState({isAddingActivity: true})}
                      label="add item"
                      primary={true}
                      style={{width: '25%', marginRight: 'auto', marginLeft: 'auto'}}
                    />
                  )
                }
              </div>
            )
          }
        </section>

        <section className={`${classNames.section} ${classNames.blue} ${classNames.heightFix}`}>
          {
            this.props.content.images.length > 0 && (
              <ImageCarousel
                sources={this.props.content.images}
                onEdit={this.props.editImage}
                onDelete={this.props.removeImage}
              />
            )
          }

          {
            this.state.isAddingImage && (
              <UploadImage
                isForHomePage={true}
                onSave={this.props.fetchHomepageData}
                onCancel={() => this.setState({isAddingImage: false})}
              />
            )
          }
          
          <div className={`${classNames.row} ${classNames.center} ${classNames.imageFooter}`}>
            <RaisedButton
              containerElement={<Link to="/gallery" />}
              label="see more"
            />
            {
              this.props.isLoggedIn && (
                !this.state.isAddingImage &&
                  <RaisedButton label="add image" primary={true} onClick={() => this.setState({isAddingImage: true})} />
              )
            }
          </div>
        </section>

        </div>
        <Footer light={true} />
      </div>
    );
  }
}

export default connect(state => ({ content: state.content }), {
  fetchHomepageData,
  setPageData,
  fetchActivities,
  editActivity,
  removeActivity,
  editImage,
  removeImage,
})(Homepage);

const styles = {
  card: {
    flex: 1,
    width: 275,
    float: 'left'
  },
  row: {

  }
};
