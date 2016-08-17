import React, { Component } from 'react';
import isLoggedIn from '../../hoc/isLoggedIn';

import {Card, CardMedia, CardTitle, CardActions, CardText} from 'material-ui/Card';
import TextField from 'material-ui/TextField';
import Checkbox from 'material-ui/Checkbox';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconButton from 'material-ui/IconButton';
import LeftArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import RightArrow from 'material-ui/svg-icons/hardware/keyboard-arrow-right';

import classNames from './styles.css';
import colors from '../../../css/vars';

export default class ImageCell extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditting: false,
      isDeleting: false,
      _id: props._id,
      caption: props.caption,
      isForHomePage: props.isForHomePage,
    };

    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onSave() {
    this.props.onEdit(_.omit(this.state, ['isEditting', 'isDeleting']));

    this.setState({isEditting: false});
  }

  onDelete() {
    this.props.onDelete(this.props._id);
  }

  onCancel() {
    this.setState({
      isEditting: false,
      isDeleting: false,
      caption: this.props.caption
    });
  }

  render() {
    return (
      <Card className={classNames.container}>
        <CardMedia
          overlay={<CardTitle title={this.state.isEditting ? this.state.caption : this.props.caption} className={classNames.caption} />}
        >
          <img className={classNames.img} src={`/api/images/${this.props._id}`} />
        </CardMedia>
        {
          this.props.isLoggedIn && (
            <CardText>
              <TextField id={`card.editting.body.${this.props._id}`}
                disabled={!this.state.isEditting}
                value={this.state.caption}
                onChange={event => this.setState({caption: event.target.value})}
                fullWidth={true}
                hintText="Caption"
              />
              <Checkbox
                disabled={!this.state.isEditting}
                label="Show on home page"
                checked={this.state.isForHomePage}
                onCheck={(e, isForHomePage) => this.setState({isForHomePage})}
              />
            </CardText>
          )
        }

        {
          this.props.isLoggedIn && (
            <CardActions>
              {
                this.state.isEditting ? (
                  <div>
                    <FlatButton label="Save" primary={true} onClick={this.onSave} />
                    <FlatButton label="Cancel" secondary={true} onClick={this.onCancel} />
                  </div>
                ) : (
                  <div>
                    <FlatButton label="Edit" primary={true} onClick={() => this.setState({isEditting: true})} />
                    <FlatButton label="Delete" secondary={true} onClick={() => this.setState({isDeleting: true})} />
                  </div>
                )
              }

              {
                this.state.isDeleting && (
                  <div>
                    <RaisedButton label="confirm delete" onClick={this.onDelete} secondary={true} />
                    <RaisedButton label="cancel" onClick={this.onCancel} primary={true} />
                  </div>
                )
              }
            </CardActions>
          )
        }
      </Card>
    );
  }
}
