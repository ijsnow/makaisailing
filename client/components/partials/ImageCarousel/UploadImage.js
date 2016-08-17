import React, {Component} from 'react';
import _ from 'lodash';
import * as Api from '../../../api';
import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

export default class UploadImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      imageUrl: null,
      file: null,
      caption: '',
      isForHomePage: props.isForHomePage,
    };

    this.onPick = this.onPick.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onPick(event) {
    event.preventDefault();

    let reader = new FileReader();
    let file = event.target.files[0];

    reader.onloadend = () => {
      this.setState({
        file: file,
        imageUrl: reader.result
      });
    }

    reader.readAsDataURL(file);
  }

  onSubmit() {
    Api.images.upload(_.omit(this.state, 'imageUrl'), this.props.onSave)
  }

  render() {
    return (
      <Card
        style={{
          width: '90%',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
        className={this.props.className}
      >

        {
          this.state.imageUrl && (
            <CardMedia
              overlay={<CardTitle title={this.state.caption} />}
            >
              <img src={this.state.imageUrl} />
            </CardMedia>
          )
        }

        <CardText>
          <TextField id={`card.editting.title.${this.props._id}`}
            style={{width: '100%'}}
            hintText="Image Caption"
            value={this.state.caption}
            onChange={event => this.setState({caption: event.target.value})}
          />
        </CardText>

        <CardActions>
          {
            this.state.file ? (
              <FlatButton label="Submit" primary={true} onClick={this.onSubmit} />
            ) : (
              <FlatButton label="Choose Image" primary={true} labelPosition="before">
                <input type="file"
                  onChange={this.onPick}
                  style={{
                  cursor: 'pointer',
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  width: '100%',
                  opacity: 0,
                  }}
                />
              </FlatButton>
            )
          }

          <FlatButton label="cancel" onClick={this.props.onCancel} secondary={true} />
        </CardActions>

      </Card>
    );
  }
}
