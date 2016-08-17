import * as Api from './api';
/**
 * action types
 */

export const SET_CONFIG = 'SET_CONFIG';
export const SET_PAGE_DATA = 'SET_PAGE_DATA';
export const FETCH_ACTIVITIES = 'FETCH_ACTIVITIES';
export const FETCH_IMAGES = 'FETCH_IMAGES';

/**
 * action creators
 */

export function setConfig(config) {
  return { type: SET_CONFIG, config };
}

export function setPageData(data) {
  return { type: SET_PAGE_DATA, payload: data };
}

export function fetchHomepageData() {
  return dispatch => {
    fetch('/api/page/home').then(r => r.json())
      .then(res => dispatch(setPageData(res)));
  }
}

export function fetchPageData(page) {
  return dispatch => {
    fetch(`/api/page/${page}`).then(r => r.json())
      .then(res => dispatch(setPageData(res)));
  }
}

export function fetchActivities() {
  return dispatch => {
    Api.activities.fetchAll()
      .then(res => dispatch({type: FETCH_ACTIVITIES, payload: res}))
      .catch(err => console.warn(err));
  }
}

export function editActivity(activity) {
  return dispatch => {
    Api.activities.edit(activity)
      .then(res => dispatch(fetchActivities()))
      .catch(err => console.warn(err));
  }
}

export function removeActivity(id) {
  return dispatch => {
    Api.activities.remove(id)
      .then(res => dispatch(fetchActivities()))
      .catch(err => console.log(err));
  }
}

export function fetchImages(isHomePage) {
  return dispatch => {
    Api.images.fetchAll(isHomePage)
      .then(res => dispatch({type: FETCH_IMAGES, payload: res}))
      .catch(err => console.warn(err));
  }
}

export function editImage(image, isHomePage) {
  return dispatch => {
    Api.images.edit(image)
      .then(res => dispatch(fetchImages(isHomePage)))
      .catch(err => console.warn(err));
  }
}

export function removeImage(id, isHomePage) {
  return dispatch => {
    Api.images.remove(id)
      .then(res => dispatch(fetchImages(isHomePage)))
      .catch(err => console.log(err));
  }
}
