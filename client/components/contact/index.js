import React, {Component} from 'react';
import Helmet from 'react-helmet';
import * as Api from '../../api';
import AppBar from '../partials/AppBar';
import Footer from '../partials/Footer';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';

import classNames from './styles';

class Contact extends Component {
  static onEnter({store, nextState, replaceState, callback}) {
    callback();
  }

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      subject: '',
      message: '',
      errors: {
        email: null,
        subject: null,
        message: null,
      },
      isSending: false,
      showSuccess: false,
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(event) {
    event.preventDefault();

    const {email, subject, message} = this.state;
    let errors = {};

    if (email === '') {
      errors.email = 'Email is required';
    }

    if (subject === '') {
      errors.subject = 'Subject is required';
    }

    if (message === '') {
      errors.message = 'Message is required';
    }

    if (_.isEmpty(errors) && !this.state.isSending) {
      this.setState({isSending: true});
      Api.contact.email({email, subject, message})
        .then(res => this.setState({
          email: '',
          subject: '',
          message: '',
          showSuccess: true,
          isSending: false,
        }));
    } else {
      this.setState({errors});
    }
  }

  render() {
    return (
      <div>
        <Helmet title='Contact - Makai Sailing' />

        <div className={classNames.container}>
          <div className={`${classNames.header} ${classNames.blue}`}>
            <AppBar />
          </div>
          <div className={classNames.content}>
            <h1>Contact Info</h1>
            <div className={classNames.info}>
              Phone:
              <span>
                <a href="tel:+18086389352">(808) 639-9352</a>
              </span>
            </div>
            <div className={classNames.info}>
              Email:
              <span>
                <a href="mailto:questions@napalimakai.com">questions@napalimakai.com</a>
              </span>
            </div>
          </div>
          <form onSubmit={this.onSubmit} className={classNames.form}>
            <h1>Send Message</h1>

            <TextField value={this.state.email}
              floatingLabelText="Email"
              hintText="joe@example.com"
              onChange={event => this.setState({
                email: event.target.value, errors: {...this.state.errors, email: ''}
              })}
              errorText={this.state.errors.email}
            />

            <TextField value={this.state.subject}
              floatingLabelText="Subject"
              hintText="Make a Reservation"
              onChange={event => this.setState({
                subject: event.target.value, errors: {...this.state.errors, subject: ''}
              })}
              errorText={this.state.errors.subject}
            />

            <TextField value={this.state.message}
              floatingLabelText="Message"
              hintText="My message..."
              multiLine={true}
              fullWidth={true}
              onChange={event => this.setState({
                message: event.target.value, errors: {...this.state.errors, message: ''}
              })}
              errorText={this.state.errors.message}
            />

            <RaisedButton
              label="Send"
              fullWidth={true}
              type="submit"
              disabled={this.state.isSending}
            />
          </form>

          <Snackbar
            open={this.state.showSuccess}
            message="Your message was sent"
            autoHideDuration={4000}
            onRequestClose={() => this.setState({showSuccess: false})}
          />
        </div>
        <Footer />
      </div>
    );
  }
}

export default Contact;
