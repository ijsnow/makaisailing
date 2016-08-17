import React, { Component } from 'react';
import isLoggedIn from '../../hoc/isLoggedIn';
import * as Api from '../../../api';

import { Card, CardActions, CardHeader, CardMedia, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

class CardComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isEditting: props.isNew || false,
      isDeleting: false,
      _id: props._id,
      title: props.title,
      subtitle: props.subtitle,
      body: props.body,
    };

    this.onSave = this.onSave.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onSave() {
    if (this.props.isNew) {
      Api.activities.add(_.omit(this.state, ['isEditting', 'isDeleting']))
        .then(res => {
          this.props.onFinish();
        })
        .catch(err => console.log(err));
    } else {
      this.props.onEdit(_.omit(this.state, ['isEditting', 'isDeleting']));

      this.setState({isEditting: false});
    }

    this.props.onSave();
  }

  onDelete() {
    this.props.onDelete(this.props._id);
  }


  onCancel() {
    if (this.props.isNew) {
      this.props.onFinish();
    } else {
      this.setState({
        isEditting: false,
        isDeleting: false,
        title: this.props.title,
        subtitle: this.props.subtitle,
        body: this.props.body,
      });
    }
  }

  render() {
    return (
      <Card className={this.props.className}>
        {
          this.state.isEditting ? (
            <div style={{padding: 20}}>
              <TextField id={`card.editting.title.${this.props._id}`}
                style={{width: '100%'}}
                hintText="Title"
                value={this.state.title}
                onChange={event => this.setState({title: event.target.value})}
              />
              <TextField id={`card.editting.subtitle.${this.props._id}`}
                style={{width: '100%'}}
                hintText="Optional Subtitle"
                value={this.state.subtitle}
                onChange={event => this.setState({subtitle: event.target.value})}
              />
            </div>
          ) : (
            <CardTitle
              title={this.state.isEditting ? this.state.title : this.props.title}
              subtitle={this.state.isEditting ? this.state.subtitle : this.props.subtitle}
            />
          )
        }


        <CardText>
          {
            this.state.isEditting ? (
              <TextField id={`card.editting.body.${this.props._id}`}
                value={this.state.body}
                onChange={event => this.setState({body: event.target.value})}
                multiLine={true}
                fullWidth={true}
                hintText="Description"
              />
            ) : (
              this.props.body
            )
          }
        </CardText>

        {
          this.props.isLoggedIn && (
            <CardActions>
              {
                this.state.isEditting ? (
                  <div>
                    <FlatButton label="save" onClick={this.onSave} primary={true} />
                    <FlatButton label="cancel" onClick={this.onCancel} secondary={true} />
                  </div>
                ) : (
                  <div>
                    <FlatButton label="edit" onClick={() => this.setState({isEditting: true})}  primary={true} />
                    <FlatButton label="delete" onClick={() => this.setState({isDeleting: true})}  secondary={true} />
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

export default isLoggedIn(CardComponent);
