import React, {Component} from 'react';
import Helmet from 'react-helmet';
import AppBar from '../partials/AppBar';
import classNames from './styles.css';

export default class Policy extends Component {
  static onEnter({store, nextState, replaceState, callback}) {
    callback();
  }

  render() {
    return (
      <div>
        <Helmet title='Policty & Terms - Makai Sailing' />

        <div className={classNames.container}>
          <div className={`${classNames.header} ${classNames.blue}`}>
            <AppBar />
          </div>
          <div className={classNames.content}>
            <section>
              <h1>Policy</h1>

              <ul>
                <li>Not recommended for individuals who have bad backs, neck, knees, and hip replacements.</li>
                <li>No smoking on vessel.</li>
                <li>No pregnant women.</li>
              </ul>
            </section>

            <section>
              <h1>Terms and Conditions</h1>

              <p>All bookings are nonrefundable if cancelled less than 48 hours prior to activity date. Parties of 4 and up require 72 hours advance notice to cancel. Service fee of $10.00 per person will be charged to your credit card to cancel a reservation before 48hrs of the tour.  All acivities are at your own risk. No liability, expressed or implied, rests with Na Pali Makai LLC or it's subsidiaries or officers. For your safety, Snorkeling, and all cruises, in part or whole, are weather permitting.</p>
              <p>Captain may use his diescretion in choosing alternate sites (without giving prior notice). Photos of passengers may be used on our website or in promotion materials. Due to the nature of these open ocean excursions, we cannot take pregnant women, those with serious health concerns, a history of spinal injury, or children under the age of 4 on the catamaran tours.</p>
              <p>Please give us a call at (808) 639-9352 when you arrive on Kauai to reconfirm your cruise.</p>

              <ul>
                <li>Credit card information is requested to hold and guarantee your reservation.</li>
                <li>Cancellation Policy: Tours canceled 24 hours prior to the event are nonfundable.</li>
                <li>Parties of 4 or more require a 50% deposit (nonrefundable within 48 hours of tour.)</li>
                <li>No shows charged 100%. If Na Pali Makai cancels due to weather or unforeseen circumstances, no charges will be made.</li>
                <li>If you have any further questions, contact us at (808) 639-9352</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    );
  }
}
