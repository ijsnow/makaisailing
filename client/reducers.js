import { combineReducers } from 'redux';
import {
  SET_CONFIG,
  SET_PAGE_DATA,
  FETCH_ACTIVITIES,
  FETCH_IMAGES
} from './actions';

function config(state = {}, action) {
  switch (action.type) {
    case SET_CONFIG:
      return action.config;
    default:
      return state;
  }
}

function content(state = {activities: [], images: []}, action) {
  switch (action.type) {
    case SET_PAGE_DATA:
      return action.payload;
    case FETCH_ACTIVITIES:
      return Object.assign(state, {
        activities: action.payload
      });
    case FETCH_IMAGES:
      return Object.assign(state, {
        images: action.payload
      });
    default:
      return state;
  }
}

export default combineReducers({config, content});
